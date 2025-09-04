<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobSearchController;
use App\Http\Controllers\CandidateProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\RecruiterApplicationController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\Admin\AdminJobController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\JobAlertController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\NotificationController;

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);

// Public Job Search Routes
Route::get('/jobs', [JobSearchController::class, 'index']);
Route::get('/jobs/{job}', [JobSearchController::class, 'show']);

// Public Search Routes
Route::get('/search/jobs', [SearchController::class, 'jobs']);
Route::get('/search/skills', [SearchController::class, 'skills']);
Route::get('/search/companies', [SearchController::class, 'companies']);
Route::get('/search/suggestions', [SearchController::class, 'suggestions']);

// Candidate Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('candidate')->group(function () {
        // Profil candidat
        Route::get('/profile', [CandidateProfileController::class, 'show']);
        Route::post('/profile', [CandidateProfileController::class, 'store']);
        Route::put('/profile', [CandidateProfileController::class, 'update']);
        Route::get('/profile/create', [CandidateProfileController::class, 'create']);
        
        // Candidatures
        Route::get('/applications', [ApplicationController::class, 'index']);
        
        // Favoris
        Route::get('/favorites', [FavoriteController::class, 'index']);
        Route::post('/favorites/{job}', [FavoriteController::class, 'store']);
        Route::delete('/favorites/{job}', [FavoriteController::class, 'destroy']);
        Route::post('/favorites/{job}/toggle', [FavoriteController::class, 'toggle']);
        
        // Alertes d'emploi
        Route::get('/job-alerts', [JobAlertController::class, 'index']);
        Route::post('/job-alerts', [JobAlertController::class, 'store']);
        Route::get('/job-alerts/{alert}', [JobAlertController::class, 'show']);
        Route::put('/job-alerts/{alert}', [JobAlertController::class, 'update']);
        Route::delete('/job-alerts/{alert}', [JobAlertController::class, 'destroy']);
        Route::post('/job-alerts/{alert}/toggle', [JobAlertController::class, 'toggle']);
        Route::post('/job-alerts/{alert}/test', [JobAlertController::class, 'test']);
        
        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unread']);
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    });

    Route::post('/jobs/{job}/apply', [ApplicationController::class, 'store']);
});

// Recruiter Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('recruiter')->group(function () {
        Route::post('/jobs', [JobListingController::class, 'store']);
        Route::get('/jobs', [JobListingController::class, 'index']);
        Route::get('/applications', [RecruiterApplicationController::class, 'index']);
        Route::get('/applications/{application}', [RecruiterApplicationController::class, 'show']);
        Route::post('/applications/{application}/status', [RecruiterApplicationController::class, 'updateStatus']);
    });
});

// Admin Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::get('/jobs/pending', [AdminJobController::class, 'pending']);
        Route::get('/jobs/{job}/review', [AdminJobController::class, 'review']);
        Route::post('/jobs/{job}/approve', [AdminJobController::class, 'approve']);
        Route::post('/jobs/{job}/reject', [AdminJobController::class, 'reject']);
    });
});
