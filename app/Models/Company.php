<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'website',
        'logo',
        'address',
        'owner_id',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function jobListings(): HasMany
    {
        return $this->hasMany(JobListing::class);
    }

    public function recruiters(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
