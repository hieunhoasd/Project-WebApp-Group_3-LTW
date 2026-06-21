<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ApiController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname'  => 'required|string|max:255',
            'email'     => 'required|string|email|max:255',
            'password'  => 'required|string|min:6',
            'phone'     => 'nullable|string|max:20', // Theo migration cho phép null
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $validator->errors()
            ], 400);
        }

        $userExists = DB::table('users')->where('email', $request->email)->first();
        if ($userExists) {
            return response()->json([
                'code' => 400,
                'message' => 'Email này đã được sử dụng bởi một tài khoản khác!'
            ], 400);
        }

        $now = now();
        $userId = DB::table('users')->insertGetId([
            'firstname'  => $request->firstname,
            'lastname'   => $request->lastname,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'phone'      => $request->phone,
            'role'       => 'customer', // Mặc định theo migration
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Tự động tạo giỏ hàng trống (cart) cho user ngay khi đăng ký thành công
        DB::table('carts')->insert([
            'user_id'    => $userId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return response()->json([
            'code' => 201,
            'message' => 'Đăng ký tài khoản và khởi tạo giỏ hàng thành công',
            'data' => [
                'id'        => $userId,
                'firstname' => $request->firstname,
                'lastname'  => $request->lastname,
                'email'     => $request->email,
                'phone'     => $request->phone,
                'role'      => 'customer'
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $validator->errors()
            ], 400);
        }

        $user = DB::table('users')->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'code' => 401,
                'message' => 'Email hoặc mật khẩu không chính xác!'
            ], 401);
        }

        $token = base64_encode($user->email . '_' . time());

        return response()->json([
            'code' => 200,
            'message' => 'Đăng nhập thành công!',
            'token' => $token, // 🌟 Gửi token này về cho React
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email
            ]
        ], 200);
    }

    public function logout(Request $request)
    {
        // Hủy bỏ toàn bộ dữ liệu session hiện tại
        $request->session()->invalidate();

        // Tạo lại token bảo vệ CSRF (khuyên dùng khi làm việc với Session)
        $request->session()->regenerateToken();

        return response()->json([
            'code' => 200,
            'message' => 'Đăng xuất thành công!'
        ], 200);
    }

    // ==========================================
    // 2. CHỨC NĂNG SẢN PHẨM & DANH MỤC
    // ==========================================

    public function getProducts()
    {
        try {
            $products = DB::table('products')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->select(
                    'products.id', // Giữ đúng ID của sản phẩm để khi bấm vào xem chi tiết không bị sai
                    'products.category_id',
                    'categories.name as category_name',
                    'products.name',
                    'products.price',
                    'products.image',
                    'products.description',
                    'products.quantity',
                    'products.status',
                    'products.created_at'
                )
                ->get();

            return response()->json([
                'code' => 200,
                'message' => 'Lấy danh sách sản phẩm thành công!',
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    // chiet san pham
    public function show($id)
    {
        $product = DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                'products.id',
                'products.category_id',
                'categories.name as category_name',
                'products.name',
                'products.price',
                'products.image',
                'products.description',
                'products.quantity',
                'products.status',
                'products.created_at'
            )
            ->where('products.id', $id)
            ->first();

        if (!$product) {
            return response()->json([
                'code' => 404,
                'message' => 'Không tìm thấy sản phẩm yêu cầu.'
            ], 404);
        }

        return response()->json([
            'code' => 200,
            'message' => 'Lấy chi tiết sản phẩm thành công.',
            'data' => $product
        ], 200);
    }

    // ==========================================
    // 3. CHỨC NĂNG GIỎ HÀNG (CARTS & CART_DETAILS)
    // ==========================================

    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'    => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['code' => 400, 'errors' => $validator->errors()], 400);
        }

        // 1. Tìm hoặc tự tạo giỏ hàng của User này nếu chưa có
        $cart = DB::table('carts')->where('user_id', $request->user_id)->first();
        $cartId = $cart ? $cart->id : DB::table('carts')->insertGetId([
            'user_id' => $request->user_id,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // 2. Kiểm tra số lượng tồn kho của sản phẩm
        $product = DB::table('products')->where('id', $request->product_id)->first();
        if ($product->quantity < $request->quantity) {
            return response()->json(['code' => 400, 'message' => 'Số lượng tồn kho không đủ!'], 400);
        }

        // 3. Thêm hoặc cập nhật số lượng trong cart_details
        $cartDetail = DB::table('cart_details')
            ->where('cart_id', $cartId)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartDetail) {
            $newQty = $cartDetail->quantity + $request->quantity;
            if ($product->quantity < $newQty) {
                return response()->json(['code' => 400, 'message' => 'Tổng số lượng vượt quá tồn kho!'], 400);
            }
            DB::table('cart_details')->where('id', $cartDetail->id)->update([
                'quantity' => $newQty,
                'updated_at' => now()
            ]);
        } else {
            DB::table('cart_details')->insert([
                'cart_id'    => $cartId,
                'product_id' => $request->product_id,
                'quantity'   => $request->quantity,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        return response()->json(['code' => 200, 'message' => 'Đã thêm sản phẩm vào giỏ hàng!'], 200);
    }

    public function getCart($userId)
    {
        $cart = DB::table('carts')->where('user_id', $userId)->first();
        if (!$cart) {
            return response()->json(['code' => 200, 'data' => []], 200);
        }

        $items = DB::table('cart_details')
            ->join('products', 'cart_details.product_id', '=', 'products.id')
            ->select('cart_details.id as cart_detail_id', 'products.id as product_id', 'products.name', 'products.price', 'products.image', 'cart_details.quantity')
            ->where('cart_id', $cart->id)
            ->get();

        return response()->json(['code' => 200, 'data' => $items], 200);
    }

    // ==========================================
    // 4. CHỨC NĂNG ĐẶT HÀNG (ORDERS & ORDER_DETAILS)
    // ==========================================

    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'          => 'required|exists:users,id',
            'shipping_address' => 'required|string',
            'phone_receiver'   => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['code' => 400, 'errors' => $validator->errors()], 400);
        }

        // 1. Lấy dữ liệu giỏ hàng
        $cart = DB::table('carts')->where('user_id', $request->user_id)->first();
        if (!$cart) {
            return response()->json(['code' => 400, 'message' => 'Giỏ hàng trống!'], 400);
        }

        $cartItems = DB::table('cart_details')
            ->join('products', 'cart_details.product_id', '=', 'products.id')
            ->select('cart_details.*', 'products.price', 'products.quantity as stock')
            ->where('cart_id', $cart->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['code' => 400, 'message' => 'Giỏ hàng không có sản phẩm để thanh toán!'], 400);
        }

        // 2. Tính tổng tiền và kiểm tra kho một lần nữa trước khi bấm mua
        $totalPrice = 0;
        foreach ($cartItems as $item) {
            if ($item->stock < $item->quantity) {
                return response()->json(['code' => 400, 'message' => "Sản phẩm mã {$item->product_id} không đủ hàng!"], 400);
            }
            $totalPrice += $item->price * $item->quantity;
        }

        // Dùng Database Transaction để đảo bảo không bị lỗi mất dữ liệu giữa chừng
        DB::beginTransaction();
        try {
            $now = now();
            // 3. Tạo đơn hàng (Orders)
            $orderId = DB::table('orders')->insertGetId([
                'user_id'          => $request->user_id,
                'total_price'      => $totalPrice,
                'status'           => 'pending', // Mặc định theo migration của bạn
                'shipping_address' => $request->shipping_address,
                'phone_receiver'   => $request->phone_receiver,
                'created_at'       => $now,
                'updated_at'       => $now,
            ]);

            // 4. Tạo chi tiết đơn hàng & Trừ kho hàng
            foreach ($cartItems as $item) {
                DB::table('order_details')->insert([
                    'order_id'   => $orderId,
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'unit_price' => $item->price, // Lưu giá tại thời điểm mua chuẩn cấu trúc migration
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                // Trừ số lượng tồn kho sản phẩm
                DB::table('products')->where('id', $item->product_id)->decrement('quantity', $item->quantity);
            }

            // 5. Xóa sạch giỏ hàng sau khi đã lên đơn thành công
            DB::table('cart_details')->where('cart_id', $cart->id)->delete();

            DB::commit();
            return response()->json(['code' => 201, 'message' => 'Đặt hàng thành công!', 'order_id' => $orderId], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['code' => 500, 'message' => 'Lỗi xử lý đơn hàng: ' . $e->getMessage()], 500);
        }
    }

    public function getUserProfile(Request $request)
    {
        // Lấy token từ Header do React gửi lên
        $token = $request->header('Authorization');

        if (!$token) {
            return response()->json([
                'code' => 401,
                'message' => 'Bạn chưa đăng nhập!'
            ], 401);
        }

        // Giải mã token để lấy email
        $decrypted = base64_decode($token);
        $email = explode('_', $decrypted)[0] ?? null;

        // Tìm user bằng email
        $user = DB::table('users')->where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'code' => 404,
                'message' => 'Người dùng không tồn tại hoặc phiên đăng nhập hết hạn!'
            ], 404);
        }

        return response()->json([
            'code' => 200,
            'message' => 'Tải thông tin thành công!',
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'phone' => $user->phone
            ]
        ], 200);
    }
}
