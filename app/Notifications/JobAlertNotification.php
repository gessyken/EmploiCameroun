<?php

namespace App\Notifications;

use App\Models\JobAlert;
use App\Models\JobListing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $alert;
    protected $jobs;

    /**
     * Create a new notification instance.
     */
    public function __construct(JobAlert $alert, $jobs)
    {
        $this->alert = $alert;
        $this->jobs = $jobs;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $message = (new MailMessage)
            ->subject('Nouvelles offres d\'emploi correspondant à vos critères')
            ->line('Nous avons trouvé ' . $this->jobs->count() . ' nouvelles offres qui correspondent à vos critères de recherche.');

        foreach ($this->jobs->take(5) as $job) {
            $message->line("• {$job->title} chez {$job->company->name} - {$job->location}");
        }

        if ($this->jobs->count() > 5) {
            $message->line('... et ' . ($this->jobs->count() - 5) . ' autres offres.');
        }

        $message->action('Voir toutes les offres', url('/jobs'));

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'job_alert',
            'alert_id' => $this->alert->id,
            'jobs_count' => $this->jobs->count(),
            'jobs' => $this->jobs->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => $job->company->name,
                    'location' => $job->location,
                ];
            })->toArray(),
        ];
    }
}