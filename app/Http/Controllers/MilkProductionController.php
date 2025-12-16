<?php

namespace App\Http\Controllers;

use App\Models\MilkProduction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

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
            'milk_kg' => 'required|numeric|min:0|max:10000',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['user_id'] = auth()->id();

        MilkProduction::create($validated);

        return redirect()->back()->with('success', 'Milk production recorded successfully!');
    }

    public function report($period)
    {
        // For future PDF report generation
        return response()->json(['message' => 'Report generation coming soon']);
    }
}
