<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Exception;

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
        try {
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

            // Lấy thông tin user từ database
            $user = DB::table('users')->where('email', $request->email)->first();

            // Kiểm tra user tồn tại và check mật khẩu
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'code' => 401,
                    'message' => 'Email hoặc mật khẩu không chính xác!'
                ], 401);
            }

            // Tạo token mã hóa chuỗi cơ bản
            $token = base64_encode($user->email . '_' . time());

            // 🌟 ĐỒNG BỘ BẢO MẬT: Ép kiểu dữ liệu về chuỗi text thuần túy để so sánh an toàn
            $userRole = isset($user->role) ? (string)$user->role : 'customer';
            $isAdmin = ($userRole === 'admin'); // Trả về true nếu cột role trong DB có chữ 'admin'

            return response()->json([
                'code' => 200,
                'message' => 'Đăng nhập thành công!',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'isAdmin' => $isAdmin // Trả về true/false về cho React nhận diện ẩn
                ]
            ], 200);
        } catch (Exception $e) {
            // Nếu có bất kỳ lỗi phát sinh nào, dòng này sẽ hứng lấy và hiển thị chi tiết thay vì vứt lỗi sập 500 trắng trơn
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi máy chủ nội bộ: ' . $e->getMessage()
            ], 500);
        }
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

    // ==========================================
    // 5. CHỨC NĂNG ĐẶT HÀNG (ORDERS & ORDER_DETAILS)
    // ==========================================

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

    public function getAllUsers()
    {
        try {
            // Lấy danh sách user, loại bỏ cột password
            $users = DB::table('users')
                ->select('id', 'firstname', 'lastname', 'email', 'phone', 'role', 'created_at')
                ->orderBy('id', 'desc') // Sắp xếp user mới nhất lên đầu
                ->get();

            return response()->json([
                'code' => 200,
                'message' => 'Lấy danh sách người dùng thành công!',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi máy chủ nội bộ: ' . $e->getMessage()
            ], 500);
        }
    }
    // Hàm xóa người dùng dành cho Admin
    public function deleteUser($id)
    {
        try {
            // Kiểm tra xem user có tồn tại không
            $user = DB::table('users')->where('id', $id)->first();

            if (!$user) {
                return response()->json([
                    'code' => 404,
                    'message' => 'Không tìm thấy người dùng này trong hệ thống!'
                ], 404);
            }

            // Thực hiện xóa
            DB::table('users')->where('id', $id)->delete();

            return response()->json([
                'code' => 200,
                'message' => 'Xóa tài khoản người dùng thành công!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi khi xóa người dùng: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getAdminProducts()
    {
        try {
            $products = DB::table('products')
                // Thực hiện JOIN sang bảng categories dựa trên id danh mục
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->select(
                    'products.id',
                    'products.name',
                    'products.price',
                    'products.quantity',
                    'products.created_at',
                    'categories.name as category_name' // Lấy tên danh mục ra đặt tên là category_name
                )
                ->orderBy('products.id', 'desc') // Đưa sản phẩm mới nhất lên đầu
                ->get();

            return response()->json([
                'code' => 200,
                'message' => 'Lấy danh sách sản phẩm quản trị thành công!',
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }
    public function deleteProduct($id)
    {
        try {
            // Tìm sản phẩm trong DB
            $product = DB::table('products')->where('id', $id)->first();

            // Nếu không tìm thấy sản phẩm
            if (!$product) {
                return response()->json([
                    'code' => 404,
                    'message' => 'Sản phẩm không tồn tại hoặc đã bị xóa trước đó!'
                ], 404);
            }

            // Tiến hành xóa khỏi DB
            DB::table('products')->where('id', $id)->delete();

            return response()->json([
                'code' => 200,
                'message' => 'Xóa sản phẩm khỏi hệ thống thành công!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi hệ thống khi xóa: ' . $e->getMessage()
            ], 500);
        }
    }
    public function createProduct(Request $request)
    {
        try {
            // 1. Kiểm tra dữ liệu đầu vào (Validate) dựa theo Model của sếp
            $request->validate([
                'category_id' => 'required|integer',
                'name'        => 'required|string|max:255',
                'price'       => 'required|numeric|min:0',
                'quantity'    => 'required|integer|min:0',
                'description' => 'nullable|string',
                'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Tối đa 2MB
            ], [
                'category_id.required' => 'Vui lòng chọn danh mục sản phẩm.',
                'name.required'        => 'Tên sản phẩm không được để trống.',
                'price.required'       => 'Giá bán không được để trống.',
                'quantity.required'    => 'Số lượng kho không được để trống.',
                'image.image'          => 'File tải lên phải là định dạng hình ảnh.',
                'image.max'            => 'Kích thước ảnh tối đa là 2MB.',
            ]);

            // 2. Xử lý Upload hình ảnh nếu Admin có chọn file
            $imagePath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = time() . '_' . $file->getClientOriginalName();
                // Lưu vào public/storage/products
                $file->storeAs('products', $fileName, 'public');
                // Đường dẫn lưu vào DB: /storage/products/tên_file
                $imagePath = '/storage/products/' . $fileName;
            }

            // 3. Tiến hành thêm dữ liệu trực tiếp vào DB
            $productId = DB::table('products')->insertGetId([
                'category_id' => $request->category_id,
                'name'        => $request->name,
                'price'       => $request->price,
                'quantity'    => $request->quantity,
                'description' => $request->description,
                'image'       => $imagePath,
                'status'      => 1, // Mặc định là Active khi tạo mới
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            // 4. Lấy lại sản phẩm vừa tạo kết hợp JOIN với categories để hiển thị đồng bộ lên table frontend
            $newProduct = DB::table('products')
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
                ->where('products.id', $productId)
                ->first();

            return response()->json([
                'code' => 200,
                'message' => 'Thêm sản phẩm mới thành công!',
                'data' => $newProduct
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'code' => 422,
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi hệ thống khi tạo sản phẩm: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getAdminCategories()
    {
        try {
            $categories = DB::table('categories')
                ->select('id', 'name')
                ->get();

            return response()->json([
                'code' => 200,
                'message' => 'Lấy danh sách danh mục thành công!',
                'data' => $categories
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }
    public function getProductsByCategory($id)
    {
        try {
            // Lấy các sản phẩm có category_id khớp và đang ở trạng thái kích hoạt (status = 1)
            $products = DB::table('products')
                ->where('category_id', $id)
                ->where('status', 1)
                ->get();

            // Lấy thêm thông tin tên danh mục để hiển thị tiêu đề ở FE
            $category = DB::table('categories')->where('id', $id)->first();

            return response()->json([
                'code' => 200,
                'category_name' => $category ? $category->name : 'Danh mục',
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi server: ' . $e->getMessage()
            ], 500);
        }
    }
}
