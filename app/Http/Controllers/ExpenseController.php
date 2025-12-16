<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $recentExpenses = Expense::with('user')
            ->where('user_id', auth()->id())
            ->orderBy('expense_date', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Expenses', [
            'recentExpenses' => $recentExpenses,
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Expense store method called');
        \Log::info('Request data:', $request->all());
        
        // Add expense_type if missing (temporary fix)
        $requestData = $request->all();
        $activeTab = $requestData['activeTab'] ?? null;
        
        if (isset($requestData['expenses']) && is_array($requestData['expenses'])) {
            foreach ($requestData['expenses'] as &$expense) {
                if (!isset($expense['expense_type'])) {
                    // Use activeTab to determine the correct expense_type
                    if ($activeTab) {
                        $expense['expense_type'] = $activeTab === 'employee' ? 'employee_pay' : $activeTab;
                    } else {
                        // Fallback logic if activeTab is not available
                        if (isset($expense['expenseName'])) {
                            $expense['expense_type'] = 'electricity';
                        } else {
                            $expense['expense_type'] = 'petrol';
                        }
                    }
                }
                // Copy expenseName to expense_name if present
                if (isset($expense['expenseName']) && !isset($expense['expense_name'])) {
                    $expense['expense_name'] = $expense['expenseName'];
                }
            }
            $request->merge($requestData);
        }
        
        $validated = $request->validate([
            'expenses' => 'required|array|min:1',
            'expenses.*.expense_date' => 'required|date|before_or_equal:today',
            'expenses.*.expense_type' => 'required|in:petrol,electricity,employee_pay,farm',
            'expenses.*.expense_name' => 'nullable|string|max:255',
            'expenses.*.amount' => 'required|numeric|min:0|max:100000',
            'expenses.*.description' => 'nullable|string|max:1000',
        ]);

        \Log::info('Received expenses data:', $validated);

        $expenses = collect($validated['expenses'])->map(function ($expense) {
            return array_merge($expense, ['user_id' => auth()->id()]);
        });

        \Log::info('Final expenses to insert:', $expenses->toArray());

        Expense::insert($expenses->toArray());

        return redirect()->back()->with('success', 'Expenses saved successfully!');
    }

    public function destroy(Expense $expense)
    {
        if ($expense->user_id !== auth()->id()) {
            abort(403);
        }

        $expense->delete();

        return redirect()->back()->with('success', 'Expense deleted successfully!');
    }

    public function report($period)
    {
        // For future PDF report generation
        return response()->json(['message' => 'Report generation coming soon']);
    }
}
