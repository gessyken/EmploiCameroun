<?php

namespace App\Http\Controllers;

use App\Models\JobAlert;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class JobAlertController extends Controller
{
    public function index()
    {
        $alerts = Auth::user()->jobAlerts()
            ->latest()
            ->paginate(20);

        return response()->json($alerts);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'job_type' => 'nullable|string|in:full_time,part_time,contract,internship',
            'keywords' => 'nullable|array',
            'excluded_keywords' => 'nullable|array',
        ]);

        $alert = Auth::user()->jobAlerts()->create($request->all());

        return response()->json([
            'message' => 'Alerte créée avec succès',
            'alert' => $alert
        ]);
    }

    public function show(JobAlert $alert)
    {
        $this->authorize('view', $alert);

        return response()->json($alert);
    }

    public function update(Request $request, JobAlert $alert)
    {
        $this->authorize('update', $alert);

        $request->validate([
            'title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'job_type' => 'nullable|string|in:full_time,part_time,contract,internship',
            'keywords' => 'nullable|array',
            'excluded_keywords' => 'nullable|array',
            'is_active' => 'nullable|boolean',
        ]);

        $alert->update($request->all());

        return response()->json([
            'message' => 'Alerte mise à jour avec succès',
            'alert' => $alert
        ]);
    }

    public function destroy(JobAlert $alert)
    {
        $this->authorize('delete', $alert);

        $alert->delete();

        return response()->json(['message' => 'Alerte supprimée avec succès']);
    }

    public function toggle(JobAlert $alert)
    {
        $this->authorize('update', $alert);

        $alert->update(['is_active' => !$alert->is_active]);

        return response()->json([
            'message' => $alert->is_active ? 'Alerte activée' : 'Alerte désactivée',
            'alert' => $alert
        ]);
    }

    public function test(JobAlert $alert)
    {
        $this->authorize('view', $alert);

        $jobs = $this->getMatchingJobs($alert);

        return response()->json([
            'message' => 'Test d\'alerte effectué',
            'matching_jobs_count' => $jobs->count(),
            'jobs' => $jobs->take(5) // Afficher seulement les 5 premiers
        ]);
    }

    private function getMatchingJobs(JobAlert $alert)
    {
        $query = JobListing::where('status', 'approved')
            ->where('deadline', '>=', now());

        if ($alert->title) {
            $query->where('title', 'like', '%' . $alert->title . '%');
        }

        if ($alert->location) {
            $query->where('location', 'like', '%' . $alert->location . '%');
        }

        if ($alert->job_type) {
            $query->where('job_type', $alert->job_type);
        }

        if ($alert->keywords) {
            foreach ($alert->keywords as $keyword) {
                $query->where(function ($q) use ($keyword) {
                    $q->where('title', 'like', '%' . $keyword . '%')
                      ->orWhere('description', 'like', '%' . $keyword . '%')
                      ->orWhere('requirements', 'like', '%' . $keyword . '%');
                });
            }
        }

        if ($alert->excluded_keywords) {
            foreach ($alert->excluded_keywords as $keyword) {
                $query->where(function ($q) use ($keyword) {
                    $q->where('title', 'not like', '%' . $keyword . '%')
                      ->where('description', 'not like', '%' . $keyword . '%')
                      ->where('requirements', 'not like', '%' . $keyword . '%');
                });
            }
        }

        return $query->with('company')->get();
    }
}