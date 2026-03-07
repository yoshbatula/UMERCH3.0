<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
class AddRecords extends Controller {

    // Function to add a new user record
    public function addUser(Request $request) {
        // Let ValidationException propagate naturally → Inertia returns 422 on failure
        $request->validate([
            'name'     => 'required|string|max:255|unique:users,user_fullname',
            'email'    => 'required|string|email|max:255|unique:users',
            'userId'   => 'required|numeric|max:99999999|unique:users,um_id',
            'password' => 'required|string|min:8',
        ]);

        try {
            $user = User::create([
                'user_fullname' => $request->name,
                'email'         => $request->email,
                'um_id'         => $request->userId,
                'user_password' => bcrypt($request->password),
                'role'          => 'customer',
            ]);

            Log::info('User created successfully:', ['user_id' => $user->id, 'email' => $user->email]);
            return redirect()->back()->with('success', 'User added successfully!');
        } catch (\Exception $e) {
            Log::error('User creation failed:', ['error' => $e->getMessage()]);

            if (str_contains($e->getMessage(), 'users_user_fullname_unique')) {
                return back()->withErrors(['name' => 'This name is already taken.'])->withInput();
            }
            if (str_contains($e->getMessage(), 'users_email_unique')) {
                return back()->withErrors(['email' => 'This email is already taken.'])->withInput();
            }
            if (str_contains($e->getMessage(), 'users_um_id_unique')) {
                return back()->withErrors(['userId' => 'This user ID is already taken.'])->withInput();
            }
            return back()->withErrors(['error' => 'Failed to create user. Please try again.'])->withInput();
        }
    }
}