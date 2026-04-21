<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\LoginAttempt;

class LoginAttemptService
{
    const MAX_ATTEMPTS = 5;           // Max failed attempts before lockout
    const LOCKOUT_DURATION = 30;      // Minutes to lock account
    const RATE_LIMIT_WINDOW = 15;     // Minutes for rate limiting

    /**
     * Check if user/IP is rate limited
     */
    public function isRateLimited(Request $request, ?User $user, string $identifier): bool
    {
        $ipAddress = $request->ip();

        // Check if user account is locked
        if ($user && $this->isAccountLocked($user)) {
            return true;
        }

        // Check failed attempts from this IP in the last 15 minutes
        $recentFailedAttempts = LoginAttempt::failedFromIpRecently($ipAddress, self::RATE_LIMIT_WINDOW)->count();
        
        if ($recentFailedAttempts >= 10) {
            // IP is blocked (too many attempts from this IP)
            return true;
        }

        return false;
    }

    /**
     * Check if user account is locked
     */
    public function isAccountLocked(User $user): bool
    {
        if ($user->locked_until && now()->lessThan($user->locked_until)) {
            return true;
        }

        // Unlock if lockout period has expired
        if ($user->locked_until && now()->greaterThan($user->locked_until)) {
            $user->update([
                'locked_until' => null,
                'failed_login_attempts' => 0
            ]);
        }

        return false;
    }

    /**
     * Record a failed login attempt
     */
    public function recordFailedAttempt(Request $request, ?User $user, string $identifier): void
    {
        // Log the attempt
        LoginAttempt::create([
            'user_id' => $user?->id,
            'email_or_identifier' => $identifier,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'success' => false,
            'attempted_at' => now(),
        ]);

        // Increment failed attempts for user
        if ($user) {
            $user->increment('failed_login_attempts');

            // Lock account if max attempts reached
            if ($user->failed_login_attempts >= self::MAX_ATTEMPTS) {
                $user->update([
                    'locked_until' => now()->addMinutes(self::LOCKOUT_DURATION)
                ]);
            }
        }
    }

    /**
     * Record a successful login attempt
     */
    public function recordSuccessfulAttempt(Request $request, User $user): void
    {
        // Log the attempt
        LoginAttempt::create([
            'user_id' => $user->id,
            'email_or_identifier' => $user->email,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'success' => true,
            'attempted_at' => now(),
        ]);

        // Reset failed attempts
        $user->update([
            'failed_login_attempts' => 0,
            'locked_until' => null
        ]);
    }

    /**
     * Get failed attempts count for user
     */
    public function getFailedAttemptsCount(User $user): int
    {
        return $user->failed_login_attempts;
    }

    /**
     * Get remaining attempts before lockout
     */
    public function getRemainingAttempts(User $user): int
    {
        return max(0, self::MAX_ATTEMPTS - $user->failed_login_attempts);
    }

    /**
     * Get lockout time remaining (in minutes)
     */
    public function getLockoutTimeRemaining(User $user): ?int
    {
        if (!$user->locked_until) {
            return null;
        }

        if (now()->greaterThan($user->locked_until)) {
            return null;
        }

        return now()->diffInMinutes($user->locked_until);
    }

    /**
     * Manually unlock an account (admin only)
     */
    public function unlockAccount(User $user): void
    {
        $user->update([
            'failed_login_attempts' => 0,
            'locked_until' => null
        ]);
    }

    /**
     * Get login attempt history for user
     */
    public function getLoginHistory(User $user, int $limit = 20)
    {
        return LoginAttempt::where('user_id', $user->id)
            ->orderBy('attempted_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get failed login attempts in last N hours (for security alerts)
     */
    public function getSuspiciousActivity(User $user, int $hours = 24)
    {
        return LoginAttempt::where('user_id', $user->id)
            ->where('success', false)
            ->where('attempted_at', '>=', now()->subHours($hours))
            ->orderBy('attempted_at', 'desc')
            ->get();
    }
}
