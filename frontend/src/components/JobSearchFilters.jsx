import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../api';

const JobSearchFilters = ({ onFiltersChange, filters }) => {
  const [skills, setSkills] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
    fetchCompanies();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/search/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/search/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSkillToggle = (skillId) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skillId)
      ? currentSkills.filter(id => id !== skillId)
      : [...currentSkills, skillId];
    
    handleFilterChange('skills', newSkills);
  };

  const clearFilters = () => {
    onFiltersChange({
      title: '',
      location: '',
      job_type: '',
      salary_min: '',
      salary_max: '',
      skills: []
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filtres de recherche</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Effacer tout
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Titre du poste */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre du poste
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.title || ''}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              placeholder="Ex: Développeur, Marketing..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Localisation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localisation
          </label>
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            placeholder="Ex: Yaoundé, Douala..."
            className="input-field"
          />
        </div>

        {/* Type d'emploi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'emploi
          </label>
          <select
            value={filters.job_type || ''}
            onChange={(e) => handleFilterChange('job_type', e.target.value)}
            className="input-field"
          >
            <option value="">Tous les types</option>
            <option value="full_time">Temps plein</option>
            <option value="part_time">Temps partiel</option>
            <option value="contract">Contrat</option>
            <option value="temporary">Temporaire</option>
            <option value="internship">Stage</option>
          </select>
        </div>

        {/* Salaire */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire min (FCFA)
            </label>
            <input
              type="number"
              value={filters.salary_min || ''}
              onChange={(e) => handleFilterChange('salary_min', e.target.value)}
              placeholder="Ex: 100000"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire max (FCFA)
            </label>
            <input
              type="number"
              value={filters.salary_max || ''}
              onChange={(e) => handleFilterChange('salary_max', e.target.value)}
              placeholder="Ex: 500000"
              className="input-field"
            />
          </div>
        </div>

        {/* Compétences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Compétences
          </label>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {skills.map((skill) => (
              <label
                key={skill.id}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={(filters.skills || []).includes(skill.id)}
                  onChange={() => handleSkillToggle(skill.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{skill.name}</span>
                <span className="text-xs text-gray-500 capitalize">({skill.category})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Entreprises */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise
          </label>
          <select
            value={filters.company || ''}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="input-field"
          >
            <option value="">Toutes les entreprises</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default JobSearchFilters;
