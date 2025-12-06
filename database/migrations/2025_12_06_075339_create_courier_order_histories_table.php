<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courier_order_histories', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->index();
            $table->json('data')->nullable();
            $table->decimal('success_ratio', 5, 2)->default(0);
            $table->integer('total_orders')->default(0);
            $table->integer('cancel_orders')->default(0);
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courier_order_histories');
    }
};
