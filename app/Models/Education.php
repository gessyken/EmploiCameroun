<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_profile_id',
        'institution',
        'degree',
        'field_of_study',
        'start_date',
        'end_date',
        'gpa',
        'description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'gpa' => 'decimal:2',
    ];

    public function candidateProfile(): BelongsTo
    {
        return $this->belongsTo(CandidateProfile::class);
    }
}