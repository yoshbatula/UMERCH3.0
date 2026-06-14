<?php

namespace App\Http\Controllers\AdminsideControllers\RecordsControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class AdminRecordController extends Controller
{
    // Display a listing of the users.
    public function index()
    {
        $users = User::all();
        return Inertia::render('Admin-side/RecordLogin-page/AdminRecord', [
            'users' => $users,
        ]);
    }
}
