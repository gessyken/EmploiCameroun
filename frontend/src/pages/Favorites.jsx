import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import api from '../api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/candidate/favorites');
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (jobId) => {
    try {
      await api.delete(`/candidate/favorites/${jobId}`);
      setFavorites(favorites.filter(fav => fav.job_listing_id !== jobId));
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
          <p className="text-gray-600 mt-2">
            {favorites.length} offre{favorites.length > 1 ? 's' : ''} sauvegardée{favorites.length > 1 ? 's' : ''}
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="card group hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-lg">
                        {favorite.job_listing?.company?.name?.charAt(0) || 'E'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        <Link to={`/jobs/${favorite.job_listing?.id}`} className="hover:underline">
                          {favorite.job_listing?.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-600">{favorite.job_listing?.company?.name}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFavorite(favorite.job_listing_id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                    title="Retirer des favoris"
                  >
                    <HeartSolidIcon className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {favorite.job_listing?.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">📍</span>
                    <span>{favorite.job_listing?.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-2">💰</span>
                    <span>
                      {favorite.job_listing?.salary_min && favorite.job_listing?.salary_max
                        ? `${favorite.job_listing.salary_min.toLocaleString()} - ${favorite.job_listing.salary_max.toLocaleString()} FCFA`
                        : 'Salaire non spécifié'
                      }
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Link
                    to={`/jobs/${favorite.job_listing?.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Voir les détails
                  </Link>
                  <Link
                    to={`/jobs/${favorite.job_listing?.id}/apply`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Postuler
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HeartIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun favori pour le moment
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez à sauvegarder des offres qui vous intéressent en cliquant sur l'icône cœur.
            </p>
            <Link
              to="/jobs"
              className="btn-primary"
            >
              Voir les offres d'emploi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;