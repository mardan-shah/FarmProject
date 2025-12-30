<?php

namespace App\Http\Controllers;

use App\Models\DailyFeed;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyFeedController extends Controller
{
    public function index()
    {
        $feeds = DailyFeed::orderBy('date', 'desc')->get();
        $totalFeedMade = DailyFeed::made()->sum('amount');
        
        return Inertia::render('DailyFeed', [
            'feeds' => $feeds,
            'totalFeedMade' => $totalFeedMade,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0|max:10000000',
            'type' => 'required|in:made,used',
        ]);

        DailyFeed::create($validated);

        return redirect()->back()->with('success', 'Feed record added successfully!');
    }

    public function destroy(DailyFeed $dailyFeed)
    {
        $dailyFeed->delete();
        return redirect()->back()->with('success', 'Feed record deleted successfully!');
    }
}
