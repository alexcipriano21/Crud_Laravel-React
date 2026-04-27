<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/registrar', [AuthController::class, 'registrar']);
Route::post('/olvide-password', [AuthController::class, 'olvidePassword']);
Route::post('/actualizar-password', [AuthController::class, 'actualizarPassword']);
Route::get('/auth/google', [AuthController::class, 'redireccionarGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'callbackGoogle']);

Route::middleware('auth:api')->group(function() {
    Route::get('/usuarios', [UserController::class, 'obtenerUsuarios']);
    Route::get('/usuarios/{id}', [UserController::class, 'obtenerUsuario']);
    Route::post('/usuarios', [UserController::class, 'crearUsuario']);
    Route::put('/usuarios/{id}', [UserController::class, 'actualizarUsuario']);
    Route::delete('/usuarios/{id}', [UserController::class, 'eliminarUsuario']);
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/charts', [DashboardController::class, 'getCharts']);
    
});




