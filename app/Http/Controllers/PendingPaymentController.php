<?php

namespace App\Http\Controllers;

use App\Models\PendingPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PendingPaymentController extends Controller
{
    public function index()
    {
        $pendingPayments = PendingPayment::with('user')
            ->where('user_id', auth()->id())
            ->orderBy('payment_date', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('PendingPayments', [
            'pendingPayments' => $pendingPayments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'payment_date' => 'required|date|before_or_equal:today',
            'quantity' => 'required|numeric|min:0|max:10000',
            'amount' => 'required|numeric|min:0|max:100000',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['user_id'] = auth()->id();

        PendingPayment::create($validated);

        return redirect()->back()->with('success', 'Pending payment recorded successfully!');
    }

    public function destroy($id)
    {
        $pendingPayment = PendingPayment::where('user_id', auth()->id())->findOrFail($id);
        $pendingPayment->delete();

        return redirect()->back()->with('success', 'Pending payment deleted successfully!');
    }
}
