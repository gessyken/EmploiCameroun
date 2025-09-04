<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\CandidateProfile;
use App\Models\Company;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_can_apply_for_job()
    {
        // Créer une entreprise et un recruteur
        $company = Company::factory()->create();
        $recruiter = User::factory()->create(['company_id' => $company->id, 'role' => 'recruiter']);
        
        // Créer une offre d'emploi
        $job = JobListing::factory()->create([
            'company_id' => $company->id,
            'user_id' => $recruiter->id,
            'status' => 'approved'
        ]);

        // Créer un candidat avec un profil complet
        $candidate = User::factory()->create(['role' => 'candidate']);
        CandidateProfile::factory()->create([
            'user_id' => $candidate->id,
            'is_complete' => true
        ]);

        $this->actingAs($candidate);

        $applicationData = [
            'cover_letter' => 'Je suis très intéressé par ce poste.'
        ];

        $response = $this->postJson("/api/jobs/{$job->id}/apply", $applicationData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('applications', [
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id,
            'cover_letter' => 'Je suis très intéressé par ce poste.',
            'status' => 'submitted'
        ]);
    }

    public function test_candidate_cannot_apply_without_complete_profile()
    {
        $company = Company::factory()->create();
        $recruiter = User::factory()->create(['company_id' => $company->id, 'role' => 'recruiter']);
        
        $job = JobListing::factory()->create([
            'company_id' => $company->id,
            'user_id' => $recruiter->id,
            'status' => 'approved'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        CandidateProfile::factory()->create([
            'user_id' => $candidate->id,
            'is_complete' => false
        ]);

        $this->actingAs($candidate);

        $response = $this->postJson("/api/jobs/{$job->id}/apply", []);

        $response->assertStatus(403);
    }

    public function test_candidate_cannot_apply_twice_for_same_job()
    {
        $company = Company::factory()->create();
        $recruiter = User::factory()->create(['company_id' => $company->id, 'role' => 'recruiter']);
        
        $job = JobListing::factory()->create([
            'company_id' => $company->id,
            'user_id' => $recruiter->id,
            'status' => 'approved'
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        CandidateProfile::factory()->create([
            'user_id' => $candidate->id,
            'is_complete' => true
        ]);

        // Première candidature
        $this->actingAs($candidate);
        $this->postJson("/api/jobs/{$job->id}/apply", ['cover_letter' => 'Première candidature']);

        // Deuxième candidature
        $response = $this->postJson("/api/jobs/{$job->id}/apply", ['cover_letter' => 'Deuxième candidature']);

        $response->assertStatus(422);
        $this->assertDatabaseCount('applications', 1);
    }

    public function test_candidate_can_view_their_applications()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($candidate);

        $company = Company::factory()->create();
        $recruiter = User::factory()->create(['company_id' => $company->id, 'role' => 'recruiter']);
        
        $job = JobListing::factory()->create([
            'company_id' => $company->id,
            'user_id' => $recruiter->id
        ]);

        Application::factory()->create([
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id
        ]);

        $response = $this->getJson('/api/candidate/applications');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    public function test_recruiter_can_view_applications_for_their_jobs()
    {
        $company = Company::factory()->create();
        $recruiter = User::factory()->create(['company_id' => $company->id, 'role' => 'recruiter']);
        $this->actingAs($recruiter);

        $job = JobListing::factory()->create([
            'company_id' => $company->id,
            'user_id' => $recruiter->id
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        Application::factory()->create([
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id
        ]);

        $response = $this->getJson('/api/recruiter/applications');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
    }

    public function test_recruiter_can_update_application_status()
    {
        $company = Company::factory()->create();
        $recruiter = User::factory()->create(['company_id' => $company->id, 'role' => 'recruiter']);
        $this->actingAs($recruiter);

        $job = JobListing::factory()->create([
            'company_id' => $company->id,
            'user_id' => $recruiter->id
        ]);

        $candidate = User::factory()->create(['role' => 'candidate']);
        $application = Application::factory()->create([
            'job_listing_id' => $job->id,
            'candidate_id' => $candidate->id,
            'status' => 'submitted'
        ]);

        $response = $this->postJson("/api/recruiter/applications/{$application->id}/status", [
            'status' => 'shortlisted'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('applications', [
            'id' => $application->id,
            'status' => 'shortlisted'
        ]);
    }

    public function test_unauthenticated_user_cannot_apply()
    {
        $company = Company::factory()->create();
        $recruiter = User::factory()->create(['company_id' => $company->id, 'role' => 'recruiter']);
        
        $job = JobListing::factory()->create([
            'company_id' => $company->id,
            'user_id' => $recruiter->id,
            'status' => 'approved'
        ]);

        $response = $this->postJson("/api/jobs/{$job->id}/apply", []);

        $response->assertStatus(401);
    }
}