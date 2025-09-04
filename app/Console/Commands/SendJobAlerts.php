<?php

namespace App\Console\Commands;

use App\Models\JobAlert;
use App\Models\JobListing;
use App\Notifications\JobAlertNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendJobAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alerts:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send job alerts to users based on their preferences';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Envoi des alertes d\'emploi...');

        $alerts = JobAlert::where('is_active', true)->get();
        $sentCount = 0;

        foreach ($alerts as $alert) {
            $matchingJobs = $this->getMatchingJobs($alert);
            
            if ($matchingJobs->count() > 0) {
                // Envoyer la notification
                $alert->user->notify(new JobAlertNotification($alert, $matchingJobs));
                
                // Mettre à jour la date de dernier envoi
                $alert->update(['last_sent_at' => now()]);
                
                $sentCount++;
                $this->line("Alerte envoyée à {$alert->user->name}: {$matchingJobs->count()} offres");
            }
        }

        $this->info("{$sentCount} alertes envoyées avec succès.");
    }

    private function getMatchingJobs(JobAlert $alert)
    {
        $query = JobListing::where('status', 'approved')
            ->where('deadline', '>=', now())
            ->where('created_at', '>', $alert->last_sent_at ?? now()->subDays(7));

        if ($alert->title) {
            $query->where('title', 'like', '%' . $alert->title . '%');
        }

        if ($alert->location) {
            $query->where('location', 'like', '%' . $alert->location . '%');
        }

        if ($alert->job_type) {
            $query->where('job_type', $alert->job_type);
        }

        if ($alert->keywords) {
            foreach ($alert->keywords as $keyword) {
                $query->where(function ($q) use ($keyword) {
                    $q->where('title', 'like', '%' . $keyword . '%')
                      ->orWhere('description', 'like', '%' . $keyword . '%')
                      ->orWhere('requirements', 'like', '%' . $keyword . '%');
                });
            }
        }

        if ($alert->excluded_keywords) {
            foreach ($alert->excluded_keywords as $keyword) {
                $query->where(function ($q) use ($keyword) {
                    $q->where('title', 'not like', '%' . $keyword . '%')
                      ->where('description', 'not like', '%' . $keyword . '%')
                      ->where('requirements', 'not like', '%' . $keyword . '%');
                });
            }
        }

        return $query->with('company')->take(10)->get();
    }
}