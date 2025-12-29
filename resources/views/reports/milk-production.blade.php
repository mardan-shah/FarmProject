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
            <span>Total Milk Production</span>
        </div>
        <div class="summary-item">
            <strong>{{ number_format($averageMilk, 2) }} KG</strong>
            <span>Average Daily Production</span>
        </div>
        <div class="summary-item">
            <strong>{{ $totalDays }}</strong>
            <span>Total Production Days</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Milk Production (KG)</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($productions as $production)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($production->production_date)->format('M d, Y') }}</td>
                    <td>{{ number_format($production->milk_kg, 2) }}</td>
                    <td>{{ $production->notes ?: '-' }}</td>
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
