<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;

Route::get('/products', [ApiController::class, 'getProducts']);
Route::get('/products/{id}', [ApiController::class, 'show']);
Route::post('/auth/register', [ApiController::class, 'register']);
Route::post('/auth/login', [ApiController::class, 'login']);
Route::get('/user-profile', [ApiController::class, 'getUserProfile']);
Route::get('/admin/users', [ApiController::class, 'getAllUsers']);
Route::delete('/admin/users/{id}', [ApiController::class, 'deleteUser']);
Route::get('/admin/products', [ApiController::class, 'getAdminProducts']);
Route::delete('/admin/products/{id}', [ApiController::class, 'deleteProduct']);
Route::post('/admin/products', [ApiController::class, 'createProduct']);
Route::get('/admin/categories', [ApiController::class, 'getAdminCategories']);
Route::post('/checkout', [ApiController::class, 'processCheckout']);
// Lấy danh sách sản phẩm thuộc một danh mục cụ thể
Route::get('/categories/{id}/products', [ApiController::class, 'getProductsByCategory']);
