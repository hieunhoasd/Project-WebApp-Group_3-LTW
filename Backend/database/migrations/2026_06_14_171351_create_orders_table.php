<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('total_price', 12, 0);
            $table->string('status')->default('pending');
            $table->string('shipping_address');
            $table->string('phone_receiver');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }
};
