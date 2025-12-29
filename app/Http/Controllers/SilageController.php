<?php

namespace App\Http\Controllers;

use App\Models\Silage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SilageController extends Controller
{
    public function index()
    {
        $silages = Silage::orderBy('date', 'desc')->get();
        $totalSilageMade = Silage::made()->sum('amount');
        
        return Inertia::render('Silage', [
            'feeds' => $silages,
            'totalFeedMade' => $totalSilageMade,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:made,used',
        ]);

        Silage::create($validated);

        return redirect()->back()->with('success', 'Silage record added successfully!');
    }

    public function destroy(Silage $silage)
    {
        $silage->delete();
        return redirect()->back()->with('success', 'Silage record deleted successfully!');
    }
}
