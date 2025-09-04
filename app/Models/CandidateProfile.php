<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CandidateProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'resume_path',
        'skills',
        'experience',
        'education',
        'is_complete',
        'phone_number',
        'address',
        'date_of_birth',
        'gender',
        'bio',
        'linkedin_url',
        'github_url',
        'portfolio_url',
    ];

    protected $casts = [
        'is_complete' => 'boolean',
        'date_of_birth' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function experiences(): HasMany
    {
        return $this->hasMany(Experience::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(Education::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'candidate_skills')
            ->withPivot('level')
            ->withTimestamps();
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'candidate_id', 'user_id');
    }
}
