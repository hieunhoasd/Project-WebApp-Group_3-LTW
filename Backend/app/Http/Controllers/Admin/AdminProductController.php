<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminProductController extends Controller
{
    public function getAdminProducts()
    {
        $products = DB::table('products')->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name')->orderBy('products.id', 'desc')->get();
        return response()->json(['code' => 200, 'data' => $products], 200);
    }

    public function deleteProduct($id)
    {
        DB::table('products')->where('id', $id)->delete();
        return response()->json(['code' => 200, 'message' => 'Xóa sản phẩm thành công!'], 200);
    }

    public function createProduct(Request $request)
    {
        $request->validate([
            'category_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $request->file('image')->storeAs('products', $fileName, 'public');
            $imagePath = '/storage/products/' . $fileName;
        }

        $productId = DB::table('products')->insertGetId([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'description' => $request->description,
            'image' => $imagePath,
            'status' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $newProduct = DB::table('products')->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('products.*', 'categories.name as category_name')->where('products.id', $productId)->first();

        return response()->json(['code' => 200, 'message' => 'Thêm thành công!', 'data' => $newProduct], 200);
    }
}
