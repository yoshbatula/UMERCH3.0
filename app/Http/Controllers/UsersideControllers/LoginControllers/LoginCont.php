<?php
namespace App\Http\Controllers\UsersideControllers\LoginControllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use ReCaptcha\ReCaptcha;
use App\Services\DeviceDetectionService;
use Illuminate\Support\Str;

class LoginCont extends Controller
{
    protected $deviceService;

    public function __construct(DeviceDetectionService $deviceService)
    {
        $this->deviceService = $deviceService;
    }
    
    // Displays the login form
    public function showLoginForm()
    {
        // Redirect already authenticated users based on their role
        if (Auth::check()) {
            if (Auth::user()->role === 'Admin') {
                return redirect('/admin');
            }
            return redirect('/Landing');
        }
        return Inertia::render('Login');
    }

    /**
     * Check if device is trusted
     */
    public function checkTrustedDevice(Request $request)
    {
        $fingerprint = $request->validate([
            'fingerprint' => 'required|string'
        ])['fingerprint'];

        // Check if any user has this device registered
        $trustedDevice = \App\Models\TrustedDevice::where(
            'device_fingerprint',
            $this->deviceService->hashFingerprint($fingerprint)
        )->with('user')->first();

        if ($trustedDevice) {
            return response()->json([
                'trusted' => true,
                'user_email' => $trustedDevice->user->email,
                'device_name' => $trustedDevice->device_name,
            ]);
        }

        return response()->json(['trusted' => false]);
    }

