<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['code' => 400, 'errors' => $validator->errors()], 400);
        }

        $userId = $request->user()->id; // Tự động lấy User ID từ Sanctum Token

        $cart = DB::table('carts')->where('user_id', $userId)->first();
        $cartId = $cart ? $cart->id : DB::table('carts')->insertGetId([
            'user_id' => $userId,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $product = DB::table('products')->where('id', $request->product_id)->first();
        if ($product->quantity < $request->quantity) {
            return response()->json(['code' => 400, 'message' => 'Số lượng tồn kho không đủ!'], 400);
        }

        $cartDetail = DB::table('cart_details')->where('cart_id', $cartId)->where('product_id', $request->product_id)->first();

        if ($cartDetail) {
            $newQty = $cartDetail->quantity + $request->quantity;
            if ($product->quantity < $newQty) return response()->json(['code' => 400, 'message' => 'Vượt quá tồn kho!'], 400);
            DB::table('cart_details')->where('id', $cartDetail->id)->update(['quantity' => $newQty, 'updated_at' => now()]);
        } else {
            DB::table('cart_details')->insert(['cart_id' => $cartId, 'product_id' => $request->product_id, 'quantity' => $request->quantity, 'created_at' => now(), 'updated_at' => now()]);
        }

        return response()->json(['code' => 200, 'message' => 'Đã thêm sản phẩm vào giỏ hàng!'], 200);
    }

    public function getCart(Request $request)
    {
        $userId = $request->user()->id;
        $cart = DB::table('carts')->where('user_id', $userId)->first();

        if (!$cart) return response()->json(['code' => 200, 'data' => []], 200);

        $items = DB::table('cart_details')
            ->join('products', 'cart_details.product_id', '=', 'products.id')
            ->select('cart_details.id as cart_detail_id', 'products.id as product_id', 'products.name', 'products.price', 'products.image', 'cart_details.quantity')
            ->where('cart_id', $cart->id)
            ->get();

        return response()->json(['code' => 200, 'data' => $items], 200);
    }
}
