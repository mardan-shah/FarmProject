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

        // Total expenses
        $totalExpenses = Expense::sum('amount');

        // Today's net profit (today's total sales - today's total expenses)
        $todayExpenses = Expense::where('expense_date', Carbon::today())->sum('amount');
        $todayTotalSales = MilkSale::where('sale_date', Carbon::today())->sum('sale_amount');
        $todayNetProfit = $todayTotalSales - $todayExpenses;

        return Inertia::render('Dashboard', [
            'todayProduction' => $todayProduction,
            'todaySales' => $todaySales,
            'recentProductions' => $recentProductions,
            'totalCows' => $totalCows,
            'totalExpenses' => $totalExpenses,
            'todayNetProfit' => $todayNetProfit,
            'todayExpenses' => $todayExpenses,
        ]);
    }
}