    // Handles user login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
            'remember' => 'boolean',
            'recaptcha_token' => 'nullable|string',
            'device_fingerprint' => 'nullable|string'
        ]);

        // Check brute force rate limiter
        $rateLimitDecay = 60; // seconds (tracking window)
        $rateLimitLockout = 10; // seconds (lockout duration)
        $rateLimitKey = 'login-attempts:'.Str::lower($credentials['login']);
        $rateLimitDir = storage_path('framework/cache/rate-limit');
        $rateLimitFile = $rateLimitDir . '/' . md5($rateLimitKey) . '.json';
        $rateLimitData = ['attempts' => [], 'locked_until' => 0];
        if (file_exists($rateLimitFile)) {
            $saved = @json_decode(@file_get_contents($rateLimitFile), true);
            if (is_array($saved) && isset($saved['attempts'])) {
                $rateLimitData = $saved;
            }
        }

        // Check if currently locked
        if ($rateLimitData['locked_until'] > time()) {
            $remaining = $rateLimitData['locked_until'] - time();
            $message = "Account temporarily locked. Too many failed attempts. Please try again in {$remaining} second(s).";
            if ($request->expectsJson()) {
                return response()->json(['message' => $message, 'errors' => ['login' => $message], 'retry_after' => $remaining], 429);
            }
            return back()->withErrors(['login' => $message]);
        }

        // Lockout expired — clear attempts so they don't immediately re-lock
        if ($rateLimitData['locked_until'] > 0) {
            $rateLimitData = ['attempts' => [], 'locked_until' => 0];
            @file_put_contents($rateLimitFile, json_encode($rateLimitData), LOCK_EX);
        }

        // Count recent attempts within tracking window
        $attempts = collect($rateLimitData['attempts'])
            ->filter(fn($t) => time() - $t < $rateLimitDecay)
            ->values();

        if ($attempts->count() >= 5) {
            $rateLimitData['locked_until'] = time() + $rateLimitLockout;
            @file_put_contents($rateLimitFile, json_encode($rateLimitData), LOCK_EX);
            $message = "Account temporarily locked. Too many failed attempts. Please try again in {$rateLimitLockout} second(s).";
            if ($request->expectsJson()) {
                return response()->json(['message' => $message, 'errors' => ['login' => $message], 'retry_after' => $rateLimitLockout], 429);
            }
            return back()->withErrors(['login' => $message]);
        }

        // Verify reCAPTCHA token if provided
        if ($credentials['recaptcha_token']) {
            $recaptchaVerified = $this->verifyRecaptcha($credentials['recaptcha_token']);
            if (!$recaptchaVerified) {
                $this->recordFailedAttempt($rateLimitKey, $rateLimitDecay);
                $message = 'reCAPTCHA verification failed. Please try again.';
                if ($request->expectsJson()) {
                    return response()->json(['message' => $message, 'errors' => ['recaptcha' => $message]], 422);
                }
                return back()->withErrors(['recaptcha' => $message]);
            }
        }

        // user:admin
        // password:umerch2026
        if ($credentials['login'] === 'admin' && $credentials['password'] === 'umerch2026') {
            $adminUser = User::where('email', 'admin@umerch.com')->first();
            
            if (!$adminUser) {
               
                $adminUser = User::create([
                    'user_fullname' => 'Admin',
                    'email' => 'admin@umerch.com',
                    'um_id' => 1,  
                    'user_password' => 'umerch2026',
                    'role' => 'Admin',
                    'status' => 'active'
                ]);
            } else {
                // Update role if admin user exists but doesn't have the role set
                if (empty($adminUser->role) || $adminUser->role !== 'Admin') {
                    $adminUser->role = 'Admin';
                    $adminUser->save();
                }
            }
            
            Auth::login($adminUser, $credentials['remember'] ?? false);
            $request->session()->regenerate();
            
           
            if (file_exists($rateLimitFile)) @unlink($rateLimitFile);

            ActivityLog::logLogin($adminUser);
            
            if ($request->expectsJson()) {
                return response()->json(['redirect' => '/admin']);
            }
            return redirect('/admin');
        }

        $field = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'um_id';

        $user = User::where($field, $credentials['login'])->first();

        if ($user) {
         
            if (isset($user->status) && $user->status === 'inactive') {
                $this->recordFailedAttempt($rateLimitKey, $rateLimitDecay);
                $message = 'Your account has been deactivated. Please contact an administrator.';
                if ($request->expectsJson()) {
                    return response()->json(['message' => $message, 'errors' => ['login' => $message]], 422);
                }
                return back()->withErrors(['login' => $message]);
            }

            $dbPassword = $user->user_password;
            $inputPassword = $credentials['password'];

            $isHashed = str_starts_with($dbPassword, '$2y$');
            $valid = $isHashed
                ? Hash::check($inputPassword, $dbPassword)
                : $inputPassword === $dbPassword;

            if ($valid) {
                if (file_exists($rateLimitFile)) @unlink($rateLimitFile);
                Auth::login($user, $credentials['remember'] ?? false);
                $request->session()->regenerate();

                // Log the login activity
                ActivityLog::logLogin($user);

                // Check if device is trusted
                $isTrustedDevice = false;
                if ($credentials['device_fingerprint']) {
                    $device = $this->deviceService->getTrustedDevice($user, $credentials['device_fingerprint']);
                    
                    if ($device) {
                        // Device already registered - it's trusted
                        $isTrustedDevice = true;
                        // Update last used timestamp
                        $device->update(['last_used_at' => now()]);
                    } else {
                        // Register new device
                        $deviceName = $this->deviceService->getDeviceNameFromUserAgent($request->userAgent());
                        $this->deviceService->registerDevice($user, $credentials['device_fingerprint'], $request, $deviceName);
                        // New device - still require OTP
                        $isTrustedDevice = false;
                    }
                }

                // If device is trusted, skip OTP and go directly to Landing
                if ($isTrustedDevice) {
                    session(['otp_verified' => true]);
                    if ($request->expectsJson()) {
                        return response()->json(['redirect' => '/Landing']);
                    }
                    return redirect('/Landing');
                } else {
                    // New device or no fingerprint - require OTP
                    $otp = random_int(100000, 999999);
                    session(['otp' => $otp, 'otp_expires' => now()->addMinutes(5)]);
                    Mail::to($user->email)->send(new \App\Mail\OtpMail($otp, $user->user_fullname ?? 'User'));

                    if ($request->expectsJson()) {
                        return response()->json(['redirect' => '/authentication']);
                    }
                    return redirect()->route('authentication');
                }
            }
        }

        $this->recordFailedAttempt($rateLimitKey, $rateLimitDecay);

        $message = 'The provided credentials do not match our records.';
        if ($request->expectsJson()) {
            return response()->json(['message' => $message, 'errors' => ['login' => $message]], 422);
        }
        return back()->withErrors(['login' => $message]);
    }

    /**
     * Handle user logout
     */
    public function logout(Request $request)
    {   
        // Get the authenticated user before logging out
        $user = Auth::user();
        
        // Log the logout activity if user exists
        if ($user) {
            ActivityLog::logLogout($user);
        }
        
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }

    /**
     * Record a failed login attempt for rate limiting
     */
    private function recordFailedAttempt($key, $decay)
    {
        $file = storage_path('framework/cache/rate-limit/' . md5($key) . '.json');
        $dir = dirname($file);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $data = ['attempts' => [], 'locked_until' => 0];
        if (file_exists($file)) {
            $saved = @json_decode(@file_get_contents($file), true);
            if (is_array($saved) && isset($saved['attempts'])) {
                $data = $saved;
            }
        }
        $data['attempts'] = collect($data['attempts'])
            ->filter(fn($t) => time() - $t < $decay)
            ->push(time())
            ->values()
            ->toArray();
        @file_put_contents($file, json_encode($data), LOCK_EX);
    }

    /**
     * Verify reCAPTCHA token
     */
    private function verifyRecaptcha($token)
    {
        $secretKey = config('recaptcha.secret_key');
        $threshold = config('recaptcha.threshold', 0.5);

        if (!$secretKey || $secretKey === 'YOUR_SECRET_KEY_HERE') {
            // If secret key is not configured, skip verification for development
            return true;
        }

        // Skip verification in local development
        if (config('app.env') === 'local') {
            return true;
        }

        try {
            $recaptcha = new ReCaptcha($secretKey);
            $resp = $recaptcha->verify($token, $_SERVER['REMOTE_ADDR'] ?? '');

            if ($resp->isSuccess() && $resp->getScore() >= $threshold) {
                return true;
            }

            return false;
        } catch (\Exception $e) {
            return false;
        }
    }
}