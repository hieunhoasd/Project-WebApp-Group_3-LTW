<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function getAdminCategories()
    {
        $categories = DB::table('categories')->select('id', 'name')->get();
        return response()->json(['code' => 200, 'message' => 'Thành công!', 'data' => $categories], 200);
    }
}
