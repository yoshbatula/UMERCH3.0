<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TrackUserActivity
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (Auth::check()) {
            $user = Auth::user();
            $lastActivityKey = "user_{$user->id}_last_activity";
            
            // Get the last activity time from session
            $lastActivity = session($lastActivityKey);
            $currentTime = now();
            
            // Session lifetime in minutes (from config)
            $sessionLifetime = config('session.lifetime', 30);
            
            // If last activity exists and is older than session lifetime, logout user
            if ($lastActivity && $currentTime->diffInMinutes($lastActivity) > $sessionLifetime) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                // Redirect to login with session expired message
                return redirect('/login')->with('message', 'Session expired due to inactivity. Please login again.');
            }
            
            // Update last activity time
            session([$lastActivityKey => $currentTime]);
        }
        
        return $next($request);
    }
}
