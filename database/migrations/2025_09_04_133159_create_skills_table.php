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
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable(); // technical, soft, language, etc.
            $table->timestamps();
        });

        Schema::create('candidate_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_profile_id')->constrained()->onDelete('cascade');
            $table->foreignId('skill_id')->constrained()->onDelete('cascade');
            $table->enum('level', ['beginner', 'intermediate', 'advanced', 'expert'])->default('intermediate');
            $table->timestamps();
            
            $table->unique(['candidate_profile_id', 'skill_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_skills');
        Schema::dropIfExists('skills');
    }
};