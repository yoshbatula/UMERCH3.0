<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\AddRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\AdminRecordController;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\UpdateRecords;
use App\Http\Controllers\AdminsideControllers\RecordsControllers\DeleteRecords;

Route::get('/', [AdminRecordController::class, 'index'])->name('admin.recordlogin');

Route::post('/add-user', [AddRecords::class , 'addUser'])->name('admin.addUser');
Route::patch('/update-user/{id}', [UpdateRecords::class, 'updateUser'])->name('admin.updateUser');
Route::post('/update-user/{id}', [UpdateRecords::class , 'updateUser'])->name('admin.updateUser');

Route::delete('/delete-user/{id}', [DeleteRecords::class , 'deleteUser'])->name('admin.deleteUser');

?>
