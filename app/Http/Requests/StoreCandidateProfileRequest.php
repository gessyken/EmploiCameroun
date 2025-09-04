<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'bio' => 'nullable|string|max:1000',
            'linkedin_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // 5MB max
            'skills' => 'nullable|array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'experiences' => 'nullable|array',
            'experiences.*.company_name' => 'required|string|max:255',
            'experiences.*.position' => 'required|string|max:255',
            'experiences.*.description' => 'nullable|string|max:1000',
            'experiences.*.start_date' => 'required|date',
            'experiences.*.end_date' => 'nullable|date|after:experiences.*.start_date',
            'experiences.*.is_current' => 'nullable|boolean',
            'educations' => 'nullable|array',
            'educations.*.institution' => 'required|string|max:255',
            'educations.*.degree' => 'required|string|max:255',
            'educations.*.field_of_study' => 'nullable|string|max:255',
            'educations.*.start_date' => 'required|date',
            'educations.*.end_date' => 'nullable|date|after:educations.*.start_date',
            'educations.*.gpa' => 'nullable|numeric|min:0|max:4',
            'educations.*.description' => 'nullable|string|max:1000',
        ];
    }
}
