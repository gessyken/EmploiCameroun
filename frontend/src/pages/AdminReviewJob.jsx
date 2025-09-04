import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const AdminReviewJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/jobs/${id}/review`);
      setJob(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'offre:', error);
      setError('Erreur lors du chargement de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await api.post(`/admin/jobs/${id}/approve`);
      alert('Offre approuvée avec succès !');
      navigate('/admin/jobs/pending');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation de l\'offre');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Veuillez fournir une raison de rejet');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/admin/jobs/${id}/reject`, {
        rejection_reason: rejectionReason
      });
      alert('Offre rejetée avec succès !');
      navigate('/admin/jobs/pending');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet de l\'offre');
    } finally {
      setActionLoading(false);
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
          <p className="mt-4 text-gray-600">Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error || 'Offre non trouvée'}</p>
          <div className="space-x-4">
            <button
              onClick={fetchJob}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
            <Link
              to="/admin/jobs/pending"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 inline-flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/admin/jobs/pending"
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Révision d'offre</h1>
                <p className="mt-2 text-gray-600">Examiner et valider cette offre d'emploi</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center"
              >
                {actionLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                )}
                Approuver
              </button>
              <button
                onClick={() => setShowRejectForm(!showRejectForm)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 inline-flex items-center"
              >
                <XCircleIcon className="h-5 w-5 mr-2" />
                Rejeter
              </button>
            </div>
          </div>
        </div>

        {/* Rejection Form */}
        {showRejectForm && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Rejeter cette offre</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Raison du rejet *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Expliquez pourquoi cette offre est rejetée..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Rejet en cours...' : 'Confirmer le rejet'}
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Title and Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <ClockIcon className="h-4 w-4 mr-1" />
                En attente
              </span>
            </div>
          </div>

          {/* Company and Recruiter Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                Entreprise
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{job.company?.name || 'Non spécifié'}</p>
                <p className="text-gray-600 text-sm">{job.company?.description || 'Aucune description'}</p>
                {job.company?.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {job.company.website}
                  </a>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Recruteur
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{job.recruiter?.name || 'Non spécifié'}</p>
                <p className="text-gray-600 text-sm">{job.recruiter?.email || 'Email non disponible'}</p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{job.location || 'Lieu non spécifié'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              <span>{getJobTypeLabel(job.job_type)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              <span>{formatSalary(job.salary_min, job.salary_max)}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>Délai: {formatDate(job.deadline)}</span>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Description du poste
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Exigences</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Avantages</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.benefits}</p>
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Soumis le :</span> {formatDate(job.created_at)}
              </div>
              <div>
                <span className="font-medium">Dernière modification :</span> {formatDate(job.updated_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewJob;