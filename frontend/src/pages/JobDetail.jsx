import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      setError('Erreur lors du chargement de l\'offre');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
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

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Offre non trouvée</h1>
          <p className="text-gray-600 mb-6">{error || 'Cette offre n\'existe pas ou a été supprimée.'}</p>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-xl text-gray-600">{job.company?.name}</p>
                </div>
              </div>
              <Link
                to={`/jobs/${job.id}/apply`}
                className="btn-primary text-lg px-6 py-3"
              >
                Postuler maintenant
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-3" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-3" />
                  <span className="capitalize">{job.job_type}</span>
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
                  <CalendarIcon className="h-5 w-5 mr-3" />
                  <span>Publié le {new Date(job.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description du poste</h2>
              <div className="text-gray-700 whitespace-pre-wrap">{job.description}</div>
              
              {job.requirements && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Exigences</h2>
                  <div className="text-gray-700 whitespace-pre-wrap">{job.requirements}</div>
                </>
              )}

              {job.benefits && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Avantages</h2>
                  <div className="text-gray-700 whitespace-pre-wrap">{job.benefits}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;