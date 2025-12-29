<?php

namespace App\Http\Controllers;

use App\Models\Cow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CowController extends Controller
{
    public function index()
    {
        $milkProducingCows = Cow::milkProducing()->active()->get();
        $nonMilkProducingCows = Cow::nonMilkProducing()->active()->get();
        $childs = Cow::childs()->active()->get();
        
        return Inertia::render('Cows', [
            'milkProducingCows' => $milkProducingCows,
            'nonMilkProducingCows' => $nonMilkProducingCows,
            'childs' => $childs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|string|max:255|unique:cows,cow_number',
            'name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'type' => 'required|in:milk-producing,non-milk-producing,child',
            'is_pregnant' => 'required|boolean',
            'pregnancy_date' => 'nullable|required_if:is_pregnant,true|date',
            'pregnancy_method' => 'nullable|required_if:is_pregnant,true|string|max:255',
        ]);

        // Create cow with proper field mapping
        Cow::create([
            'cow_number' => $validated['number'],
            'name' => $validated['name'],
            'notes' => $validated['notes'],
            'type' => $validated['type'],
            'status' => 'Active', // Set default status
            'is_pregnant' => $validated['is_pregnant'],
            'pregnancy_date' => $validated['is_pregnant'] ? $validated['pregnancy_date'] : null,
            'pregnancy_method' => $validated['is_pregnant'] ? $validated['pregnancy_method'] : null,
        ]);

        return redirect()->back()->with('success', 'Cow added successfully!');
    }

    public function update(Request $request, Cow $cow)
    {
        $validated = $request->validate([
            'number' => 'required|string|max:255|unique:cows,cow_number,' . $cow->id,
            'name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'type' => 'required|in:milk-producing,non-milk-producing,child',
            'is_pregnant' => 'required|boolean',
            'pregnancy_date' => 'nullable|required_if:is_pregnant,true|date',
            'pregnancy_method' => 'nullable|required_if:is_pregnant,true|string|max:255',
        ]);

        // Create cow with proper field mapping
        $cow->update([
            'cow_number' => $validated['number'],
            'name' => $validated['name'],
            'notes' => $validated['notes'],
            'type' => $validated['type'],
            'is_pregnant' => $validated['is_pregnant'],
            'pregnancy_date' => $validated['is_pregnant'] ? $validated['pregnancy_date'] : null,
            'pregnancy_method' => $validated['is_pregnant'] ? $validated['pregnancy_method'] : null,
        ]);

        return redirect()->back()->with('success', 'Cow updated successfully!');
    }

    public function destroy(Cow $cow)
    {
        $cow->delete();
        return redirect()->back()->with('success', 'Cow deleted successfully!');
    }
}
