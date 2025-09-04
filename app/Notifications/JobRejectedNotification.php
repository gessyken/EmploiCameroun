<?php

namespace App\Notifications;

use App\Models\JobListing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobRejectedNotification extends Notification implements ShouldQueue
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
        return (new MailMessage)
            ->subject('Your Job Listing has been Rejected')
            ->line('Your job listing "' . $this->jobListing->title . '" has been rejected.')
            ->line('Reason: ' . $this->jobListing->rejection_reason);
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
            'type' => 'job_rejected',
            'job_listing_id' => $this->jobListing->id,
            'job_title' => $this->jobListing->title,
            'rejection_reason' => $this->jobListing->rejection_reason,
        ];
    }
}
