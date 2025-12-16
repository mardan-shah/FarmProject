<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MilkProductionController;
use App\Http\Controllers\MilkSaleController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/api/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'environment' => app()->environment()
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Farm Management Routes
Route::middleware('auth')->group(function () {
    Route::get('/milk-production', [MilkProductionController::class, 'index'])->name('milk-production');
    Route::post('/milk-production', [MilkProductionController::class, 'store'])->name('milk-production.store');
    Route::get('/milk-production/report/{period}', [MilkProductionController::class, 'report'])->name('milk-production.report');
    
    Route::get('/milk-sale', [MilkSaleController::class, 'index'])->name('milk-sale');
    Route::post('/milk-sale', [MilkSaleController::class, 'store'])->name('milk-sale.store');
    Route::put('/milk-sale/{milkSale}', [MilkSaleController::class, 'update'])->name('milk-sale.update');
    Route::delete('/milk-sale/{milkSale}', [MilkSaleController::class, 'destroy'])->name('milk-sale.destroy');
    Route::get('/milk-sale/report/{period}', [MilkSaleController::class, 'report'])->name('milk-sale.report');
    
    Route::get('/expenses', [ExpenseController::class, 'index'])->name('expenses');
    Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
    Route::get('/expenses/report/{period}', [ExpenseController::class, 'report'])->name('expenses.report');
    
    Route::get('/cows', function () {
        return Inertia::render('Cows');
    })->name('cows');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
