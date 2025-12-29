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
        Schema::table('cows', function (Blueprint $table) {
            // Modify the type column to include 'child'
            $table->enum('type', ['milk-producing', 'non-milk-producing', 'child'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cows', function (Blueprint $table) {
            // Revert back to original enum without 'child'
            $table->enum('type', ['milk-producing', 'non-milk-producing'])->change();
        });
    }
};
