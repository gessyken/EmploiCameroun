import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      setFavorites(prev => prev.filter(fav => fav.job_listing_id !== jobId));
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salaire non spécifié';
    if (!min) return `Jusqu'à ${max.toLocaleString()} FCFA`;
    if (!max) return `À partir de ${min.toLocaleString()} FCFA`;
    return `${min.toLocaleString()} - ${max.toLocaleString()} FCFA`;
  };

  const getJobTypeLabel = (type) => {
    const types = {
      'full_time': 'Temps plein',
      'part_time': 'Temps partiel',
      'contract': 'Contrat',
      'internship': 'Stage'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Mes Favoris</h2>
            <span className="badge bg-primary">{favorites.length} offres</span>
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-heart fa-3x text-muted mb-3"></i>
          <h4>Aucun favori</h4>
          <p className="text-muted">Vous n'avez pas encore ajouté d'offres à vos favoris</p>
          <Link to="/jobs" className="btn btn-primary">
            Voir les offres d'emploi
          </Link>
        </div>
      ) : (
        <div className="row">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="col-lg-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{favorite.jobListing.title}</h5>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFavorite(favorite.job_listing_id)}
                      title="Retirer des favoris"
                    >
                      <i className="fas fa-heart-broken"></i>
                    </button>
                  </div>
                  
                  <p className="card-text text-muted mb-2">
                    <i className="fas fa-building me-1"></i>
                    {favorite.jobListing.company?.name}
                  </p>
                  
                  <p className="card-text text-muted mb-2">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    {favorite.jobListing.location}
                  </p>
                  
                  <p className="card-text text-muted mb-2">
                    <i className="fas fa-money-bill-wave me-1"></i>
                    {formatSalary(favorite.jobListing.salary_min, favorite.jobListing.salary_max)}
                  </p>
                  
                  <p className="card-text text-muted mb-3">
                    <i className="fas fa-clock me-1"></i>
                    {getJobTypeLabel(favorite.jobListing.job_type)}
                  </p>
                  
                  <p className="card-text text-muted mb-3">
                    <i className="fas fa-calendar me-1"></i>
                    Clôture: {new Date(favorite.jobListing.deadline).toLocaleDateString('fr-FR')}
                  </p>
                  
                  <p className="card-text">
                    {favorite.jobListing.description.substring(0, 150)}...
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      <i className="fas fa-eye me-1"></i>
                      {favorite.jobListing.views_count} vues
                    </small>
                    <div className="d-flex gap-2">
                      <Link 
                        to={`/jobs/${favorite.jobListing.id}`} 
                        className="btn btn-primary btn-sm"
                      >
                        Voir détails
                      </Link>
                      <Link 
                        to={`/jobs/${favorite.jobListing.id}/apply`} 
                        className="btn btn-success btn-sm"
                      >
                        Postuler
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
