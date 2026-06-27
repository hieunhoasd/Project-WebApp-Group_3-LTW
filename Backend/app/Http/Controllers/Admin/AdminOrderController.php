<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Exception;

class AdminOrderController extends Controller
{
    public function getAllOrders()
    {
        $orders = DB::table('orders')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select('orders.*', 'users.firstname', 'users.lastname', 'users.email')
            ->orderBy('orders.created_at', 'desc')
            ->get();
        return response()->json([
            'code' => 200,
            'data' => $orders
        ]);
    }

    public function updateOrderStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $order = DB::table('orders')
            ->where('id', $orderId)
            ->first();

        if (!$order) {
            return response()->json([
                'code' => 404,
                'message' => 'Không tìm thấy đơn hàng'
            ], 404);
        }

        DB::table('orders')
            ->where('id', $orderId)
            ->update([
                'status' => $request->status,
                'updated_at' => now()
            ]);

        return response()->json([
            'code' => 200,
            'message' => 'Cập nhật trạng thái thành công'
        ]);
    }
}
