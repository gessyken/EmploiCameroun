<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JobSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_search_jobs_by_title()
    {
        // Créer une entreprise et un utilisateur
        $company = Company::factory()->create();
        $user = User::factory()->create(['company_id' => $company->id]);

        // Créer des offres d'emploi
        JobListing::factory()->create([
            'title' => 'Développeur Laravel',
            'company_id' => $company->id,
            'user_id' => $user->id,
            'status' => 'approved'
        ]);

        JobListing::factory()->create([
            'title' => 'Développeur React',
            'company_id' => $company->id,
            'user_id' => $user->id,
            'status' => 'approved'
        ]);

        // Rechercher par titre
        $response = $this->getJson('/api/search/jobs?title=Laravel');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.title', 'Développeur Laravel');
    }

    public function test_can_search_jobs_by_location()
    {
        $company = Company::factory()->create();
        $user = User::factory()->create(['company_id' => $company->id]);

        JobListing::factory()->create([
            'location' => 'Yaoundé',
            'company_id' => $company->id,
            'user_id' => $user->id,
            'status' => 'approved'
        ]);

        JobListing::factory()->create([
            'location' => 'Douala',
            'company_id' => $company->id,
            'user_id' => $user->id,
            'status' => 'approved'
        ]);

        $response = $this->getJson('/api/search/jobs?location=Yaoundé');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.location', 'Yaoundé');
    }

    public function test_can_search_jobs_by_job_type()
    {
        $company = Company::factory()->create();
        $user = User::factory()->create(['company_id' => $company->id]);

        JobListing::factory()->create([
            'job_type' => 'full_time',
            'company_id' => $company->id,
            'user_id' => $user->id,
            'status' => 'approved'
        ]);

        JobListing::factory()->create([
            'job_type' => 'part_time',
            'company_id' => $company->id,
            'user_id' => $user->id,
            'status' => 'approved'
        ]);

        $response = $this->getJson('/api/search/jobs?job_type=full_time');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.job_type', 'full_time');
    }

    public function test_only_approved_jobs_are_returned()
    {
        $company = Company::factory()->create();
        $user = User::factory()->create(['company_id' => $company->id]);

        JobListing::factory()->create([
            'status' => 'approved',
            'company_id' => $company->id,
            'user_id' => $user->id
        ]);

        JobListing::factory()->create([
            'status' => 'pending',
            'company_id' => $company->id,
            'user_id' => $user->id
        ]);

        JobListing::factory()->create([
            'status' => 'rejected',
            'company_id' => $company->id,
            'user_id' => $user->id
        ]);

        $response = $this->getJson('/api/search/jobs');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.status', 'approved');
    }

    public function test_can_get_skills_list()
    {
        $response = $this->getJson('/api/search/skills');

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
    }

    public function test_can_get_companies_list()
    {
        Company::factory()->count(3)->create();

        $response = $this->getJson('/api/search/companies');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }
}