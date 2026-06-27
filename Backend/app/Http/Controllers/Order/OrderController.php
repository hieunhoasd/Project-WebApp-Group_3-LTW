<?php

namespace App\Http\Controllers\Order;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address' => 'required|string',
            'phone_receiver'   => 'required|string',
            'items'            => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['code' => 400, 'message' => 'Dữ liệu không hợp lệ: ' . implode(', ', $validator->errors()->all())], 400);
        }

        $userId = $request->user()->id;
        $cartItems = $request->items;
        $totalPrice = 0;

        foreach ($cartItems as $item) {
            $product = DB::table('products')->where('id', $item['product_id'])->first();
            if ($product->quantity < $item['quantity']) {
                return response()->json(['code' => 400, 'message' => "Sản phẩm '{$product->name}' không đủ hàng!"], 400);
            }
            $totalPrice += $product->price * $item['quantity'];
        }

        DB::beginTransaction();
        try {
            $now = now();
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $userId,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'phone_receiver' => $request->phone_receiver,
                'note' => $request->note ?? null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach ($cartItems as $item) {
                $product = DB::table('products')->where('id', $item['product_id'])->first();
                DB::table('order_details')->insert([
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                DB::table('products')->where('id', $item['product_id'])->decrement('quantity', $item['quantity']);
            }

            // Xóa giỏ hàng sau khi checkout thành công
            $cart = DB::table('carts')->where('user_id', $userId)->first();
            if ($cart) DB::table('cart_details')->where('cart_id', $cart->id)->delete();

            DB::commit();
            return response()->json(['code' => 200, 'message' => 'Đặt hàng thành công!', 'order_id' => $orderId], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['code' => 500, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }

    public function getUserOrders(Request $request)
    {
        $userId = $request->user()->id;
        $orders = DB::table('orders')->where('user_id', $userId)->orderBy('created_at', 'desc')->get();

        return response()->json(['code' => 200, 'message' => 'Lấy lịch sử đơn hàng thành công', 'data' => $orders], 200);
    }

    public function getProductsByOrder($orderId)
    {
        $products = DB::table('order_details')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->where('order_details.order_id', $orderId)
            ->select('products.id', 'products.name', 'products.image') // Lấy id và tên sản phẩm để hiển thị ở dropdown
            ->get();

        return response()->json([
            'code' => 200,
            'data' => $products
        ]);
    }
}
