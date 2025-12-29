<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

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
        \Log::info('Request data: ' . json_encode($request->all()));
        
        try {
            $validated = $request->validate([
                'expenses' => 'required|array|min:1',
                'expenses.*.expense_date' => 'required|date|before_or_equal:today',
                'expenses.*.expense_type' => 'required|in:petrol,electricity,employee_pay,farm',
                'expenses.*.expense_name' => 'nullable|string|max:255',
                'expenses.*.amount' => 'required|numeric|min:0|max:100000',
                'expenses.*.description' => 'nullable|string|max:1000',
            ]);

            \Log::info('Validated data: ' . json_encode($validated));

            $expenses = collect($validated['expenses'])->map(function ($expense) {
                return array_merge($expense, ['user_id' => auth()->id()]);
            });

            \Log::info('Final expenses to insert: ' . json_encode($expenses->toArray()));

            Expense::insert($expenses->toArray());

            \Log::info('Expenses inserted successfully');

            return redirect()->back()->with('success', 'Expenses saved successfully!');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed: ' . json_encode($e->errors()));
            throw $e;
        } catch (\Exception $e) {
            \Log::error('General error: ' . $e->getMessage());
            throw $e;
        }
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
        
        \Log::info("Report period: $period");
        \Log::info("Date range: $startDate to $endDate");
        
        $expenses = Expense::where('user_id', $user->id)
            ->whereBetween('expense_date', [$startDate, $endDate])
            ->orderBy('expense_date', 'asc')
            ->get();

        \Log::info("Found {$expenses->count()} expenses for report");
        \Log::info("Expense types in report: " . $expenses->pluck('expense_type')->unique()->implode(', '));

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

        $pdf = Pdf::loadView('reports.expenses', $reportData);
        
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
