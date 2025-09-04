<?php

namespace Database\Factories;

use App\Models\JobAlert;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobAlert>
 */
class JobAlertFactory extends Factory
{
    protected $model = JobAlert::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->jobTitle(),
            'location' => $this->faker->city(),
            'job_type' => $this->faker->randomElement(['full_time', 'part_time', 'contract', 'internship']),
            'keywords' => $this->faker->words(3),
            'excluded_keywords' => $this->faker->words(2),
            'is_active' => $this->faker->boolean(80),
            'last_sent_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}