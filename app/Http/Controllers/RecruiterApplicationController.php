<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Notifications\ApplicationStatusUpdatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecruiterApplicationController extends Controller
{
    public function index(Request $request)
    {
        $applications = Application::whereHas('jobListing', function ($query) {
            $query->where('user_id', Auth::id());
        })->with(['candidate', 'jobListing'])
        ->latest()
        ->paginate(20);

        // return view('recruiter.applications.index', compact('applications'));
        return response()->json($applications);
    }

    public function show(Application $application)
    {
        // Verify that the application belongs to the recruiter
        if ($application->jobListing->user_id !== Auth::id()) {
            return response()->json(['message' => 'Candidature non trouvée'], 404);
        }

        // return view('recruiter.applications.show', compact('application'));
        return response()->json($application->load('candidate.candidateProfile', 'jobListing'));
    }

    public function updateStatus(Request $request, Application $application)
    {
        // Verify that the application belongs to the recruiter
        if ($application->jobListing->user_id !== Auth::id()) {
            return response()->json(['message' => 'Candidature non trouvée'], 404);
        }

        $request->validate([
            'status' => 'required|string|in:shortlisted,rejected,hired',
        ]);

        $application->update(['status' => $request->status]);

        // Notify the candidate
        $application->candidate->notify(
            new ApplicationStatusUpdatedNotification($application)
        );

        return response()->json(['message' => 'Statut mis à jour avec succès']);
    }
}
