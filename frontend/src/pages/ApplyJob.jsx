import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: '',
    resume: null,
    additional_documents: []
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'offre:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('cover_letter', formData.cover_letter);
      
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }

      formData.additional_documents.forEach((doc, index) => {
        if (doc) {
          formDataToSend.append(`additional_documents[${index}]`, doc);
        }
      });

      await api.post(`/jobs/${id}/apply`, formDataToSend);
      alert('Candidature envoyée avec succès !');
      navigate('/candidate/applications');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la candidature:', error);
      alert('Erreur lors de l\'envoi de la candidature');
    } finally {
      setSubmitting(false);
    }
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      additional_documents: [...formData.additional_documents, null]
    });
  };

  const removeDocument = (index) => {
    const newDocs = formData.additional_documents.filter((_, i) => i !== index);
    setFormData({ ...formData, additional_documents: newDocs });
  };

  const updateDocument = (index, file) => {
    const newDocs = [...formData.additional_documents];
    newDocs[index] = file;
    setFormData({ ...formData, additional_documents: newDocs });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Offre non trouvée</h1>
          <p className="text-gray-600 mb-6">Cette offre n'existe pas ou a été supprimée.</p>
          <Link to="/jobs" className="btn-primary">
            Voir toutes les offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to={`/jobs/${id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Retour à l'offre
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations sur l'offre */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Détails de l'offre</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company?.name}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-3" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <CurrencyDollarIcon className="h-5 w-5 mr-3" />
                    <span>
                      {job.salary_min && job.salary_max
                        ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} FCFA`
                        : 'Salaire non spécifié'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-3" />
                    <span className="capitalize">{job.job_type}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {job.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de candidature */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Postuler à cette offre</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Lettre de motivation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lettre de motivation *
                  </label>
                  <textarea
                    value={formData.cover_letter}
                    onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
                    className="input-field"
                    rows={8}
                    placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Décrivez votre motivation, vos compétences pertinentes et ce que vous pouvez apporter à l'entreprise.
                  </p>
                </div>

                {/* CV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CV / Résumé *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés: PDF, DOC, DOCX (max 5MB)
                  </p>
                </div>

                {/* Documents supplémentaires */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Documents supplémentaires
                    </label>
                    <button
                      type="button"
                      onClick={addDocument}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Ajouter un document
                    </button>
                  </div>
                  
                  {formData.additional_documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => updateDocument(index, e.target.files[0])}
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Portefolio, certificats, lettres de recommandation, etc.
                  </p>
                </div>

                {/* Informations du candidat */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Informations du candidat</h3>
                  <div className="text-sm text-blue-800">
                    <p><strong>Nom:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      Assurez-vous que votre profil candidat est à jour pour une meilleure visibilité.
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Link
                    to={`/jobs/${id}`}
                    className="btn-secondary"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting || !formData.cover_letter || !formData.resume}
                    className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      'Envoyer ma candidature'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;