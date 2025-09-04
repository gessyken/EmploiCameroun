import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const AdminPendingJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/jobs/pending');
      setJobs(response.data.data || response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      setError('Erreur lors du chargement des offres en attente');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      setActionLoading(jobId);
      await api.post(`/admin/jobs/${jobId}/approve`);
      await fetchPendingJobs(); // Recharger la liste
      alert('Offre approuvée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation de l\'offre');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (jobId) => {
    const reason = prompt('Raison du rejet :');
    if (!reason) return;

    try {
      setActionLoading(jobId);
      await api.post(`/admin/jobs/${jobId}/reject`, {
        rejection_reason: reason
      });
      await fetchPendingJobs(); // Recharger la liste
      alert('Offre rejetée avec succès !');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet de l\'offre');
    } finally {
      setActionLoading(null);
    }
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

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Non spécifié';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} FCFA`;
    if (min) return `À partir de ${min.toLocaleString()} FCFA`;
    if (max) return `Jusqu'à ${max.toLocaleString()} FCFA`;
    return 'Non spécifié';
  };

  const getJobTypeLabel = (type) => {
    const types = {
      full_time: 'Temps plein',
      part_time: 'Temps partiel',
      contract: 'Contrat',
      internship: 'Stage',
      freelance: 'Freelance'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des offres en attente...</p>
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
            onClick={fetchPendingJobs}
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Offres en attente</h1>
              <p className="mt-2 text-gray-600">
                {jobs.length} offre{jobs.length !== 1 ? 's' : ''} en attente de validation
              </p>
            </div>
            <Link
              to="/admin/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 inline-flex items-center"
            >
              <ClockIcon className="h-5 w-5 mr-2" />
              Retour au dashboard
            </Link>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune offre en attente
            </h3>
            <p className="text-gray-600 mb-6">
              Toutes les offres ont été traitées.
            </p>
            <Link
              to="/admin/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              Retour au dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {job.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        En attente
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                        <span>{job.company?.name || 'Entreprise non spécifiée'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <UserIcon className="h-5 w-5 mr-2" />
                        <span>{job.recruiter?.name || 'Recruteur non spécifié'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        <span>{job.location || 'Lieu non spécifié'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BriefcaseIcon className="h-5 w-5 mr-2" />
                        <span>{getJobTypeLabel(job.job_type)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                        <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        <span>Délai: {formatDate(job.deadline)}</span>
                      </div>
                    </div>

                    {job.description && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Description :
                        </h4>
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {job.description}
                        </p>
                      </div>
                    )}

                    {job.requirements && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Exigences :
                        </h4>
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {job.requirements}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Soumis le {formatDate(job.created_at)}
                      </div>
                      <div className="flex space-x-3">
                        <Link
                          to={`/admin/jobs/${job.id}/review`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Examiner
                        </Link>
                        <button
                          onClick={() => handleApprove(job.id)}
                          disabled={actionLoading === job.id}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center"
                        >
                          {actionLoading === job.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                          )}
                          Approuver
                        </button>
                        <button
                          onClick={() => handleReject(job.id)}
                          disabled={actionLoading === job.id}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center"
                        >
                          {actionLoading === job.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <XCircleIcon className="h-4 w-4 mr-2" />
                          )}
                          Rejeter
                        </button>
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

export default AdminPendingJobs;