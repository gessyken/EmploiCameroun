<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Planifier l'envoi des alertes d'emploi tous les jours à 9h00
Schedule::command('alerts:send')->dailyAt('09:00');
