<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CartItem;
use Carbon\Carbon;

class CleanupAbandonedCarts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cart:cleanup {--hours=24 : Hours after which cart items are considered abandoned}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up abandoned cart items older than specified hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $hours = $this->option('hours');
        $cutoffTime = Carbon::now()->subHours($hours);

        // Find abandoned cart items (older than cutoff time)
        $abandonedItems = CartItem::where('created_at', '<', $cutoffTime)->get();

        $this->info("Found {$abandonedItems->count()} abandoned cart items older than {$hours} hours.");

        if ($abandonedItems->count() > 0) {
            // Delete abandoned cart items (no need to restore stock since we don't decrement on add)
            CartItem::where('created_at', '<', $cutoffTime)->delete();

            $this->info("Cleaned up {$abandonedItems->count()} abandoned cart items.");
        } else {
            $this->info("No abandoned cart items to clean up.");
        }

        return 0;
    }
}
