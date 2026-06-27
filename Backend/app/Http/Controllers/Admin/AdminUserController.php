<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function getAllUsers()
    {
        $users = DB::table('users')->select('id', 'firstname', 'lastname', 'email', 'phone', 'role', 'created_at')->orderBy('id', 'desc')->get();
        return response()->json(['code' => 200, 'message' => 'Thành công!', 'data' => $users], 200);
    }

    public function deleteUser($id)
    {
        DB::table('users')->where('id', $id)->delete();
        return response()->json(['code' => 200, 'message' => 'Xóa tài khoản thành công!'], 200);
    }
    public function createUser(Request $request)
    {
        // 1. Kiểm tra (Validate) dữ liệu đầu vào từ Frontend
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname'  => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:users',
            'password'  => 'required|string|min:6', // Bắt buộc có mật khẩu khi tạo mới
            'phone'     => 'nullable|string|max:20',
            'role'      => 'nullable|string|in:admin,customer'
        ], [
            // Tùy chỉnh thông báo lỗi (tùy chọn)
            'email.unique' => 'Email này đã tồn tại trong hệ thống.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.'
        ]);

        // Nếu dữ liệu không hợp lệ, trả về lỗi 400
        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => $validator->errors()->first() // Lấy thông báo lỗi đầu tiên
            ]);
        }

        try {
            // 2. Tạo người dùng mới trong Database
            $user = User::create([
                'firstname' => $request->firstname,
                'lastname'  => $request->lastname,
                'email'     => $request->email,
                'password'  => Hash::make($request->password), // Mã hóa mật khẩu
                'phone'     => $request->phone,
                'role'      => $request->role ?? 'customer', // Mặc định là customer nếu không truyền
            ]);

            // 3. Trả về kết quả thành công cho Frontend
            return response()->json([
                'code' => 201, // 201 Created
                'message' => 'Thêm khách hàng thành công!',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            // 4. Bắt lỗi hệ thống
            return response()->json([
                'code' => 500,
                'message' => 'Lỗi hệ thống: Không thể thêm người dùng lúc này.'
            ]);
        }
    }
}
