<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrustedDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'device_fingerprint',
        'device_name',
        'ip_address',
        'user_agent',
        'last_used_at',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
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
                     ->where('device_fingerprint', $fingerprint);
    }
}
