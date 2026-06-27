<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function getProducts()
    {
        try {
            $products = DB::table('products')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->select('products.*', 'categories.name as category_name')
                ->get();

            return response()->json(['code' => 200, 'message' => 'Thành công!', 'data' => $products], 200);
        } catch (\Exception $e) {
            return response()->json(['code' => 500, 'message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $product = DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name')
            ->where('products.id', $id)
            ->first();
        if (!$product) {
            return response()->json(['code' => 404, 'message' => 'Không tìm thấy sản phẩm.'], 404);
        }
        $avgRating = DB::table('comments')->where('product_id', $id)->avg('rating');
        $totalReviews = DB::table('comments')->where('product_id', $id)->count();
        $product->average_rating = $avgRating ? round($avgRating, 1) : 0;
        $product->total_reviews = $totalReviews;
        $comments = DB::table('comments')
            ->join('users', 'comments.user_id', '=', 'users.id')
            ->select('comments.*', 'users.firstname', 'users.lastname')
            ->where('comments.product_id', $id)
            ->orderBy('comments.created_at', 'desc')
            ->get();

        return response()->json([
            'code' => 200,
            'message' => 'Thành công.',
            'data' => [
                'product'  => $product,
                'comments' => $comments
            ]
        ], 200);
    }

    public function getProductsByCategory($id)
    {
        try {
            $products = DB::table('products')->where('category_id', $id)->where('status', 1)->get();
            $category = DB::table('categories')->where('id', $id)->first();

            return response()->json([
                'code' => 200,
                'category_name' => $category ? $category->name : 'Danh mục',
                'data' => $products
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['code' => 500, 'message' => 'Lỗi server: ' . $e->getMessage()], 500);
        }
    }
}
