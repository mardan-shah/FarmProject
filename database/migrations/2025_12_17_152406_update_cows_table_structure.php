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
            // Check if columns don't exist before adding them
            if (!Schema::hasColumn('cows', 'type')) {
                $table->enum('type', ['milk-producing', 'non-milk-producing'])->after('notes');
            }
            if (!Schema::hasColumn('cows', 'status')) {
                $table->string('status')->default('Active')->after('type');
            }
            if (!Schema::hasColumn('cows', 'is_pregnant')) {
                $table->boolean('is_pregnant')->default(false)->after('status');
            }
            if (!Schema::hasColumn('cows', 'pregnancy_date')) {
                $table->date('pregnancy_date')->nullable()->after('is_pregnant');
            }
            if (!Schema::hasColumn('cows', 'pregnancy_method')) {
                $table->enum('pregnancy_method', ['injection', 'natural'])->nullable()->after('pregnancy_date');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cows', function (Blueprint $table) {
            $table->dropColumn(['type', 'status', 'is_pregnant', 'pregnancy_date', 'pregnancy_method']);
        });
    }
};
