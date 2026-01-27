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
        $sessionOtp = $request->session()->get('otp');
        $expires = session('otp_expires');

        if (!$sessionOtp || now()->greaterThan($expires)) {
            return back()->withErrors(['otp' => 'The OTP has expired. Please request a new one.']);
        }

        if ($request->otp == $sessionOtp) {
            session()->forget(['otp', 'otp_expires']);
            return redirect()->route('landing');
        }

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
        session(['otp' => $otp, 'otp_expires' => now()->addMinutes(5)]);

        Mail::raw("Your OTP code is: $otp", function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Your OTP Code');
        });

        return back()->with('status', 'OTP resent');
    }

    
    public function showAuthenticationPage()
    {
        $email = Auth::user()->email;
        $censored = $this->censorEmail($email);
        return Inertia::render('Authentication', [
            'email' => $censored
        ]);
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


