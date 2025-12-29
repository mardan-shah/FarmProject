<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $reportTitle }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #2c3e50;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .summary-item {
            text-align: center;
        }
        .summary-item strong {
            display: block;
            font-size: 18px;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .summary-item span {
            color: #666;
            font-size: 11px;
        }
        .expense-breakdown {
            margin-bottom: 30px;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .expense-breakdown h3 {
            margin: 0 0 15px 0;
            color: #2c3e50;
            font-size: 16px;
        }
        .expense-type {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        .expense-type:last-child {
            border-bottom: none;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            color: #2c3e50;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .amount {
            text-align: right;
            font-weight: bold;
        }
        .expense-type-badge {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            color: white;
        }
        .petrol { background-color: #3498db; }
        .electricity { background-color: #f39c12; }
        .employee_pay { background-color: #27ae60; }
        .farm { background-color: #9b59b6; }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 10px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $reportTitle }}</h1>
        <p>{{ $startDate }} - {{ $endDate }}</p>
        <p>Generated for: {{ $user->name }}</p>
        <p>Generated on: {{ now()->format('M d, Y H:i') }}</p>
    </div>

    <div class="summary">
        <div class="summary-item">
            <strong>Rs.{{ number_format($totalAmount, 2) }}</strong>
            <span>Total Expenses</span>
        </div>
        <div class="summary-item">
            <strong>{{ $totalExpenses }}</strong>
            <span>Total Expense Entries</span>
        </div>
        <div class="summary-item">
            <strong>Rs.{{ number_format($totalAmount / max($totalExpenses, 1), 2) }}</strong>
            <span>Average Expense</span>
        </div>
    </div>

    @if($expensesByType->count() > 0)
    <div class="expense-breakdown">
        <h3>Expenses by Type</h3>
        @foreach($expensesByType as $type => $expenses)
            <div class="expense-type">
                <span>
                    <span class="expense-type-badge {{ $type }}">
                        {{ ucfirst($type === 'employee_pay' ? 'Employee Pay' : $type) }}
                    </span>
                </span>
                <span>Rs.{{ number_format($expenses->sum('amount'), 2) }} ({{ $expenses->count() }} entries)</span>
            </div>
        @endforeach
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Expense Name</th>
                <th>Amount (Rs.)</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            @foreach($expenses as $expense)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($expense->expense_date)->format('M d, Y') }}</td>
                    <td>
                        <span class="expense-type-badge {{ $expense->expense_type }}">
                            {{ ucfirst($expense->expense_type === 'employee_pay' ? 'Employee Pay' : $expense->expense_type) }}
                        </span>
                    </td>
                    <td>{{ $expense->expense_name ?: '-' }}</td>
                    <td class="amount">Rs.{{ number_format($expense->amount, 2) }}</td>
                    <td>{{ $expense->description ?: '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>This report was generated automatically from Mehmood Cattle and Dairy Farm Management System</p>
        <p>Page 1 of 1</p>
    </div>
</body>
</html>
