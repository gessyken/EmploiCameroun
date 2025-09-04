<?php

namespace Database\Factories;

use App\Models\JobListing;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobListing>
 */
class JobListingFactory extends Factory
{
    protected $model = JobListing::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'user_id' => User::factory(),
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->paragraphs(3, true),
            'requirements' => $this->faker->paragraphs(2, true),
            'job_type' => $this->faker->randomElement(['full_time', 'part_time', 'contract', 'internship']),
            'location' => $this->faker->city(),
            'salary_min' => $this->faker->numberBetween(200000, 500000),
            'salary_max' => $this->faker->numberBetween(500000, 2000000),
            'deadline' => $this->faker->dateTimeBetween('now', '+3 months'),
            'status' => $this->faker->randomElement(['draft', 'pending', 'approved', 'rejected', 'closed']),
            'views_count' => $this->faker->numberBetween(0, 1000),
        ];
    }
}