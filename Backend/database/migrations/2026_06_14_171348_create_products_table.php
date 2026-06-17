<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 12, 0); // Sử dụng decimal cho tiền tệ tránh lỗi làm tròn
            $table->string('image');
            $table->text('description')->nullable();
            $table->integer('quantity');
            $table->tinyInteger('status')->default(1); // 1: mở bán / 0: hết hàng
            $table->timestamps();
        });
    }
};
