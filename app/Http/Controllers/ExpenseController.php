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
        $user = auth()->user();
        $endDate = now();
        $startDate = $this->getStartDateByPeriod($period, $endDate);
        
        $expenses = Expense::where('user_id', $user->id)
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->orderBy('expense_date', 'asc')
            ->get();

        if ($expenses->isEmpty()) {
            return redirect()->back()->with('error', 'No expense data found for the selected period.');
        }

        $reportData = [
            'period' => $period,
            'startDate' => $startDate->format('M d, Y'),
            'endDate' => $endDate->format('M d, Y'),
            'expenses' => $expenses,
            'totalAmount' => $expenses->sum('amount'),
            'expensesByType' => $expenses->groupBy('expense_type'),
            'totalExpenses' => $expenses->count(),
            'user' => $user,
            'reportTitle' => $this->getReportTitle($period),
        ];

        $pdf = \PDF::loadView('reports.expenses', $reportData);
        
        $filename = 'expenses-' . $period . '-' . now()->format('Y-m-d') . '.pdf';
        
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
                return 'Weekly Expenses Report';
            case 'monthly':
                return 'Monthly Expenses Report';
            case '3-month':
                return '3-Month Expenses Report';
            case '6-month':
                return '6-Month Expenses Report';
            case '12-month':
                return '12-Month Expenses Report';
            default:
                return 'Expenses Report';
        }
    }
}
