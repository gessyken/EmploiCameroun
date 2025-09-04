<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Notifications\JobApprovedNotification;
use App\Notifications\JobRejectedNotification;
use Illuminate\Http\Request;

class AdminJobController extends Controller
{
    public function pending()
    {
        $jobs = JobListing::where('status', 'pending')
            ->with(['company', 'recruiter'])
            ->paginate(20);

        // return view('admin.jobs.pending', compact('jobs'));
        return response()->json($jobs);
    }

    public function review(JobListing $job)
    {
        // return view('admin.jobs.review', compact('job'));
        return response()->json($job->load('company', 'recruiter'));
    }

    public function approve(JobListing $job)
    {
        $job->update(['status' => 'approved']);

        // Notify the recruiter
        $job->recruiter->notify(new JobApprovedNotification($job));

        // return redirect()->route('admin.jobs.pending')
        //     ->with('success', 'Offer approved');
        return response('Offer approved');
    }

    public function reject(Request $request, JobListing $job)
    {
        $request->validate(['rejection_reason' => 'required|string']);

        $job->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason
        ]);

        // Notify the recruiter
        $job->recruiter->notify(new JobRejectedNotification($job));

        // return redirect()->route('admin.jobs.pending')
        //     ->with('success', 'Offer rejected');
        return response('Offer rejected');
    }
}
