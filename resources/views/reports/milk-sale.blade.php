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
            <strong>{{ number_format($totalMilk, 2) }} KG</strong>
            <span>Total Milk Sold</span>
        </div>
        <div class="summary-item">
            <strong>Rs.{{ number_format($totalAmount, 2) }}</strong>
            <span>Total Revenue</span>
        </div>
        <div class="summary-item">
            <strong>Rs.{{ number_format($averagePrice, 2) }}</strong>
            <span>Average Price per KG</span>
        </div>
        <div class="summary-item">
            <strong>{{ $totalSales }}</strong>
            <span>Total Sales</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Milk (KG)</th>
                <th>Sale Amount (Rs.)</th>
                <th>Price per KG (Rs.)</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sales as $sale)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($sale->sale_date)->format('M d, Y') }}</td>
                    <td>{{ number_format($sale->milk_kg, 2) }}</td>
                    <td class="amount">Rs.{{ number_format($sale->sale_amount, 2) }}</td>
                    <td class="amount">Rs.{{ number_format($sale->milk_kg > 0 ? $sale->sale_amount / $sale->milk_kg : 0, 2) }}</td>
                    <td>{{ $sale->notes ?: '-' }}</td>
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
