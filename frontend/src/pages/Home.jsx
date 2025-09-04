import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Home = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalCandidates: 0,
    recentJobs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsResponse, companiesResponse] = await Promise.all([
          api.get('/jobs?per_page=6'),
          api.get('/search/companies')
        ]);
        
        setStats({
          totalJobs: jobsResponse.data.total || 0,
          totalCompanies: companiesResponse.data.length || 0,
          totalCandidates: 0, // Cette donnée nécessiterait un endpoint spécifique
          recentJobs: jobsResponse.data.data || []
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
    <div>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Trouvez votre emploi idéal au Cameroun
              </h1>
              <p className="lead mb-4">
                La plateforme de référence pour l'emploi au Cameroun. 
                Connectez les meilleurs talents aux meilleures entreprises.
              </p>
              <div className="d-flex gap-3">
                <Link to="/jobs" className="btn btn-light btn-lg">
                  Voir les offres
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">
                  S'inscrire
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="fas fa-briefcase fa-10x opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <i className="fas fa-briefcase fa-3x text-primary mb-3"></i>
                  <h3 className="display-6 fw-bold text-primary">{stats.totalJobs}</h3>
                  <p className="text-muted">Offres d'emploi</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <i className="fas fa-building fa-3x text-success mb-3"></i>
                  <h3 className="display-6 fw-bold text-success">{stats.totalCompanies}</h3>
                  <p className="text-muted">Entreprises</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <i className="fas fa-users fa-3x text-info mb-3"></i>
                  <h3 className="display-6 fw-bold text-info">{stats.totalCandidates}</h3>
                  <p className="text-muted">Candidats</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="recent-jobs py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center mb-5">Dernières offres d'emploi</h2>
            </div>
          </div>
          <div className="row">
            {stats.recentJobs.map((job) => (
              <div key={job.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="card-text text-muted">{job.company?.name}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {job.location}
                      </small>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        {job.job_type}
                      </small>
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary">{job.status}</span>
                      <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm">
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              Voir toutes les offres
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-center mb-5">Pourquoi choisir EmploiCameroun ?</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="text-center">
                <i className="fas fa-search fa-3x text-primary mb-3"></i>
                <h4>Recherche intelligente</h4>
                <p className="text-muted">
                  Trouvez des offres qui correspondent parfaitement à votre profil grâce à notre algorithme de matching.
                </p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="text-center">
                <i className="fas fa-bell fa-3x text-success mb-3"></i>
                <h4>Alertes personnalisées</h4>
                <p className="text-muted">
                  Recevez des notifications en temps réel pour les nouvelles offres qui vous intéressent.
                </p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="text-center">
                <i className="fas fa-shield-alt fa-3x text-warning mb-3"></i>
                <h4>Offres vérifiées</h4>
                <p className="text-muted">
                  Toutes nos offres sont vérifiées par notre équipe pour garantir leur authenticité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;