<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function index()
    {
        $favorites = Auth::user()->favorites()
            ->with(['jobListing.company'])
            ->latest()
            ->paginate(20);

        return response()->json($favorites);
    }

    public function store(Request $request, JobListing $job)
    {
        // Vérifier si l'offre est déjà en favori
        $existingFavorite = Auth::user()->favorites()
            ->where('job_listing_id', $job->id)
            ->first();

        if ($existingFavorite) {
            return response()->json(['message' => 'Offre déjà en favori'], 422);
        }

        // Ajouter aux favoris
        Auth::user()->favorites()->create([
            'job_listing_id' => $job->id
        ]);

        return response()->json(['message' => 'Offre ajoutée aux favoris']);
    }

    public function destroy(JobListing $job)
    {
        $favorite = Auth::user()->favorites()
            ->where('job_listing_id', $job->id)
            ->first();

        if (!$favorite) {
            return response()->json(['message' => 'Offre non trouvée dans les favoris'], 404);
        }

        $favorite->delete();

        return response()->json(['message' => 'Offre retirée des favoris']);
    }

    public function toggle(Request $request, JobListing $job)
    {
        $favorite = Auth::user()->favorites()
            ->where('job_listing_id', $job->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            $isFavorited = false;
            $message = 'Offre retirée des favoris';
        } else {
            Auth::user()->favorites()->create([
                'job_listing_id' => $job->id
            ]);
            $isFavorited = true;
            $message = 'Offre ajoutée aux favoris';
        }

        return response()->json([
            'message' => $message,
            'is_favorited' => $isFavorited
        ]);
    }
}