<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Auth::user()->notifications()
            ->latest()
            ->paginate(20);

        return response()->json($notifications);
    }

    public function unread()
    {
        $count = Auth::user()->unreadNotifications()->count();
        
        return response()->json(['count' => $count]);
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->find($id);
        
        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues']);
    }

    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->find($id);
        
        if ($notification) {
            $notification->delete();
        }

        return response()->json(['message' => 'Notification supprimée']);
    }
}