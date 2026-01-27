<?php
namespace App\Http\Controllers\AuthenticationController;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthCont extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Authentication');
    }

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

                return redirect()->route('authentication');
            }
        }

        return back()->withErrors([
            'login' => 'The provided credentials do not match our records.',
        ]);
    }
}


