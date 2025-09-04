<?php

namespace Tests\Feature;

use App\Models\JobAlert;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JobAlertTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_can_create_job_alert()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($candidate);

        $alertData = [
            'title' => 'Développeur Laravel',
            'location' => 'Yaoundé',
            'job_type' => 'full_time',
            'keywords' => ['PHP', 'Laravel', 'MySQL'],
            'excluded_keywords' => ['WordPress']
        ];

        $response = $this->postJson('/api/candidate/job-alerts', $alertData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('job_alerts', [
            'user_id' => $candidate->id,
            'title' => 'Développeur Laravel',
            'location' => 'Yaoundé',
            'job_type' => 'full_time'
        ]);
    }

    public function test_candidate_can_view_their_job_alerts()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($candidate);

        JobAlert::factory()->count(3)->create(['user_id' => $candidate->id]);

        $response = $this->getJson('/api/candidate/job-alerts');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
    }

    public function test_candidate_can_update_job_alert()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($candidate);

        $alert = JobAlert::factory()->create([
            'user_id' => $candidate->id,
            'title' => 'Ancien titre'
        ]);

        $updateData = [
            'title' => 'Nouveau titre',
            'location' => 'Douala'
        ];

        $response = $this->putJson("/api/candidate/job-alerts/{$alert->id}", $updateData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('job_alerts', [
            'id' => $alert->id,
            'title' => 'Nouveau titre',
            'location' => 'Douala'
        ]);
    }

    public function test_candidate_can_toggle_job_alert()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($candidate);

        $alert = JobAlert::factory()->create([
            'user_id' => $candidate->id,
            'is_active' => true
        ]);

        $response = $this->postJson("/api/candidate/job-alerts/{$alert->id}/toggle");

        $response->assertStatus(200);
        $this->assertDatabaseHas('job_alerts', [
            'id' => $alert->id,
            'is_active' => false
        ]);
    }

    public function test_candidate_can_delete_job_alert()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($candidate);

        $alert = JobAlert::factory()->create(['user_id' => $candidate->id]);

        $response = $this->deleteJson("/api/candidate/job-alerts/{$alert->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('job_alerts', ['id' => $alert->id]);
    }

    public function test_candidate_can_test_job_alert()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($candidate);

        $alert = JobAlert::factory()->create([
            'user_id' => $candidate->id,
            'title' => 'Développeur'
        ]);

        $response = $this->postJson("/api/candidate/job-alerts/{$alert->id}/test");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'matching_jobs_count',
            'jobs'
        ]);
    }

    public function test_candidate_cannot_access_other_users_alerts()
    {
        $candidate1 = User::factory()->create(['role' => 'candidate']);
        $candidate2 = User::factory()->create(['role' => 'candidate']);
        
        $alert = JobAlert::factory()->create(['user_id' => $candidate2->id]);

        $this->actingAs($candidate1);

        $response = $this->getJson("/api/candidate/job-alerts/{$alert->id}");

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_alerts()
    {
        $response = $this->getJson('/api/candidate/job-alerts');

        $response->assertStatus(401);
    }

    public function test_job_alert_validation_works()
    {
        $candidate = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($candidate);

        $invalidData = [
            'job_type' => 'invalid_type',
            'keywords' => 'not_an_array'
        ];

        $response = $this->postJson('/api/candidate/job-alerts', $invalidData);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['job_type', 'keywords']);
    }
}