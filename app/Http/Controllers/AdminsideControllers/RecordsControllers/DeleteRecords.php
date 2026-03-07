<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class DeleteRecords extends Controller {

    // Function to delete a user record
    // Note: When a user is deleted, their orders and sales data are preserved in the database.
    // The user_id in orders table will be set to NULL, and orders will display "Unknown" in transactions.

    public function deleteUser($id) {
        $deleted = DB::transaction(function () use ($id) {
            // Lock the row so concurrent requests wait — prevents double-delete race condition.
            $user = User::lockForUpdate()->find($id);

            if (!$user) {
                return false;
            }

            $user->delete();
            return true;
        });

        if (!$deleted) {
            return redirect()->back()->with('error', 'User not found or has already been deleted.');
        }

        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}