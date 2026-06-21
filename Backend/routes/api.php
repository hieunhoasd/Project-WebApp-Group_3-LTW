<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;

// Các API công khai không cần session (nếu có)
Route::get('/products', [ApiController::class, 'getProducts']);
Route::get('/products/{id}', [ApiController::class, 'show']);
Route::post('/auth/register', [ApiController::class, 'register']);

// 🔥 BẮT BUỘC: Đưa cả Login và User-Profile vào cụm 'web' middleware này để dùng chung Session Cookie
Route::post('/auth/login', [ApiController::class, 'login']);
Route::get('/user-profile', [ApiController::class, 'getUserProfile']);
