<?php

namespace Database\Factories;

use App\Models\CandidateProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CandidateProfile>
 */
class CandidateProfileFactory extends Factory
{
    protected $model = CandidateProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'phone_number' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'date_of_birth' => $this->faker->date(),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'bio' => $this->faker->paragraph(),
            'linkedin_url' => $this->faker->url(),
            'github_url' => $this->faker->url(),
            'portfolio_url' => $this->faker->url(),
            'is_complete' => $this->faker->boolean(80),
        ];
    }
}