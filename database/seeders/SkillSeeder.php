<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            // Compétences techniques
            ['name' => 'PHP', 'category' => 'technical'],
            ['name' => 'Laravel', 'category' => 'technical'],
            ['name' => 'JavaScript', 'category' => 'technical'],
            ['name' => 'React', 'category' => 'technical'],
            ['name' => 'Vue.js', 'category' => 'technical'],
            ['name' => 'Angular', 'category' => 'technical'],
            ['name' => 'Node.js', 'category' => 'technical'],
            ['name' => 'Python', 'category' => 'technical'],
            ['name' => 'Django', 'category' => 'technical'],
            ['name' => 'Flask', 'category' => 'technical'],
            ['name' => 'Java', 'category' => 'technical'],
            ['name' => 'Spring Boot', 'category' => 'technical'],
            ['name' => 'C#', 'category' => 'technical'],
            ['name' => '.NET', 'category' => 'technical'],
            ['name' => 'MySQL', 'category' => 'technical'],
            ['name' => 'PostgreSQL', 'category' => 'technical'],
            ['name' => 'MongoDB', 'category' => 'technical'],
            ['name' => 'Redis', 'category' => 'technical'],
            ['name' => 'Docker', 'category' => 'technical'],
            ['name' => 'Kubernetes', 'category' => 'technical'],
            ['name' => 'AWS', 'category' => 'technical'],
            ['name' => 'Azure', 'category' => 'technical'],
            ['name' => 'Git', 'category' => 'technical'],
            ['name' => 'Linux', 'category' => 'technical'],
            ['name' => 'HTML', 'category' => 'technical'],
            ['name' => 'CSS', 'category' => 'technical'],
            ['name' => 'Bootstrap', 'category' => 'technical'],
            ['name' => 'Tailwind CSS', 'category' => 'technical'],
            ['name' => 'SASS', 'category' => 'technical'],
            ['name' => 'Webpack', 'category' => 'technical'],
            ['name' => 'Vite', 'category' => 'technical'],
            ['name' => 'npm', 'category' => 'technical'],
            ['name' => 'Yarn', 'category' => 'technical'],
            ['name' => 'TypeScript', 'category' => 'technical'],
            ['name' => 'GraphQL', 'category' => 'technical'],
            ['name' => 'REST API', 'category' => 'technical'],
            ['name' => 'Microservices', 'category' => 'technical'],
            ['name' => 'CI/CD', 'category' => 'technical'],
            ['name' => 'DevOps', 'category' => 'technical'],
            ['name' => 'Machine Learning', 'category' => 'technical'],
            ['name' => 'Data Science', 'category' => 'technical'],
            ['name' => 'Artificial Intelligence', 'category' => 'technical'],
            ['name' => 'Blockchain', 'category' => 'technical'],
            ['name' => 'Mobile Development', 'category' => 'technical'],
            ['name' => 'iOS Development', 'category' => 'technical'],
            ['name' => 'Android Development', 'category' => 'technical'],
            ['name' => 'Flutter', 'category' => 'technical'],
            ['name' => 'React Native', 'category' => 'technical'],

            // Compétences en gestion de projet
            ['name' => 'Gestion de projet', 'category' => 'management'],
            ['name' => 'Agile', 'category' => 'management'],
            ['name' => 'Scrum', 'category' => 'management'],
            ['name' => 'Kanban', 'category' => 'management'],
            ['name' => 'Jira', 'category' => 'management'],
            ['name' => 'Trello', 'category' => 'management'],
            ['name' => 'Asana', 'category' => 'management'],
            ['name' => 'Leadership', 'category' => 'management'],
            ['name' => 'Gestion d\'équipe', 'category' => 'management'],
            ['name' => 'Planification', 'category' => 'management'],
            ['name' => 'Budget', 'category' => 'management'],
            ['name' => 'Ressources humaines', 'category' => 'management'],

            // Compétences en design
            ['name' => 'UI/UX Design', 'category' => 'design'],
            ['name' => 'Figma', 'category' => 'design'],
            ['name' => 'Adobe Photoshop', 'category' => 'design'],
            ['name' => 'Adobe Illustrator', 'category' => 'design'],
            ['name' => 'Sketch', 'category' => 'design'],
            ['name' => 'InVision', 'category' => 'design'],
            ['name' => 'Prototypage', 'category' => 'design'],
            ['name' => 'Design Thinking', 'category' => 'design'],
            ['name' => 'Wireframing', 'category' => 'design'],
            ['name' => 'User Research', 'category' => 'design'],

            // Compétences en marketing
            ['name' => 'Marketing digital', 'category' => 'marketing'],
            ['name' => 'SEO', 'category' => 'marketing'],
            ['name' => 'SEM', 'category' => 'marketing'],
            ['name' => 'Google Analytics', 'category' => 'marketing'],
            ['name' => 'Facebook Ads', 'category' => 'marketing'],
            ['name' => 'Google Ads', 'category' => 'marketing'],
            ['name' => 'Content Marketing', 'category' => 'marketing'],
            ['name' => 'Social Media Marketing', 'category' => 'marketing'],
            ['name' => 'Email Marketing', 'category' => 'marketing'],
            ['name' => 'Marketing Automation', 'category' => 'marketing'],

            // Compétences en vente
            ['name' => 'Vente', 'category' => 'sales'],
            ['name' => 'Négociation', 'category' => 'sales'],
            ['name' => 'CRM', 'category' => 'sales'],
            ['name' => 'Salesforce', 'category' => 'sales'],
            ['name' => 'HubSpot', 'category' => 'sales'],
            ['name' => 'Prospection', 'category' => 'sales'],
            ['name' => 'Fermeture de vente', 'category' => 'sales'],
            ['name' => 'Gestion de portefeuille', 'category' => 'sales'],

            // Compétences en finance
            ['name' => 'Comptabilité', 'category' => 'finance'],
            ['name' => 'Analyse financière', 'category' => 'finance'],
            ['name' => 'Excel', 'category' => 'finance'],
            ['name' => 'SAP', 'category' => 'finance'],
            ['name' => 'QuickBooks', 'category' => 'finance'],
            ['name' => 'Audit', 'category' => 'finance'],
            ['name' => 'Contrôle de gestion', 'category' => 'finance'],
            ['name' => 'Budgeting', 'category' => 'finance'],

            // Compétences en communication
            ['name' => 'Communication', 'category' => 'soft'],
            ['name' => 'Présentation', 'category' => 'soft'],
            ['name' => 'Rédaction', 'category' => 'soft'],
            ['name' => 'Formation', 'category' => 'soft'],
            ['name' => 'Mentorat', 'category' => 'soft'],
            ['name' => 'Travail d\'équipe', 'category' => 'soft'],
            ['name' => 'Résolution de problèmes', 'category' => 'soft'],
            ['name' => 'Pensée critique', 'category' => 'soft'],
            ['name' => 'Adaptabilité', 'category' => 'soft'],
            ['name' => 'Créativité', 'category' => 'soft'],

            // Langues
            ['name' => 'Français', 'category' => 'language'],
            ['name' => 'Anglais', 'category' => 'language'],
            ['name' => 'Espagnol', 'category' => 'language'],
            ['name' => 'Allemand', 'category' => 'language'],
            ['name' => 'Italien', 'category' => 'language'],
            ['name' => 'Chinois', 'category' => 'language'],
            ['name' => 'Arabe', 'category' => 'language'],
            ['name' => 'Portugais', 'category' => 'language'],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}