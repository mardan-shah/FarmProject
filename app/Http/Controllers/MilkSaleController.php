<?php

namespace App\Http\Controllers;

use App\Models\MilkSale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

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
            'milk_kg' => 'required|numeric|min:0|max:10000000',
            'sale_amount' => 'required|numeric|min:0|max:10000000',
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
            'milk_kg' => 'required|numeric|min:0|max:10000000',
            'sale_amount' => 'required|numeric|min:0|max:10000000',
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
        $user = auth()->user();
        $endDate = now();
        $startDate = $this->getStartDateByPeriod($period, $endDate);
        
        $sales = MilkSale::where('user_id', $user->id)
            ->whereBetween('sale_date', [$startDate, $endDate])
            ->orderBy('sale_date', 'asc')
            ->get();

        if ($sales->isEmpty()) {
            return redirect()->back()->with('error', 'No sales data found for the selected period.');
        }

        $reportData = [
            'period' => $period,
            'startDate' => $startDate->format('M d, Y'),
            'endDate' => $endDate->format('M d, Y'),
            'sales' => $sales,
            'totalMilk' => $sales->sum('milk_kg'),
            'totalAmount' => $sales->sum('sale_amount'),
            'averagePrice' => $sales->avg('sale_amount') / max($sales->avg('milk_kg'), 1),
            'totalSales' => $sales->count(),
            'user' => $user,
            'reportTitle' => $this->getReportTitle($period),
        ];

        $pdf = Pdf::loadView('reports.milk-sale', $reportData);
        
        $filename = 'milk-sale-' . $period . '-' . now()->format('Y-m-d') . '.pdf';
        
        return $pdf->download($filename);
    }

    private function getStartDateByPeriod($period, $endDate)
    {
        switch ($period) {
            case 'weekly':
                return $endDate->copy()->subDays(7);
            case 'monthly':
                return $endDate->copy()->subMonth();
            case '3-month':
                return $endDate->copy()->subMonths(3);
            case '6-month':
                return $endDate->copy()->subMonths(6);
            case '12-month':
                return $endDate->copy()->subYear();
            default:
                return $endDate->copy()->subMonth();
        }
    }

    private function getReportTitle($period)
    {
        switch ($period) {
            case 'weekly':
                return 'Weekly Milk Sales Report';
            case 'monthly':
                return 'Monthly Milk Sales Report';
            case '3-month':
                return '3-Month Milk Sales Report';
            case '6-month':
                return '6-Month Milk Sales Report';
            case '12-month':
                return '12-Month Milk Sales Report';
            default:
                return 'Milk Sales Report';
        }
    }
}
