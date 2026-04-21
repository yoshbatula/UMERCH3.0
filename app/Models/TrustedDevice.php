<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrustedDevice extends Model
{
    use HasFactory;

    // Device trust duration in days
    const TRUST_DURATION_DAYS = 30;

    protected $fillable = [
        'user_id',
        'device_fingerprint',
        'device_name',
        'ip_address',
        'user_agent',
        'last_used_at',
        'expires_at',
        'is_expired',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_expired' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns this trusted device
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to find device by fingerprint
     */
    public function scopeByFingerprint($query, $fingerprint)
    {
        return $query->where('device_fingerprint', $fingerprint);
    }

    /**
     * Scope to find device by user and fingerprint
     */
    public function scopeForUserByFingerprint($query, $userId, $fingerprint)
    {
        return $query->where('user_id', $userId)
                     ->where('device_fingerprint', $fingerprint)
                     ->where('is_expired', false);
    }

    /**
     * Scope to get only non-expired devices
     */
    public function scopeActive($query)
    {
        return $query->where('is_expired', false)
                     ->where(function ($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }

    /**
     * Check if device is expired
     */
    public function isExpired(): bool
    {
        if ($this->is_expired) {
            return true;
        }

        if ($this->expires_at && now()->greaterThan($this->expires_at)) {
            $this->update(['is_expired' => true]);
            return true;
        }

        return false;
    }

    /**
     * Check if device is still valid
     */
    public function isValid(): bool
    {
        return !$this->isExpired();
    }

    /**
     * Mark device as expired
     */
    public function markExpired(): void
    {
        $this->update(['is_expired' => true]);
    }

    /**
     * Renew device trust (extends expiration)
     */
    public function renew(): void
    {
        $this->update([
            'expires_at' => now()->addDays(self::TRUST_DURATION_DAYS),
            'is_expired' => false,
            'last_used_at' => now()
        ]);
    }

    /**
     * Boot method to set expiration on create
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->expires_at) {
                $model->expires_at = now()->addDays(self::TRUST_DURATION_DAYS);
            }
        });
    }
}

