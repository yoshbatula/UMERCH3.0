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

        // Verify reCAPTCHA token if provided
        if ($credentials['recaptcha_token']) {
            $recaptchaVerified = $this->verifyRecaptcha($credentials['recaptcha_token']);
            if (!$recaptchaVerified) {
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

        try {
            $recaptcha = new ReCaptcha($secretKey);
            $resp = $recaptcha->verify($token, $_SERVER['REMOTE_ADDR'] ?? '');

            // For localhost/development, be more lenient
            if (config('app.env') === 'local') {
                // On localhost, allow if verification succeeds
                return $resp->isSuccess();
            }

            // On production, require both success AND score threshold
            if ($resp->isSuccess() && $resp->getScore() >= $threshold) {
                return true;
            }

            return false;
        } catch (\Exception $e) {
            // If verification fails due to network/API error on localhost, allow it
            if (config('app.env') === 'local') {
                return true;
            }
            return false;
        }
    }
}