<?php

namespace App\Http\Controllers;

use App\Models\MilkProduction;
use App\Models\MilkSale;
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

        return Inertia::render('Dashboard', [
            'todayProduction' => $todayProduction,
            'todaySales' => $todaySales,
            'recentProductions' => $recentProductions,
        ]);
    }
}
