<?php

namespace App\Http\Controllers\Comment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function getProductComments($productId)
    {
        $comments = DB::table('comments')
            ->join('users', 'comments.user_id', '=', 'users.id')
            ->where('comments.product_id', $productId)
            ->select('comments.*', 'users.firstname', 'users.lastname')
            ->orderBy('comments.created_at', 'desc')->get();

        return response()->json(['code' => 200, 'data' => $comments]);
    }

    public function storeComment(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $userId = $request->user()->id; // Lấy ID qua Sanctum
        $productId = $request->product_id;

        // [TÙY CHỌN] Kiểm tra xem user đã từng mua sản phẩm này qua bảng orders và order_details chưa
        $hasPurchased = DB::table('orders')
            ->join('order_details', 'orders.id', '=', 'order_details.order_id')
            ->where('orders.user_id', $userId)
            ->where('order_details.product_id', $productId)
            ->exists();

        if (!$hasPurchased) {
            return response()->json([
                'code' => 400,
                'message' => 'Bạn không thể đánh giá sản phẩm chưa mua!'
            ], 400);
        }

        DB::table('comments')->insert([
            'user_id' => $userId,
            'product_id' => $productId,
            'content' => $request->content,
            'rating' => $request->rating,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['code' => 200, 'message' => 'Đăng bình luận thành công!']);
    }
}
