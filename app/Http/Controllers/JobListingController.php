<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreJobListingRequest;
use App\Models\User;
use App\Notifications\NewJobListingNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobListingController extends Controller
{
    public function index()
    {
        $jobs = Auth::user()->jobListings()->with(['applications', 'company'])->get();
        return response()->json($jobs);
    }

    public function create()
    {
        // Verify that the user has a company
        if (!Auth::user()->company) {
            // This route does not exist yet, will be created later.
            // return redirect()->route('recruiter.company.create')
            //     ->with('error', 'You must first create a company');
            // For now, let's assume the view exists
        }

        // This view does not exist yet, will be created later.
        // return view('recruiter.jobs.create');
        return response('Create job form will be here');
    }

    public function store(StoreJobListingRequest $request)
    {
        $validated = $request->validated();

        // Create the offer with "pending" status
        $job = Auth::user()->jobListings()->create([
            ...$validated,
            'status' => 'pending',
            'company_id' => Auth::user()->company_id ?? 1 // Utiliser 1 comme valeur par défaut ou créer une entreprise par défaut
        ]);

        // Notify administrators
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new NewJobListingNotification($job));
        }

        return response()->json([
            'message' => 'Offre d\'emploi soumise pour validation',
            'job' => $job
        ]);
    }
}
