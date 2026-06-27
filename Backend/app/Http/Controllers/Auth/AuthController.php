<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname'  => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:users',
            'password'  => 'required|string|min:6',
            'phone'     => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $validator->errors()
            ], 400);
        }

        // Bọc trong DB Transaction để đảm bảo nếu lỗi ở bước tạo giỏ hàng thì user cũng không bị tạo lỗi
        DB::beginTransaction();
        try {
            // Sử dụng Eloquent thay vì DB::table để tận dụng được các tính năng của Model (như tạo token)
            $user = User::create([
                'firstname'  => $request->firstname,
                'lastname'   => $request->lastname,
                'email'      => $request->email,
                'password'   => Hash::make($request->password),
                'phone'      => $request->phone,
                'role'       => 'customer',
            ]);

            // Khởi tạo giỏ hàng
            DB::table('carts')->insert([
                'user_id'    => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Tạo Token ngay sau khi đăng ký thành công
            $token = $user->createToken('velora_token')->plainTextToken;

            DB::commit();

            return response()->json([
                'code' => 201,
                'message' => 'Đăng ký tài khoản và khởi tạo giỏ hàng thành công',
                'token' => $token, // Trả về token để React có thể auto-login
                'user' => [
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'role' => $user->role,
                    'isAdmin' => false
                ]
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['code' => 500, 'message' => 'Lỗi máy chủ nội bộ: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401);
        }

        // Chỉ cho phép 1 phiên đăng nhập
        $user->tokens()->delete();

        $token = $user->createToken('velora_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Đăng nhập thành công',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'isAdmin' => $user->role === 'admin'
                ]
            ]
        ], 200);
    }

    public function logout(Request $request)
    {
        $token = $request->user()?->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công'
        ], 200);
    }
}
