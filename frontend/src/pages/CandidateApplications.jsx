import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  EyeIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const CandidateApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/candidate/applications');
      // S'assurer que applications est un tableau
      const applicationsData = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error);
      setError('Erreur lors du chargement des candidatures');
      setApplications([]); // Initialiser avec un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <PendingIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Rejetée';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnue';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos candidatures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchApplications}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Candidatures</h1>
          <p className="mt-2 text-gray-600">
            Consultez l'état de vos candidatures et suivez leur progression
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune candidature
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore postulé à des offres d'emploi.
            </p>
            <a
              href="/jobs"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Voir les offres d'emploi
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {application.job?.title || 'Titre non disponible'}
                      </h3>
                      <span
                        className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}
                        <span className="ml-1">
                          {getStatusText(application.status)}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                      <span className="mr-6">
                        {application.job?.company?.name || 'Entreprise non spécifiée'}
                      </span>
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <span className="mr-6">
                        {application.job?.location || 'Lieu non spécifié'}
                      </span>
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      <span>
                        Candidaté le {formatDate(application.created_at)}
                      </span>
                    </div>

                    {application.cover_letter && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Lettre de motivation :
                        </h4>
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                          {application.cover_letter}
                        </p>
                      </div>
                    )}

                    {application.job?.description && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Description du poste :
                        </h4>
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {application.job.description}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>
                          Délai de candidature :{' '}
                          {application.job?.deadline
                            ? formatDate(application.job.deadline)
                            : 'Non spécifié'}
                        </span>
                      </div>

                      <div className="flex space-x-3">
                        {application.resume_path && (
                          <a
                            href={`/storage/${application.resume_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Voir CV
                          </a>
                        )}
                        <a
                          href={`/jobs/${application.job?.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Voir l'offre
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateApplications;