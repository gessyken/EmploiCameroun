<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use Illuminate\Http\Request;

class JobSearchController extends Controller
{
    public function index(Request $request)
    {
        $query = JobListing::where('status', 'approved')
            ->where('deadline', '>=', now());

        // Search filters
        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        $jobs = $query->with('company')->paginate(15);

        // return view('jobs.index', compact('jobs'));
        return response()->json($jobs);
    }

    public function show(JobListing $job)
    {
        // Record the view for statistics
        $job->increment('views_count');

        // return view('jobs.show', compact('job'));
        return response()->json($job->load('company'));
    }
}
