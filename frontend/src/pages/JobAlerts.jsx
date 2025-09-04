import { useState, useEffect } from 'react';
import api from '../api';

const JobAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    job_type: '',
    keywords: [],
    excluded_keywords: []
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/candidate/job-alerts');
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeywordAdd = (type) => {
    const keyword = prompt('Entrez un mot-clé:');
    if (keyword) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], keyword]
      }));
    }
  };

  const handleKeywordRemove = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/candidate/job-alerts', formData);
      setFormData({
        title: '',
        location: '',
        job_type: '',
        keywords: [],
        excluded_keywords: []
      });
      setShowForm(false);
      fetchAlerts();
      alert('Alerte créée avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
      alert('Erreur lors de la création de l\'alerte');
    }
  };

  const toggleAlert = async (alertId) => {
    try {
      await api.post(`/candidate/job-alerts/${alertId}/toggle`);
      fetchAlerts();
    } catch (error) {
      console.error('Erreur lors de la modification de l\'alerte:', error);
    }
  };

  const deleteAlert = async (alertId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      try {
        await api.delete(`/candidate/job-alerts/${alertId}`);
        fetchAlerts();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'alerte:', error);
      }
    }
  };

  const testAlert = async (alertId) => {
    try {
      const response = await api.post(`/candidate/job-alerts/${alertId}/test`);
      alert(`Test effectué: ${response.data.matching_jobs_count} offres correspondantes trouvées`);
    } catch (error) {
      console.error('Erreur lors du test de l\'alerte:', error);
    }
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
            <h2>Mes Alertes d'Emploi</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Annuler' : 'Nouvelle alerte'}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>Créer une nouvelle alerte</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Titre du poste</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Ex: Développeur Laravel"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Localisation</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Ex: Yaoundé, Douala"
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Type d'emploi</label>
                      <select
                        className="form-select"
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleInputChange}
                      >
                        <option value="">Tous les types</option>
                        <option value="full_time">Temps plein</option>
                        <option value="part_time">Temps partiel</option>
                        <option value="contract">Contrat</option>
                        <option value="internship">Stage</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mots-clés à inclure</label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {formData.keywords.map((keyword, index) => (
                          <span key={index} className="badge bg-primary">
                            {keyword}
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-1"
                              onClick={() => handleKeywordRemove('keywords', index)}
                              style={{ fontSize: '0.7em' }}
                            ></button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleKeywordAdd('keywords')}
                      >
                        Ajouter un mot-clé
                      </button>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mots-clés à exclure</label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {formData.excluded_keywords.map((keyword, index) => (
                          <span key={index} className="badge bg-secondary">
                            {keyword}
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-1"
                              onClick={() => handleKeywordRemove('excluded_keywords', index)}
                              style={{ fontSize: '0.7em' }}
                            ></button>
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleKeywordAdd('excluded_keywords')}
                      >
                        Ajouter un mot-clé
                      </button>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      Créer l'alerte
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {alerts.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-bell fa-3x text-muted mb-3"></i>
          <h4>Aucune alerte</h4>
          <p className="text-muted">Vous n'avez pas encore créé d'alertes d'emploi</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Créer ma première alerte
          </button>
        </div>
      ) : (
        <div className="row">
          {alerts.map((alert) => (
            <div key={alert.id} className="col-lg-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">
                      {alert.title || 'Alerte générale'}
                    </h5>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => testAlert(alert.id)}
                        title="Tester l'alerte"
                      >
                        <i className="fas fa-search"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteAlert(alert.id)}
                        title="Supprimer l'alerte"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className={`badge ${alert.is_active ? 'bg-success' : 'bg-secondary'}`}>
                      {alert.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {alert.location && (
                    <p className="card-text text-muted mb-1">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {alert.location}
                    </p>
                  )}
                  
                  {alert.job_type && (
                    <p className="card-text text-muted mb-1">
                      <i className="fas fa-clock me-1"></i>
                      {getJobTypeLabel(alert.job_type)}
                    </p>
                  )}
                  
                  {alert.keywords && alert.keywords.length > 0 && (
                    <div className="mb-2">
                      <small className="text-muted">Mots-clés inclus:</small>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {alert.keywords.map((keyword, index) => (
                          <span key={index} className="badge bg-primary" style={{ fontSize: '0.7em' }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {alert.excluded_keywords && alert.excluded_keywords.length > 0 && (
                    <div className="mb-2">
                      <small className="text-muted">Mots-clés exclus:</small>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {alert.excluded_keywords.map((keyword, index) => (
                          <span key={index} className="badge bg-secondary" style={{ fontSize: '0.7em' }}>
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="card-text text-muted mb-3">
                    <small>
                      <i className="fas fa-calendar me-1"></i>
                      Créée le {new Date(alert.created_at).toLocaleDateString('fr-FR')}
                    </small>
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className={`btn btn-sm ${alert.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                      onClick={() => toggleAlert(alert.id)}
                    >
                      {alert.is_active ? 'Désactiver' : 'Activer'}
                    </button>
                    
                    <small className="text-muted">
                      Dernière notification: {alert.last_sent_at 
                        ? new Date(alert.last_sent_at).toLocaleDateString('fr-FR')
                        : 'Jamais'
                      }
                    </small>
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

export default JobAlerts;
