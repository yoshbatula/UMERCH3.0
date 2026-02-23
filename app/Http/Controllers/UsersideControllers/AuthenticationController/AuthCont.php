<?php
namespace App\Http\Controllers\UsersideControllers\AuthenticationController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

// This controllers handles user authentication functionality
class AuthCont extends Controller {

    // Verifies the OTP entered by the user
    public function verifyOtp(Request $request) {

        $request->validate(['otp' => 'required|digits:6']);
        $sessionOtp = session('otp');
        $expires = session('otp_expires');
        $attempts = session('otp_attempts', 0);

        // Check if OTP exists and hasn't expired
        if (!$sessionOtp || !$expires || now()->greaterThan($expires)) {
            session()->forget(['otp', 'otp_expires', 'otp_attempts']);
            return back()->withErrors(['otp' => 'The OTP has expired. Please request a new one.']);
        }

        // Check if too many attempts
        if ($attempts >= 5) {
            session()->forget(['otp', 'otp_expires', 'otp_attempts']);
            return back()->withErrors(['otp' => 'Too many failed attempts. Please request a new OTP.']);
        }

        // Verify OTP - convert both to string for comparison
        if ((string)$request->otp === (string)$sessionOtp) {
            session()->forget(['otp', 'otp_expires', 'otp_attempts']);
            session(['otp_verified' => true]);
            return Inertia::location('/Landing');
        }

        // Increment failed attempts
        session(['otp_attempts' => $attempts + 1]);
        return back()->withErrors(['otp' => 'Invalid OTP.']);
    }

    // Resend OTP to the user's email
    public function resendOtp(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $otp = random_int(100000, 999999);
        session(['otp' => $otp, 'otp_expires' => now()->addMinutes(5), 'otp_attempts' => 0]);

        Mail::raw("Your OTP code is: $otp", function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Your OTP Code');
        });

        return redirect()->route('authentication')->with('status', 'OTP resent successfully');
    }

    
    public function showAuthenticationPage()
    {
        $email = Auth::user()->email;
        $censored = $this->censorEmail($email);
        return Inertia::render('Authentication', [
            'email' => $censored
        ]);
    }

    // Logout user
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }

    private function censorEmail($email)
    {
        $parts = explode('@', $email);
        $name = $parts[0];
        $domain = $parts[1] ?? '';

        if (strlen($name) <= 2) {
            $censoredName = substr($name, 0, 1) . str_repeat('*', max(strlen($name) - 1, 0));
        } else {
            $censoredName = substr($name, 0, 1) . str_repeat('*', strlen($name) - 2) . substr($name, -1);
        }

        return $censoredName . '@' . $domain;
    }
}


