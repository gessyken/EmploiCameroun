<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    public function jobs(Request $request)
    {
        $query = JobListing::where('status', 'approved')
            ->where('deadline', '>=', now())
            ->with(['company', 'applications']);

        // Filtres de base
        if ($request->has('title') && $request->title) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('location') && $request->location) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('job_type') && $request->job_type) {
            $query->where('job_type', $request->job_type);
        }

        if ($request->has('salary_min') && $request->salary_min) {
            $query->where('salary_max', '>=', $request->salary_min);
        }

        if ($request->has('salary_max') && $request->salary_max) {
            $query->where('salary_min', '<=', $request->salary_max);
        }

        if ($request->has('company_id') && $request->company_id) {
            $query->where('company_id', $request->company_id);
        }

        // Filtre par compétences
        if ($request->has('skills') && is_array($request->skills)) {
            $query->whereHas('company', function ($q) use ($request) {
                $q->whereHas('recruiters', function ($q2) use ($request) {
                    $q2->whereHas('candidateProfile', function ($q3) use ($request) {
                        $q3->whereHas('skills', function ($q4) use ($request) {
                            $q4->whereIn('skills.id', $request->skills);
                        });
                    });
                });
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        switch ($sortBy) {
            case 'salary':
                $query->orderBy('salary_max', $sortOrder);
                break;
            case 'deadline':
                $query->orderBy('deadline', $sortOrder);
                break;
            case 'views':
                $query->orderBy('views_count', $sortOrder);
                break;
            default:
                $query->orderBy('created_at', $sortOrder);
        }

        $jobs = $query->paginate($request->get('per_page', 15));

        // Ajouter le score de matching si l'utilisateur est connecté
        if (Auth::check() && Auth::user()->candidateProfile) {
            $jobs->getCollection()->transform(function ($job) {
                $job->matching_score = $this->calculateMatchingScore($job, Auth::user()->candidateProfile);
                return $job;
            });
        }

        return response()->json($jobs);
    }

    public function skills(Request $request)
    {
        $query = Skill::query();

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        $skills = $query->orderBy('name')->get();

        return response()->json($skills);
    }

    public function companies(Request $request)
    {
        $query = \App\Models\Company::query();

        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $companies = $query->orderBy('name')->get();

        return response()->json($companies);
    }

    public function suggestions(Request $request)
    {
        $suggestions = [];

        // Suggestions de compétences
        if ($request->has('query') && $request->query) {
            $skills = Skill::where('name', 'like', '%' . $request->query . '%')
                ->limit(5)
                ->get()
                ->map(function ($skill) {
                    return [
                        'type' => 'skill',
                        'value' => $skill->name,
                        'id' => $skill->id
                    ];
                });

            $suggestions = array_merge($suggestions, $skills->toArray());
        }

        return response()->json($suggestions);
    }

    private function calculateMatchingScore($job, $candidateProfile)
    {
        $score = 0;
        $maxScore = 100;

        // Score basé sur les compétences (40 points)
        if ($candidateProfile->skills->count() > 0) {
            $jobSkills = $this->extractSkillsFromJob($job);
            $candidateSkills = $candidateProfile->skills->pluck('name')->toArray();
            
            $matchingSkills = array_intersect($jobSkills, $candidateSkills);
            $skillScore = (count($matchingSkills) / max(count($jobSkills), 1)) * 40;
            $score += $skillScore;
        }

        // Score basé sur l'expérience (30 points)
        $experienceScore = min($candidateProfile->experiences->count() * 5, 30);
        $score += $experienceScore;

        // Score basé sur la localisation (20 points)
        if ($candidateProfile->address && $job->location) {
            $locationMatch = $this->calculateLocationMatch($candidateProfile->address, $job->location);
            $score += $locationMatch * 20;
        }

        // Score basé sur le type d'emploi (10 points)
        // Cette logique peut être étendue selon les préférences du candidat
        $score += 10;

        return min(round($score), $maxScore);
    }

    private function extractSkillsFromJob($job)
    {
        $text = strtolower($job->title . ' ' . $job->description . ' ' . $job->requirements);
        
        // Liste des compétences techniques communes
        $commonSkills = [
            'php', 'laravel', 'javascript', 'react', 'vue', 'angular', 'node.js',
            'python', 'django', 'flask', 'java', 'spring', 'c#', '.net',
            'mysql', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes',
            'aws', 'azure', 'git', 'linux', 'html', 'css', 'bootstrap',
            'tailwind', 'sass', 'less', 'webpack', 'vite', 'npm', 'yarn'
        ];

        $foundSkills = [];
        foreach ($commonSkills as $skill) {
            if (strpos($text, $skill) !== false) {
                $foundSkills[] = $skill;
            }
        }

        return $foundSkills;
    }

    private function calculateLocationMatch($candidateAddress, $jobLocation)
    {
        // Logique simple de matching de localisation
        // Dans une vraie application, on utiliserait une API de géolocalisation
        $candidateCity = strtolower(explode(',', $candidateAddress)[0]);
        $jobCity = strtolower(explode(',', $jobLocation)[0]);

        if ($candidateCity === $jobCity) {
            return 1.0; // Même ville
        }

        // Vérifier si c'est dans la même région (logique simplifiée)
        $candidateRegion = $this->getRegionFromCity($candidateCity);
        $jobRegion = $this->getRegionFromCity($jobCity);

        if ($candidateRegion === $jobRegion) {
            return 0.7; // Même région
        }

        return 0.3; // Différentes régions
    }

    private function getRegionFromCity($city)
    {
        // Logique simplifiée pour déterminer la région
        $regions = [
            'centre' => ['yaoundé', 'yaounde', 'mbalmayo', 'monatélé'],
            'littoral' => ['douala', 'limbe', 'kribi', 'edéa'],
            'ouest' => ['bafoussam', 'bamenda', 'dschang', 'foumban'],
            'nord' => ['garoua', 'maroua', 'ngaoundéré', 'bertoua'],
            'sud' => ['eyomojock', 'kribi', 'sangmélima'],
        ];

        foreach ($regions as $region => $cities) {
            if (in_array($city, $cities)) {
                return $region;
            }
        }

        return 'unknown';
    }
}