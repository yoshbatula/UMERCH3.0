<?php
namespace App\Http\Controllers\LoginControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
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

        $field = filter_var($credentials['login'], FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'um_id';

        $user = User::where($field, $credentials['login'])->first();

        if ($user) {
            $dbPassword = $user->user_password;
            $inputPassword = $credentials['password'];

            $isHashed = str_starts_with($dbPassword, '$2y$');
            $valid = $isHashed
                ? Hash::check($inputPassword, $dbPassword)
                : $inputPassword === $dbPassword;

            if ($valid) {
                Auth::login($user, $credentials['remember'] ?? false);
                $request->session()->regenerate();

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

    
}


