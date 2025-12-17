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
        
        return Inertia::render('Cows', [
            'milkProducingCows' => $milkProducingCows,
            'nonMilkProducingCows' => $nonMilkProducingCows,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|string|max:255|unique:cows,cow_number',
            'name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'type' => 'required|in:milk-producing,non-milk-producing',
            'is_pregnant' => 'required|boolean',
            'pregnancy_date' => 'required_if:is_pregnant,true|date',
            'pregnancy_method' => 'required_if:is_pregnant,true|in:injection,natural',
        ]);

        // Map 'number' to 'cow_number' for database
        $cowData = $validated;
        $cowData['cow_number'] = $validated['number'];
        unset($cowData['number']);

        Cow::create($cowData);

        return redirect()->back()->with('success', 'Cow added successfully!');
    }

    public function update(Request $request, Cow $cow)
    {
        $validated = $request->validate([
            'number' => 'required|string|max:255|unique:cows,cow_number,' . $cow->id,
            'name' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'type' => 'required|in:milk-producing,non-milk-producing',
            'is_pregnant' => 'required|boolean',
            'pregnancy_date' => 'required_if:is_pregnant,true|date',
            'pregnancy_method' => 'required_if:is_pregnant,true|in:injection,natural',
        ]);

        // Map 'number' to 'cow_number' for database
        $cowData = $validated;
        $cowData['cow_number'] = $validated['number'];
        unset($cowData['number']);

        $cow->update($cowData);

        return redirect()->back()->with('success', 'Cow updated successfully!');
    }

    public function destroy(Cow $cow)
    {
        $cow->delete();
        return redirect()->back()->with('success', 'Cow deleted successfully!');
    }
}
