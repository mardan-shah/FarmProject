<?php

namespace App\Http\Controllers;

use App\Models\MilkProduction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class MilkProductionController extends Controller
{
    public function index()
    {
        $recentProductions = MilkProduction::with('user')
            ->where('user_id', auth()->id())
            ->orderBy('production_date', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('MilkProduction', [
            'recentProductions' => $recentProductions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'production_date' => 'required|date|before_or_equal:today',
            'milk_kg' => 'required|numeric|min:0|max:10000000',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['user_id'] = auth()->id();

        MilkProduction::create($validated);

        return redirect()->back()->with('success', 'Milk production recorded successfully!');
    }

    public function destroy(MilkProduction $milkProduction)
    {
        if ($milkProduction->user_id !== auth()->id()) {
            abort(403);
        }

        $milkProduction->delete();

        return redirect()->back()->with('success', 'Milk production record deleted successfully!');
    }

    public function report($period)
    {
        $user = auth()->user();
        $endDate = now();
        $startDate = $this->getStartDateByPeriod($period, $endDate);
        
        $productions = MilkProduction::where('user_id', $user->id)
            ->whereBetween('production_date', [$startDate, $endDate])
            ->orderBy('production_date', 'asc')
            ->get();

        if ($productions->isEmpty()) {
            return redirect()->back()->with('error', 'No production data found for the selected period.');
        }

        $reportData = [
            'period' => $period,
            'startDate' => $startDate->format('M d, Y'),
            'endDate' => $endDate->format('M d, Y'),
            'productions' => $productions,
            'totalMilk' => $productions->sum('milk_kg'),
            'averageMilk' => $productions->avg('milk_kg'),
            'totalDays' => $productions->count(),
            'user' => $user,
            'reportTitle' => $this->getReportTitle($period),
        ];

        $pdf = Pdf::loadView('reports.milk-production', $reportData);
        
        $filename = 'milk-production-' . $period . '-' . now()->format('Y-m-d') . '.pdf';
        
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
                return 'Weekly Milk Production Report';
            case 'monthly':
                return 'Monthly Milk Production Report';
            case '3-month':
                return '3-Month Milk Production Report';
            case '6-month':
                return '6-Month Milk Production Report';
            case '12-month':
                return '12-Month Milk Production Report';
            default:
                return 'Milk Production Report';
        }
    }
}
