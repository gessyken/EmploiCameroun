<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Models\JobListing;
use App\Notifications\NewApplicationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    public function index()
    {
        $applications = Auth::user()->applications()->with('jobListing.company')->latest()->paginate(20);
        // return view('candidate.applications.index', compact('applications'));
        return response()->json($applications);
    }

    public function create(JobListing $job)
    {
        // Verify that the candidate has a complete profile
        if (!Auth::user()->candidateProfile || !Auth::user()->candidateProfile->is_complete) {
            // return redirect()->route('candidate.profile.create')
            //     ->with('error', 'Complete your profile before applying');
            return response('Please complete your profile before applying', 403);
        }

        // return view('applications.create', compact('job'));
        return response('Application form will be here');
    }

    public function store(StoreApplicationRequest $request, JobListing $job)
    {
        // Verify that the user has not already applied
        if ($job->applications()->where('candidate_id', Auth::id())->exists()) {
            // return back()->with('error', 'You have already applied to this offer');
            return response('You have already applied to this offer', 422);
        }

        // Create the application
        $application = $job->applications()->create([
            'candidate_id' => Auth::id(),
            'cover_letter' => $request->cover_letter,
            'status' => 'submitted'
        ]);

        // Notify the recruiter
        $job->recruiter->notify(new NewApplicationNotification($application));

        // return redirect()->route('candidate.applications.index')
        //     ->with('success', 'Application sent successfully!');
        return response('Application sent successfully!');
    }
}
