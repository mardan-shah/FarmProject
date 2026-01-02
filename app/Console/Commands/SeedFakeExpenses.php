<?php

namespace App\Console\Commands;

use App\Models\Expense;
use App\Models\User;
use Illuminate\Console\Command;
use Carbon\Carbon;

class SeedFakeExpenses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:seed-fake-expenses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the expenses table with 100 fake expense records';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::where('email', 'test@example.com')->first();
        
        if (!$user) {
            $this->error('Test user not found. Please run php artisan app:create-dummy-user first.');
            return 1;
        }

        $expenseTypes = ['petrol', 'electricity', 'employee_pay', 'farm'];
        
        $petrolNames = ['Fuel for Tractor', 'Car Fuel', 'Generator Fuel', 'Motorbike Fuel', 'Diesel Purchase'];
        $electricityNames = ['Monthly Bill', 'Maintenance Fee', 'Connection Fee', 'Peak Hour Charges', 'Standby Charges'];
        $employeeNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown', 'Emily Davis', 'Chris Wilson', 'Lisa Anderson'];
        $farmNames = ['Animal Feed', 'Medicine', 'Fertilizer', 'Seeds', 'Pesticides', 'Equipment Repair', 'Water Bill', 'Veterinary Services'];
        
        $descriptions = [
            'Monthly expense for farm operations',
            'Emergency purchase',
            'Regular maintenance cost',
            'Seasonal requirement',
            'Operational expense',
            'Infrastructure cost',
            'Supply purchase',
            'Service charge',
            'Utility payment',
            'Equipment cost'
        ];

        $expenses = [];
        
        for ($i = 0; $i < 100; $i++) {
            $expenseType = $expenseTypes[array_rand($expenseTypes)];
            $date = Carbon::now()->subDays(rand(0, 365))->format('Y-m-d');
            
            $expenseName = '';
            switch ($expenseType) {
                case 'petrol':
                    $expenseName = $petrolNames[array_rand($petrolNames)];
                    break;
                case 'electricity':
                    $expenseName = $electricityNames[array_rand($electricityNames)];
                    break;
                case 'employee_pay':
                    $expenseName = $employeeNames[array_rand($employeeNames)];
                    break;
                case 'farm':
                    $expenseName = $farmNames[array_rand($farmNames)];
                    break;
            }
            
            $expenses[] = [
                'user_id' => $user->id,
                'expense_date' => $date,
                'expense_type' => $expenseType,
                'expense_name' => $expenseName,
                'amount' => round(rand(500, 50000) / 100, 2), // Random amount between 5.00 and 500.00
                'description' => $descriptions[array_rand($descriptions)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Clear existing expenses for this user
        Expense::where('user_id', $user->id)->delete();
        
        // Insert new expenses
        Expense::insert($expenses);
        
        $this->info('Successfully created 100 fake expenses!');
        $this->info('Expenses distributed across all types:');
        $this->info('- Petrol: ' . Expense::where('user_id', $user->id)->where('expense_type', 'petrol')->count() . ' records');
        $this->info('- Electricity: ' . Expense::where('user_id', $user->id)->where('expense_type', 'electricity')->count() . ' records');
        $this->info('- Employee Pay: ' . Expense::where('user_id', $user->id)->where('expense_type', 'employee_pay')->count() . ' records');
        $this->info('- Farm: ' . Expense::where('user_id', $user->id)->where('expense_type', 'farm')->count() . ' records');
        
        return 0;
    }
}
