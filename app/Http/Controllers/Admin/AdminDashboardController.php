<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_companies' => Company::count(),
            'total_jobs' => JobListing::count(),
            'pending_jobs' => JobListing::where('status', 'pending')->count(),
            'total_applications' => Application::count(),
        ];

        $recentJobs = JobListing::with('company')
            ->latest()
            ->take(10)
            ->get();

        $recentApplications = Application::with(['jobListing', 'candidate'])
            ->latest()
            ->take(10)
            ->get();

        // return view('admin.dashboard', compact('stats', 'recentJobs', 'recentApplications'));
        return response()->json(compact('stats', 'recentJobs', 'recentApplications'));
    }
}
