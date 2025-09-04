<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'job_listing_id' => JobListing::factory(),
            'candidate_id' => User::factory(),
            'cover_letter' => $this->faker->paragraphs(2, true),
            'status' => $this->faker->randomElement(['submitted', 'reviewed', 'shortlisted', 'rejected', 'hired']),
        ];
    }
}