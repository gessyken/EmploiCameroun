<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Créer un utilisateur admin
        User::firstOrCreate(
            ['email' => 'admin@emploi.cm'],
            [
                'name' => 'Administrateur',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Créer un utilisateur candidat de test
        User::firstOrCreate(
            ['email' => 'candidate@test.com'],
            [
                'name' => 'Candidat Test',
                'password' => Hash::make('password'),
                'role' => 'candidate',
                'email_verified_at' => now(),
            ]
        );
    }
}
