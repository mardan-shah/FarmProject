<?php

namespace App\Http\Controllers;

use App\Models\MilkSale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MilkSaleController extends Controller
{
    public function index()
    {
        $recentSales = MilkSale::with('user')
            ->where('user_id', auth()->id())
            ->orderBy('sale_date', 'desc')
            ->take(10)
            ->get();

        $todaySales = MilkSale::where('user_id', auth()->id())
            ->where('sale_date', Carbon::today())
            ->first();

        // Calculate monthly totals
        $monthlyTotals = MilkSale::where('user_id', auth()->id())
            ->where('sale_date', '>=', Carbon::now()->startOfMonth())
            ->where('sale_date', '<=', Carbon::now()->endOfMonth())
            ->selectRaw('SUM(milk_kg) as total_milk, SUM(sale_amount) as total_amount')
            ->first();

        return Inertia::render('MilkSale', [
            'recentSales' => $recentSales,
            'todaySales' => $todaySales,
            'monthlyTotals' => [
                'total_milk' => $monthlyTotals->total_milk ?? 0,
                'total_amount' => $monthlyTotals->total_amount ?? 0,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_date' => 'required|date|before_or_equal:today',
            'milk_kg' => 'required|numeric|min:0|max:10000',
            'sale_amount' => 'required|numeric|min:0|max:100000',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['user_id'] = auth()->id();

        MilkSale::create($validated);

        return redirect()->back()->with('success', 'Milk sale recorded successfully!');
    }

    public function update(Request $request, MilkSale $milkSale)
    {
        if ($milkSale->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'sale_date' => 'required|date|before_or_equal:today',
            'milk_kg' => 'required|numeric|min:0|max:10000',
            'sale_amount' => 'required|numeric|min:0|max:100000',
            'notes' => 'nullable|string|max:1000',
        ]);

        $milkSale->update($validated);

        return redirect()->back()->with('success', 'Milk sale updated successfully!');
    }

    public function destroy(MilkSale $milkSale)
    {
        if ($milkSale->user_id !== auth()->id()) {
            abort(403);
        }

        $milkSale->delete();

        return redirect()->back()->with('success', 'Milk sale deleted successfully!');
    }

    public function report($period)
    {
        // For future PDF report generation
        return response()->json(['message' => 'Sales report generation coming soon']);
    }
}
