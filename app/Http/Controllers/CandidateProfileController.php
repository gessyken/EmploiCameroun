<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCandidateProfileRequest;
use App\Models\Skill;
use App\Models\Experience;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CandidateProfileController extends Controller
{
    public function show()
    {
        $profile = Auth::user()->candidateProfile;
        
        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        return response()->json($profile->load(['skills', 'experiences', 'educations']));
    }

    public function create()
    {
        $skills = Skill::all();
        return response()->json(['skills' => $skills]);
    }

    public function store(StoreCandidateProfileRequest $request)
    {
        $validated = $request->validated();

        // Créer ou mettre à jour le profil
        $profile = Auth::user()->candidateProfile()->updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );

        // Traiter les compétences
        if ($request->has('skills')) {
            $skills = is_string($request->skills) ? json_decode($request->skills, true) : $request->skills;
            $this->processSkills($profile, $skills);
        }

        // Traiter les expériences
        if ($request->has('experiences')) {
            $experiences = is_string($request->experiences) ? json_decode($request->experiences, true) : $request->experiences;
            $this->processExperiences($profile, $experiences);
        }

        // Traiter les formations
        if ($request->has('educations')) {
            $educations = is_string($request->educations) ? json_decode($request->educations, true) : $request->educations;
            $this->processEducations($profile, $educations);
        }

        // Traiter le CV
        if ($request->hasFile('resume')) {
            $this->processResume($profile, $request->file('resume'));
        }

        // Marquer le profil comme complet
        $profile->update(['is_complete' => true]);

        return response()->json([
            'message' => 'Profil créé avec succès!',
            'profile' => $profile->load(['skills', 'experiences', 'educations'])
        ]);
    }

    public function update(StoreCandidateProfileRequest $request)
    {
        $profile = Auth::user()->candidateProfile;
        
        if (!$profile) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        $validated = $request->validated();
        $profile->update($validated);

        // Traiter les compétences
        if ($request->has('skills')) {
            $skills = is_string($request->skills) ? json_decode($request->skills, true) : $request->skills;
            $this->processSkills($profile, $skills);
        }

        // Traiter les expériences
        if ($request->has('experiences')) {
            $experiences = is_string($request->experiences) ? json_decode($request->experiences, true) : $request->experiences;
            $this->processExperiences($profile, $experiences);
        }

        // Traiter les formations
        if ($request->has('educations')) {
            $educations = is_string($request->educations) ? json_decode($request->educations, true) : $request->educations;
            $this->processEducations($profile, $educations);
        }

        return response()->json([
            'message' => 'Profil mis à jour avec succès!',
            'profile' => $profile->load(['skills', 'experiences', 'educations'])
        ]);
    }

    private function processSkills($profile, $skills)
    {
        $skillData = [];
        foreach ($skills as $skill) {
            $skillData[$skill['id']] = ['level' => $skill['level'] ?? 'intermediate'];
        }
        $profile->skills()->sync($skillData);
    }

    private function processExperiences($profile, $experiences)
    {
        // Supprimer les expériences existantes
        $profile->experiences()->delete();
        
        // Créer les nouvelles expériences
        foreach ($experiences as $experience) {
            $profile->experiences()->create($experience);
        }
    }

    private function processEducations($profile, $educations)
    {
        // Supprimer les formations existantes
        $profile->educations()->delete();
        
        // Créer les nouvelles formations
        foreach ($educations as $education) {
            $profile->educations()->create($education);
        }
    }

    private function processResume($profile, $file)
    {
        // Supprimer l'ancien CV s'il existe
        if ($profile->resume_path && Storage::exists($profile->resume_path)) {
            Storage::delete($profile->resume_path);
        }

        // Stocker le nouveau CV
        $path = $file->store('resumes', 'public');
        $profile->update(['resume_path' => $path]);
    }
}
