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
// This controllers handles user login functionality
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
            // Check if admin user exists in database
            $adminUser = User::where('email', 'admin@umerch.com')->first();
            
            if (!$adminUser) {
                // Create admin user if not exists
                $adminUser = User::create([
                    'user_fullname' => 'Admin',
                    'email' => 'admin@umerch.com',
                    'um_id' => 1,  // Use integer ID
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
            
            // Log the login activity
            ActivityLog::logLogin($adminUser);
            
            // Redirect to admin dashboard
            return redirect('/admin');
        }

        $field = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'um_id';

        $user = User::where($field, $credentials['login'])->first();

        if ($user) {
            // Check if user account is inactive
            if (isset($user->status) && $user->status === 'inactive') {
                return back()->withErrors([
                    'login' => 'Your account has been deactivated. Please contact an administrator.',
                ]);
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
                Mail::raw("Your OTP code is: $otp", function ($message) use ($user) {
                    $message->to($user->email)
                            ->subject('Your OTP Code');
                });

                return redirect()->route('authentication');
            }
        }

        return back()->withErrors([
            'login' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Handle user logout
     */
    public function logout(Request $request)
    {   
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }
}