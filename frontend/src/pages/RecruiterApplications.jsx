import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  useEffect(() => {
    const jobId = searchParams.get('job');
    if (jobId) {
      setSelectedJob(jobId);
    }
  }, [searchParams]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/recruiter/jobs');
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      let url = '/recruiter/applications';
      const params = new URLSearchParams();
      
      if (selectedJob) params.append('job_id', selectedJob);
      if (selectedStatus) params.append('status', selectedStatus);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedJob, selectedStatus]);

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await api.put(`/recruiter/applications/${applicationId}`, { status });
      fetchApplications();
      alert(`Candidature ${status === 'accepted' ? 'acceptée' : 'rejetée'} avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la candidature');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Rejetée'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Candidatures</h1>
          <p className="text-gray-600 mt-2">
            Consultez et gérez les candidatures reçues pour vos offres d'emploi
          </p>
        </div>

        {/* Filtres */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par offre
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="input-field"
              >
                <option value="">Toutes les offres</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par statut
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="accepted">Acceptées</option>
                <option value="rejected">Rejetées</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedJob('');
                  setSelectedStatus('');
                }}
                className="btn-secondary w-full"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste des candidatures */}
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.candidate?.name}
                        </h3>
                        <span className={`badge ${getStatusColor(application.status)}`}>
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Candidature pour: <span className="font-medium">{application.job?.title}</span>
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(application.created_at)}</span>
                        </div>
                        {application.candidate?.email && (
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            <span>{application.candidate.email}</span>
                          </div>
                        )}
                        {application.candidate?.phone && (
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-1" />
                            <span>{application.candidate.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/recruiter/applications/${application.id}`}
                      className="btn-secondary flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Voir détails
                    </Link>
                    {application.status === 'pending' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'accepted')}
                          className="btn-success flex items-center"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Accepter
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                          className="btn-danger flex items-center"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Rejeter
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lettre de motivation */}
                {application.cover_letter && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Lettre de motivation</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {application.cover_letter}
                      </p>
                    </div>
                  </div>
                )}

                {/* Informations du candidat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {application.candidate?.bio && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">À propos</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {application.candidate.bio}
                      </p>
                    </div>
                  )}

                  {application.candidate?.address && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Adresse</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{application.candidate.address}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Compétences */}
                {application.candidate?.skills && application.candidate.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Compétences</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-blue-100 text-blue-800"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  {application.resume && (
                    <a
                      href={`${import.meta.env.VITE_API_URL}/storage/${application.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <DocumentTextIcon className="h-4 w-4 mr-1" />
                      CV
                    </a>
                  )}
                  
                  {application.documents && application.documents.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {application.documents.length} document{application.documents.length > 1 ? 's' : ''} supplémentaire{application.documents.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune candidature trouvée
            </h3>
            <p className="text-gray-500 mb-6">
              {selectedJob || selectedStatus 
                ? 'Aucune candidature ne correspond aux filtres sélectionnés.'
                : 'Vous n\'avez pas encore reçu de candidatures pour vos offres d\'emploi.'
              }
            </p>
            {(selectedJob || selectedStatus) && (
              <button
                onClick={() => {
                  setSelectedJob('');
                  setSelectedStatus('');
                }}
                className="btn-primary"
              >
                Voir toutes les candidatures
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplications;