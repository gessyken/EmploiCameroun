<?php

namespace Tests\Feature\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class JobListingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_recruiter_can_create_job(): void
    {
        $company = Company::factory()->create();
        $user = User::factory()->recruiter()->create([
            'company_id' => $company->id,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/recruiter/jobs', [
            'title' => 'Développeur Laravel',
            'description' => 'Description du poste',
            'requirements' => 'Compétences requises',
            'job_type' => 'full_time',
            'location' => 'Yaoundé',
            'salary_min' => 500000,
            'salary_max' => 800000,
            'deadline' => now()->addMonth()->format('Y-m-d'),
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('job_listings', [
            'title' => 'Développeur Laravel',
            'status' => 'pending',
            'company_id' => $company->id,
            'user_id' => $user->id,
        ]);
    }
}
