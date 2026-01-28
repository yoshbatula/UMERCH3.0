<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
class UpdateRecords extends Controller {

    // Function to update an existing user record
     
    public function updateUser(Request $request, $id) {
        error_log('UpdateUsersController::updateUser called with ID: ' . $id);
        Log::info('UpdateUser request received:', ['user_id' => $id, 'data' => $request->all()]);
        
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'userId' => 'required|integer|unique:users,um_id,' . $id,
                'password' => 'nullable|string|min:8', 
            ]);

            $user->user_fullname = $request->name;
            $user->email = $request->email;
            $user->um_id = $request->userId;
            
            if ($request->filled('password')) {
                Log::info('Password update requested:', ['user_id' => $id, 'password_provided' => true]);
                $user->user_password = bcrypt($request->password); 
                Log::info('Password hashed and set for user:', ['user_id' => $id]);
            } else {
                Log::info('No password update requested:', ['user_id' => $id, 'password_value' => $request->password ?? 'null']);
            }

            $user->save();
            
            Log::info('User updated successfully:', ['user_id' => $user->id, 'email' => $user->email]);
            
            return redirect()->back()->with('success', 'User updated successfully!');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Update validation failed:', $e->errors());
            throw $e;
        } catch (\Exception $e) {
            Log::error('User update failed:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => 'Failed to update user. Please try again.']);
        }
    }
}