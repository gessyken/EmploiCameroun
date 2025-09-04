import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const CandidateProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    address: '',
    city: '',
    resume: null,
    experiences: [],
    educations: [],
    skill_ids: []
  });

  useEffect(() => {
    fetchProfile();
    fetchSkills();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/candidate/profile');
      const profileData = response.data;
      setProfile(profileData);
      setFormData({
        bio: profileData.bio || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        city: profileData.city || '',
        resume: null,
        experiences: profileData.experiences || [],
        educations: profileData.educations || [],
        skill_ids: profileData.skills?.map(skill => skill.id) || []
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await api.get('/search/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Préparer les données pour l'envoi
      const dataToSend = {
        bio: formData.bio,
        phone_number: formData.phone,
        address: formData.address,
        city: formData.city,
        experiences: formData.experiences,
        educations: formData.educations,
        skills: formData.skill_ids.map(id => ({ id, level: 'intermediate' }))
      };

      // Si il y a un CV, utiliser FormData
      if (formData.resume) {
        const formDataToSend = new FormData();
        Object.keys(dataToSend).forEach(key => {
          if (Array.isArray(dataToSend[key])) {
            formDataToSend.append(key, JSON.stringify(dataToSend[key]));
          } else {
            formDataToSend.append(key, dataToSend[key]);
          }
        });
        formDataToSend.append('resume', formData.resume);

        if (profile) {
          await api.put('/candidate/profile', formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          await api.post('/candidate/profile', formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Sinon, envoyer en JSON
        if (profile) {
          await api.put('/candidate/profile', dataToSend);
        } else {
          await api.post('/candidate/profile', dataToSend);
        }
      }
      
      fetchProfile();
      alert('Profil sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, {
        company: '',
        position: '',
        start_date: '',
        end_date: '',
        description: '',
        is_current: false
      }]
    });
  };

  const updateExperience = (index, field, value) => {
    const newExperiences = [...formData.experiences];
    newExperiences[index][field] = value;
    setFormData({ ...formData, experiences: newExperiences });
  };

  const removeExperience = (index) => {
    const newExperiences = formData.experiences.filter((_, i) => i !== index);
    setFormData({ ...formData, experiences: newExperiences });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      educations: [...formData.educations, {
        institution: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        description: ''
      }]
    });
  };

  const updateEducation = (index, field, value) => {
    const newEducations = [...formData.educations];
    newEducations[index][field] = value;
    setFormData({ ...formData, educations: newEducations });
  };

  const removeEducation = (index) => {
    const newEducations = formData.educations.filter((_, i) => i !== index);
    setFormData({ ...formData, educations: newEducations });
  };

  const handleSkillToggle = (skillId) => {
    const newSkillIds = formData.skill_ids.includes(skillId)
      ? formData.skill_ids.filter(id => id !== skillId)
      : [...formData.skill_ids, skillId];
    setFormData({ ...formData, skill_ids: newSkillIds });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">
            Complétez votre profil pour améliorer vos chances d'être recruté
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations personnelles */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <UserIcon className="h-6 w-6 mr-2" />
              Informations personnelles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input-field"
                  placeholder="+237 6XX XX XX XX"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="input-field"
                  placeholder="Yaoundé, Douala..."
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="input-field"
                rows={3}
                placeholder="Votre adresse complète"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                À propos de moi
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="input-field"
                rows={4}
                placeholder="Parlez-nous de vous, de vos objectifs professionnels..."
              />
            </div>
          </div>

          {/* Compétences */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Compétences
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {skills.map((skill) => (
                <label
                  key={skill.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={formData.skill_ids.includes(skill.id)}
                    onChange={() => handleSkillToggle(skill.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{skill.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Expériences professionnelles */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BriefcaseIcon className="h-6 w-6 mr-2" />
                Expériences professionnelles
              </h2>
              <button
                type="button"
                onClick={addExperience}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Ajouter
              </button>
            </div>
            
            {formData.experiences.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">Expérience {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="input-field"
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poste
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="input-field"
                      placeholder="Titre du poste"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={exp.start_date}
                      onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={exp.end_date}
                      onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                      className="input-field"
                      disabled={exp.is_current}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exp.is_current}
                      onChange={(e) => updateExperience(index, 'is_current', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm text-gray-700">Poste actuel</span>
                  </label>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Décrivez vos responsabilités et réalisations..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Formation */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <AcademicCapIcon className="h-6 w-6 mr-2" />
                Formation
              </h2>
              <button
                type="button"
                onClick={addEducation}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Ajouter
              </button>
            </div>
            
            {formData.educations.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">Formation {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      className="input-field"
                      placeholder="Nom de l'institution"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diplôme
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="input-field"
                      placeholder="Master, Licence, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Domaine d'étude
                    </label>
                    <input
                      type="text"
                      value={edu.field_of_study}
                      onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                      className="input-field"
                      placeholder="Informatique, Marketing, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Année d'obtention
                    </label>
                    <input
                      type="date"
                      value={edu.end_date}
                      onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    className="input-field"
                    rows={2}
                    placeholder="Détails supplémentaires sur votre formation..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CV */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DocumentArrowUpIcon className="h-6 w-6 mr-2" />
              CV / Résumé
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Télécharger votre CV
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formats acceptés: PDF, DOC, DOCX (max 5MB)
              </p>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sauvegarde...
                </div>
              ) : (
                'Sauvegarder le profil'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfile;
