<?php

namespace Tests\Feature;

use App\Models\CandidateProfile;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CandidateProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_can_create_profile()
    {
        $user = User::factory()->create(['role' => 'candidate']);
        
        $this->actingAs($user);

        $profileData = [
            'phone_number' => '+237123456789',
            'address' => 'Yaoundé, Cameroun',
            'date_of_birth' => '1990-01-01',
            'gender' => 'male',
            'bio' => 'Développeur passionné',
            'linkedin_url' => 'https://linkedin.com/in/test',
            'github_url' => 'https://github.com/test',
            'portfolio_url' => 'https://test.com',
            'skills' => []
        ];

        $response = $this->postJson('/api/candidate/profile', $profileData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('candidate_profiles', [
            'user_id' => $user->id,
            'phone_number' => '+237123456789',
            'bio' => 'Développeur passionné'
        ]);
    }

    public function test_candidate_can_update_profile()
    {
        $user = User::factory()->create(['role' => 'candidate']);
        $profile = CandidateProfile::factory()->create(['user_id' => $user->id]);
        
        $this->actingAs($user);

        $updateData = [
            'phone_number' => '+237987654321',
            'bio' => 'Développeur senior'
        ];

        $response = $this->putJson('/api/candidate/profile', $updateData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('candidate_profiles', [
            'user_id' => $user->id,
            'phone_number' => '+237987654321',
            'bio' => 'Développeur senior'
        ]);
    }

    public function test_candidate_can_add_skills_to_profile()
    {
        $user = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($user);

        // Créer des compétences
        $skill1 = Skill::factory()->create(['name' => 'PHP']);
        $skill2 = Skill::factory()->create(['name' => 'Laravel']);

        $profileData = [
            'phone_number' => '+237123456789',
            'skills' => [
                ['id' => $skill1->id, 'level' => 'advanced'],
                ['id' => $skill2->id, 'level' => 'intermediate']
            ]
        ];

        $response = $this->postJson('/api/candidate/profile', $profileData);

        $response->assertStatus(200);
        
        $profile = CandidateProfile::where('user_id', $user->id)->first();
        $this->assertEquals(2, $profile->skills()->count());
        $this->assertTrue($profile->skills->contains($skill1));
        $this->assertTrue($profile->skills->contains($skill2));
    }

    public function test_candidate_can_upload_resume()
    {
        Storage::fake('public');
        
        $user = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($user);

        $file = UploadedFile::fake()->create('resume.pdf', 1000, 'application/pdf');

        $profileData = [
            'phone_number' => '+237123456789',
            'resume' => $file
        ];

        $response = $this->postJson('/api/candidate/profile', $profileData);

        $response->assertStatus(200);
        
        $profile = CandidateProfile::where('user_id', $user->id)->first();
        $this->assertNotNull($profile->resume_path);
        Storage::disk('public')->assertExists($profile->resume_path);
    }

    public function test_candidate_can_view_profile()
    {
        $user = User::factory()->create(['role' => 'candidate']);
        $profile = CandidateProfile::factory()->create(['user_id' => $user->id]);
        
        $this->actingAs($user);

        $response = $this->getJson('/api/candidate/profile');

        $response->assertStatus(200);
        $response->assertJsonPath('id', $profile->id);
    }

    public function test_unauthenticated_user_cannot_access_profile()
    {
        $response = $this->getJson('/api/candidate/profile');

        $response->assertStatus(401);
    }

    public function test_profile_validation_works()
    {
        $user = User::factory()->create(['role' => 'candidate']);
        $this->actingAs($user);

        $invalidData = [
            'phone_number' => 'invalid-phone',
            'gender' => 'invalid-gender',
            'linkedin_url' => 'not-a-url'
        ];

        $response = $this->postJson('/api/candidate/profile', $invalidData);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['phone_number', 'gender', 'linkedin_url']);
    }
}