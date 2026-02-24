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

class LoginCont extends Controller
{
    
    // Displays the login form
    public function showLoginForm()
    {
        return Inertia::render('Authentication');
    }

    // Handles user login
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
            'remember' => 'boolean'
        ]);

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

                // Generate and send OTP
                $otp = random_int(100000, 999999);
                session(['otp' => $otp, 'otp_expires' => now()->addMinutes(5)]);
                Mail::to($user->email)->send(new \App\Mail\OtpMail($otp, $user->user_fullname ?? 'User'));

                // Return JSON for axios or redirect for form submissions
                if ($request->expectsJson()) {
                    return response()->json(['redirect' => '/authentication']);
                }
                return redirect()->route('authentication');
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
}