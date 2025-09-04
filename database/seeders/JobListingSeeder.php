<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JobListing;
use App\Models\Company;
use App\Models\User;

class JobListingSeeder extends Seeder
{
    public function run(): void
    {
        // Créer des entreprises
        $companies = [
            [
                'name' => 'Orange Cameroun',
                'description' => 'Opérateur de télécommunications leader au Cameroun',
                'address' => 'Douala, Cameroun',
                'website' => 'https://orange.cm',
                'logo' => null,
            ],
            [
                'name' => 'MTN Cameroun',
                'description' => 'Opérateur de télécommunications mobile',
                'address' => 'Yaoundé, Cameroun',
                'website' => 'https://mtn.cm',
                'logo' => null,
            ],
            [
                'name' => 'Ecobank Cameroun',
                'description' => 'Banque panafricaine',
                'address' => 'Douala, Cameroun',
                'website' => 'https://ecobank.com',
                'logo' => null,
            ],
            [
                'name' => 'Socapalm',
                'description' => 'Société camerounaise de palmeraies',
                'address' => 'Kribi, Cameroun',
                'website' => 'https://socapalm.com',
                'logo' => null,
            ],
            [
                'name' => 'Canal+ Cameroun',
                'description' => 'Chaîne de télévision',
                'address' => 'Yaoundé, Cameroun',
                'website' => 'https://canalplus.cm',
                'logo' => null,
            ],
        ];

        // Créer un utilisateur recruteur
        $recruiter = User::firstOrCreate(
            ['email' => 'recruiter@test.com'],
            [
                'name' => 'Recruteur Test',
                'password' => bcrypt('password'),
                'role' => 'recruiter',
                'email_verified_at' => now(),
            ]
        );

        // Créer des entreprises avec owner_id
        foreach ($companies as $companyData) {
            $companyData['owner_id'] = $recruiter->id;
            Company::create($companyData);
        }

        // Créer des offres d'emploi
        $jobListings = [
            [
                'title' => 'Développeur Full Stack',
                'description' => 'Nous recherchons un développeur full stack expérimenté pour rejoindre notre équipe de développement. Vous travaillerez sur des projets web et mobile innovants.',
                'requirements' => 'Maîtrise de PHP/Laravel, JavaScript/React, MySQL. 3+ années d\'expérience.',
                'benefits' => 'Salaire compétitif, assurance santé, formation continue, environnement de travail moderne.',
                'location' => 'Douala',
                'job_type' => 'full_time',
                'salary_min' => 500000,
                'salary_max' => 800000,
                'deadline' => now()->addDays(30),
                'status' => 'approved',
                'company_id' => 1,
                'user_id' => $recruiter->id,
            ],
            [
                'title' => 'Chef de Projet Marketing Digital',
                'description' => 'Nous cherchons un chef de projet marketing digital pour piloter nos campagnes digitales et améliorer notre présence en ligne.',
                'requirements' => 'Master en Marketing, 5+ années d\'expérience, maîtrise des outils digitaux.',
                'benefits' => 'Prime de performance, véhicule de fonction, télétravail possible.',
                'location' => 'Yaoundé',
                'job_type' => 'full_time',
                'salary_min' => 600000,
                'salary_max' => 900000,
                'deadline' => now()->addDays(25),
                'status' => 'approved',
                'company_id' => 2,
                'user_id' => $recruiter->id,
            ],
            [
                'title' => 'Analyste Financier',
                'description' => 'Poste d\'analyste financier pour analyser les performances financières et fournir des recommandations stratégiques.',
                'requirements' => 'Bac+5 en Finance, CFA ou équivalent, Excel avancé, 2+ années d\'expérience.',
                'benefits' => 'Formation CFA prise en charge, bonus trimestriels, horaires flexibles.',
                'location' => 'Douala',
                'job_type' => 'full_time',
                'salary_min' => 400000,
                'salary_max' => 600000,
                'deadline' => now()->addDays(20),
                'status' => 'approved',
                'company_id' => 3,
                'user_id' => $recruiter->id,
            ],
            [
                'title' => 'Ingénieur Agronome',
                'description' => 'Nous recherchons un ingénieur agronome pour superviser nos plantations et optimiser nos rendements.',
                'requirements' => 'Diplôme d\'ingénieur agronome, 3+ années d\'expérience en agriculture tropicale.',
                'benefits' => 'Logement fourni, véhicule de service, prime de zone.',
                'location' => 'Kribi',
                'job_type' => 'full_time',
                'salary_min' => 450000,
                'salary_max' => 700000,
                'deadline' => now()->addDays(35),
                'status' => 'approved',
                'company_id' => 4,
                'user_id' => $recruiter->id,
            ],
            [
                'title' => 'Journaliste TV',
                'description' => 'Nous cherchons un journaliste TV pour nos émissions d\'information et nos reportages.',
                'requirements' => 'Formation en journalisme, excellente diction, 2+ années d\'expérience TV.',
                'benefits' => 'Exposition médiatique, formation continue, équipement fourni.',
                'location' => 'Yaoundé',
                'job_type' => 'full_time',
                'salary_min' => 350000,
                'salary_max' => 550000,
                'deadline' => now()->addDays(15),
                'status' => 'approved',
                'company_id' => 5,
                'user_id' => $recruiter->id,
            ],
            [
                'title' => 'Développeur Mobile (Stage)',
                'description' => 'Stage de 6 mois pour développer des applications mobiles avec React Native.',
                'requirements' => 'Étudiant en informatique, bases en JavaScript, motivation.',
                'benefits' => 'Formation pratique, encadrement, possibilité d\'embauche.',
                'location' => 'Douala',
                'job_type' => 'internship',
                'salary_min' => 100000,
                'salary_max' => 150000,
                'deadline' => now()->addDays(10),
                'status' => 'approved',
                'company_id' => 1,
                'user_id' => $recruiter->id,
            ],
        ];

        foreach ($jobListings as $jobData) {
            JobListing::create($jobData);
        }
    }
}