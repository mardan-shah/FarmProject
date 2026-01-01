<?php

namespace App\Http\Controllers;

use App\Models\MilkProduction;
use App\Models\MilkSale;
use App\Models\Expense;
use App\Models\Cow;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $todayProduction = MilkProduction::where('user_id', auth()->id())
            ->where('production_date', Carbon::today())
            ->first();

        $todaySales = MilkSale::where('user_id', auth()->id())
            ->where('sale_date', Carbon::today())
            ->first();

        $recentProductions = MilkProduction::where('user_id', auth()->id())
            ->orderBy('production_date', 'desc')
            ->take(5)
            ->get();

        // Total cows count
        $totalCows = Cow::count();

        // Total expenses for current user
        $totalExpenses = Expense::where('user_id', auth()->id())->sum('amount');

        // Monthly calculations (current month)
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        
        // Total milk sales for current month
        $monthlySales = MilkSale::where('user_id', auth()->id())
            ->whereBetween('sale_date', [$startOfMonth, $endOfMonth])
            ->sum('sale_amount');
            
        // Total expenses for current month
        $monthlyExpenses = Expense::where('user_id', auth()->id())
            ->whereBetween('expense_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');
            
        // Monthly net profit
        $monthlyNetProfit = $monthlySales - $monthlyExpenses;
        
        // Calculate profit margin
        $profitMargin = $monthlySales > 0 ? (($monthlyNetProfit / $monthlySales) * 100) : 0;

        return Inertia::render('Dashboard', [
            'todayProduction' => $todayProduction,
            'todaySales' => $todaySales,
            'recentProductions' => $recentProductions,
            'totalCows' => $totalCows,
            'totalExpenses' => $totalExpenses,
            'monthlyNetProfit' => $monthlyNetProfit,
            'monthlySales' => $monthlySales,
            'monthlyExpenses' => $monthlyExpenses,
            'profitMargin' => $profitMargin,
        ]);
    }
}
