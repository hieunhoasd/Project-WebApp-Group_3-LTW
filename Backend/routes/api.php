<?php

use Illuminate\Support\Facades\Route;

// --- CÁC ĐOẠN IMPORT GIỮ NGUYÊN ---
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\CategoryController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\Order\OrderController;
use App\Http\Controllers\Comment\CommentController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (Ai cũng có thể truy cập - Không cần Token)
|--------------------------------------------------------------------------
*/

// Xác thực (Auth)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Sản phẩm (Products)
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'getProducts']);
    Route::get('/{id}', [ProductController::class, 'show']);
    Route::get('/{productId}/comments', [CommentController::class, 'getProductComments']);
});

// Danh mục (Categories)
Route::get('/categories', [CategoryController::class, 'getAdminCategories']);
Route::get('/categories/{id}/products', [ProductController::class, 'getProductsByCategory']);


/*
|--------------------------------------------------------------------------
| USER ROUTES (Bảo mật bằng Laravel Sanctum Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Đăng xuất
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Hồ sơ cá nhân (Profile)
    Route::prefix('user-profile')->group(function () {
        Route::get('/', [UserController::class, 'userProfile']);
        Route::put('/update', [UserController::class, 'updateProfile']);
    });

    // Giỏ hàng (Cart)
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'getCart']);
        Route::post('/add', [CartController::class, 'addToCart']);
    });

    // Đơn hàng (Orders Client) - ĐÃ ĐƯA ROUTE MỚI VÀO ĐÂY ĐỂ BẢO MẬT
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'getUserOrders']);
        Route::post('/', [OrderController::class, 'checkout']);
        Route::get('/{id}/products', [OrderController::class, 'getProductsByOrder']); // URL: /api/orders/{id}/products
    });

    // Bình luận (Comments)
    Route::post('/comments', [CommentController::class, 'storeComment']);
});


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (Yêu cầu Token Sanctum + Quyền Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Quản lý thành viên (Users Management)
    Route::prefix('users')->group(function () {
        Route::get('/', [AdminUserController::class, 'getAllUsers']);
        Route::post('/', [AdminUserController::class, 'createUser']);
        Route::delete('/{id}', [AdminUserController::class, 'deleteUser']);
    });

    // Quản lý sản phẩm (Products Management)
    Route::prefix('products')->group(function () {
        Route::get('/', [AdminProductController::class, 'getAdminProducts']);
        Route::post('/', [AdminProductController::class, 'createProduct']);
        Route::delete('/{id}', [AdminProductController::class, 'deleteProduct']);
    });

    // Quản lý danh mục phía Admin (URL: /api/admin/categories)
    Route::get('/categories', [CategoryController::class, 'getAdminCategories']);

    // Quản lý đơn hàng (Orders Management)
    Route::prefix('orders')->group(function () {
        Route::get('/', [AdminOrderController::class, 'getAllOrders']);
        Route::put('/{orderId}/status', [AdminOrderController::class, 'updateOrderStatus']);
    });
});


/*
|--------------------------------------------------------------------------
| FALLBACK LOGIN REDIRECT
|--------------------------------------------------------------------------
*/
Route::get('/login', function () {
    return response()->json([
        'code' => 401,
        'message' => 'Bạn chưa đăng nhập hoặc Token không hợp lệ!'
    ], 401);
})->name('login');
