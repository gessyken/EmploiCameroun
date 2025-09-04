<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'location',
        'job_type',
        'keywords',
        'excluded_keywords',
        'is_active',
        'last_sent_at',
    ];

    protected $casts = [
        'keywords' => 'array',
        'excluded_keywords' => 'array',
        'is_active' => 'boolean',
        'last_sent_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}