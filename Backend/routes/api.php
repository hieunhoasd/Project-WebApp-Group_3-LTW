<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;

Route::post('/auth/register', [ApiController::class, 'register']);
Route::post('/auth/login', [ApiController::class, 'login']);
Route::get('/products', [ApiController::class, 'getProducts']);
Route::get('/products/{id}', [ApiController::class, 'show']);
