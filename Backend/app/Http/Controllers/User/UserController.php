<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function userProfile(Request $request)
    {
        // Sanctum tự động giải mã Token và tìm User, bạn không cần base64_decode nữa!
        $user = $request->user();

        if (!$user) {
            return response()->json(['code' => 404, 'message' => 'Phiên đăng nhập hết hạn!'], 404);
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

    public function updateProfile(Request $request)
    {
        $userId = $request->user()->id;
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname'  => 'required|string|max:255',
            'phone'     => 'nullable|string|max:15',
            'email'     => 'required|email|max:255|unique:users,email,' . $userId,
        ], [
            'email.required' => 'Vui lòng không để trống email.',
            'email.email'    => 'Định dạng email không hợp lệ.',
            'email.unique'   => 'Email này đã được sử dụng bởi một tài khoản khác.',
        ]);
        DB::table('users')->where('id', $userId)->update([
            'firstname'  => $request->firstname,
            'lastname'   => $request->lastname,
            'phone'      => $request->phone,
            'email'      => $request->email,
            'updated_at' => now()
        ]);
        return response()->json([
            'code' => 200,
            'message' => 'Cập nhật thông tin tài khoản thành công!'
        ]);
    }
}
