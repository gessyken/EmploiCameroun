import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setRecentJobs(response.data.recentJobs);
      setRecentApplications(response.data.recentApplications);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
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
            onClick={fetchDashboardData}
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="mt-2 text-gray-600">
            Vue d'ensemble de la plateforme EmploiCameroun
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_users || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Entreprises</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_companies || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Offres d'emploi</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_jobs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En attente</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending_jobs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Candidatures</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total_applications || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/jobs/pending"
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 inline-flex items-center"
            >
              <ClockIcon className="h-5 w-5 mr-2" />
              Offres en attente ({stats.pending_jobs || 0})
            </Link>
            <Link
              to="/jobs"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              Voir toutes les offres
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Offres récentes</h3>
            </div>
            <div className="p-6">
              {recentJobs.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune offre récente</p>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company?.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(job.created_at)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            job.status
                          )}`}
                        >
                          {getStatusIcon(job.status)}
                          <span className="ml-1 capitalize">{job.status}</span>
                        </span>
                        <Link
                          to={`/admin/jobs/${job.id}/review`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Candidatures récentes</h3>
            </div>
            <div className="p-6">
              {recentApplications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune candidature récente</p>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {application.candidate?.name || 'Candidat anonyme'}
                        </h4>
                        <p className="text-sm text-gray-600">{application.jobListing?.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(application.created_at)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;