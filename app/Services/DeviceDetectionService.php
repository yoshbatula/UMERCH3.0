<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\TrustedDevice;
use App\Models\User;

class DeviceDetectionService
{
    /**
     * Generate a device fingerprint from request data
     */
    public function generateFingerprint(Request $request, string $fingerprint): string
    {
        // The fingerprint comes from the client and is hashed for additional security
        return Hash::make($fingerprint);
    }

    /**
     * Generate a simple hash from fingerprint string for storage
     */
    public function hashFingerprint(string $fingerprint): string
    {
        return hash('sha256', $fingerprint);
    }

    /**
     * Check if device is trusted for a user
     */
    public function isTrustedDevice(User $user, string $fingerprint): bool
    {
        $hashedFingerprint = $this->hashFingerprint($fingerprint);
        
        return TrustedDevice::forUserByFingerprint($user->id, $hashedFingerprint)->exists();
    }

    /**
     * Get trusted device for user
     */
    public function getTrustedDevice(User $user, string $fingerprint): ?TrustedDevice
    {
        $hashedFingerprint = $this->hashFingerprint($fingerprint);
        
        return TrustedDevice::forUserByFingerprint($user->id, $hashedFingerprint)->first();
    }

    /**
     * Register a new trusted device for a user
     */
    public function registerDevice(User $user, string $fingerprint, Request $request, string $deviceName = null): TrustedDevice
    {
        $hashedFingerprint = $this->hashFingerprint($fingerprint);
        
        // Check if device already exists
        $existingDevice = $this->getTrustedDevice($user, $fingerprint);
        
        if ($existingDevice) {
            // Update last used timestamp
            $existingDevice->update(['last_used_at' => now()]);
            return $existingDevice;
        }

        // Create new trusted device
        return TrustedDevice::create([
            'user_id' => $user->id,
            'device_fingerprint' => $hashedFingerprint,
            'device_name' => $deviceName,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'last_used_at' => now(),
        ]);
    }

    /**
     * Get device name from user agent
     */
    public function getDeviceNameFromUserAgent(string $userAgent): string
    {
        if (strpos($userAgent, 'Windows') !== false) {
            $os = 'Windows';
        } elseif (strpos($userAgent, 'Mac') !== false) {
            $os = 'Mac';
        } elseif (strpos($userAgent, 'Linux') !== false) {
            $os = 'Linux';
        } elseif (strpos($userAgent, 'Android') !== false) {
            $os = 'Android';
        } elseif (strpos($userAgent, 'iPhone') !== false || strpos($userAgent, 'iPad') !== false) {
            $os = 'iOS';
        } else {
            $os = 'Unknown';
        }

        // Extract browser
        if (strpos($userAgent, 'Chrome') !== false && strpos($userAgent, 'Chromium') === false) {
            $browser = 'Chrome';
        } elseif (strpos($userAgent, 'Firefox') !== false) {
            $browser = 'Firefox';
        } elseif (strpos($userAgent, 'Safari') !== false && strpos($userAgent, 'Chrome') === false) {
            $browser = 'Safari';
        } elseif (strpos($userAgent, 'Edge') !== false) {
            $browser = 'Edge';
        } elseif (strpos($userAgent, 'Opera') !== false || strpos($userAgent, 'OPR') !== false) {
            $browser = 'Opera';
        } else {
            $browser = 'Unknown';
        }

        return "{$browser} on {$os}";
    }

    /**
     * Remove a trusted device
     */
    public function forgetDevice(User $user, int $deviceId): bool
    {
        $device = TrustedDevice::where('id', $deviceId)
            ->where('user_id', $user->id)
            ->first();

        if ($device) {
            $device->delete();
            return true;
        }

        return false;
    }

    /**
     * Get all trusted devices for a user
     */
    public function getUserDevices(User $user)
    {
        return $user->trustedDevices()
            ->orderBy('last_used_at', 'desc')
            ->get();
    }
}
