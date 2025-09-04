<?php

namespace App\Notifications;

use App\Models\JobListing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewJobListingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $jobListing;

    /**
     * Create a new notification instance.
     */
    public function __construct(JobListing $jobListing)
    {
        $this->jobListing = $jobListing;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Job Listing Pending Approval')
            ->line('A new job listing has been submitted and is pending your approval.')
            ->line('Job Title: ' . $this->jobListing->title)
            ->action('Review Job Listing', url("/admin/jobs/{$this->jobListing->id}/review"));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_job_listing',
            'job_listing_id' => $this->jobListing->id,
            'job_title' => $this->jobListing->title,
            'company_name' => $this->jobListing->company->name,
        ];
    }
}
