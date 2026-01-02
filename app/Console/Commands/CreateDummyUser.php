<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateDummyUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-dummy-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a dummy user for testing purposes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        $this->info('Dummy user created successfully!');
        $this->info('Email: test@example.com');
        $this->info('Password: password');
        
        return 0;
    }
}
