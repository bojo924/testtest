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
        Schema::table('cart_items', function (Blueprint $table) {
            $table->boolean('is_custom')->default(false);
            $table->string('custom_color')->nullable();
            $table->string('custom_design_path')->nullable();
            $table->decimal('custom_price', 8, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            $table->dropColumn(['is_custom', 'custom_color', 'custom_design_path', 'custom_price']);
        });
    }
};
