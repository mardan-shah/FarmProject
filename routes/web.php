<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MilkProductionController;
use App\Http\Controllers\MilkSaleController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PendingPaymentController;
use App\Http\Controllers\CowController;
use App\Http\Controllers\DailyFeedController;
use App\Http\Controllers\SilageController;
use App\Http\Controllers\DonationController;
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
    
    Route::get('/cows', [CowController::class, 'index'])->name('cows');
    Route::post('/cows', [CowController::class, 'store'])->name('cows.store');
    Route::put('/cows/{cow}', [CowController::class, 'update'])->name('cows.update');
    Route::delete('/cows/{cow}', [CowController::class, 'destroy'])->name('cows.destroy');
    
    Route::get('/daily-feed', [DailyFeedController::class, 'index'])->name('daily-feed');
    Route::post('/daily-feed', [DailyFeedController::class, 'store'])->name('daily-feed.store');
    Route::delete('/daily-feed/{dailyFeed}', [DailyFeedController::class, 'destroy'])->name('daily-feed.destroy');
    
    Route::get('/silage', [SilageController::class, 'index'])->name('silage');
    Route::post('/silage', [SilageController::class, 'store'])->name('silage.store');
    Route::delete('/silage/{silage}', [SilageController::class, 'destroy'])->name('silage.destroy');
    
    Route::get('/pending-payments', [PendingPaymentController::class, 'index'])->name('pending-payments');
    Route::post('/pending-payments', [PendingPaymentController::class, 'store'])->name('pending-payments.store');
    Route::delete('/pending-payments/{id}', [PendingPaymentController::class, 'destroy'])->name('pending-payments.destroy');
    
    Route::get('/donations', [DonationController::class, 'index'])->name('donations');
    Route::post('/donations', [DonationController::class, 'store'])->name('donations.store');
    Route::put('/donations/{donation}', [DonationController::class, 'update'])->name('donations.update');
    Route::delete('/donations/{donation}', [DonationController::class, 'destroy'])->name('donations.destroy');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
