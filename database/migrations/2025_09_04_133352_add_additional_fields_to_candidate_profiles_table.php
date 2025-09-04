<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('candidate_profiles', function (Blueprint $table) {
            $table->string('phone_number')->nullable()->after('user_id');
            $table->text('address')->nullable()->after('phone_number');
            $table->date('date_of_birth')->nullable()->after('address');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('date_of_birth');
            $table->text('bio')->nullable()->after('gender');
            $table->string('linkedin_url')->nullable()->after('bio');
            $table->string('github_url')->nullable()->after('linkedin_url');
            $table->string('portfolio_url')->nullable()->after('github_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('candidate_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'phone_number',
                'address',
                'date_of_birth',
                'gender',
                'bio',
                'linkedin_url',
                'github_url',
                'portfolio_url',
            ]);
        });
    }
};