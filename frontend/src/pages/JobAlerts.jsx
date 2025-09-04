import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const JobAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [formData, setFormData] = useState({
    keywords: '',
    location: '',
    job_type: '',
    salary_min: '',
    salary_max: '',
    frequency: 'daily',
    is_active: true
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAlert) {
        await api.put(`/candidate/job-alerts/${editingAlert.id}`, formData);
      } else {
        await api.post('/candidate/job-alerts', formData);
      }
      
      setShowForm(false);
      setEditingAlert(null);
      setFormData({
        keywords: '',
        location: '',
        job_type: '',
        salary_min: '',
        salary_max: '',
        frequency: 'daily',
        is_active: true
      });
      fetchAlerts();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'alerte:', error);
    }
  };

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    setFormData({
      keywords: alert.keywords || '',
      location: alert.location || '',
      job_type: alert.job_type || '',
      salary_min: alert.salary_min || '',
      salary_max: alert.salary_max || '',
      frequency: alert.frequency || 'daily',
      is_active: alert.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      try {
        await api.delete(`/candidate/job-alerts/${alertId}`);
        fetchAlerts();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'alerte:', error);
      }
    }
  };

  const toggleAlert = async (alertId) => {
    try {
      await api.post(`/candidate/job-alerts/${alertId}/toggle`);
      fetchAlerts();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'alerte:', error);
    }
  };

  const testAlert = async (alertId) => {
    try {
      await api.post(`/candidate/job-alerts/${alertId}/test`);
      alert('Notification de test envoyée !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du test:', error);
    }
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel'
    };
    return labels[frequency] || frequency;
  };

  const getJobTypeLabel = (type) => {
    const types = {
      full_time: 'Temps plein',
      part_time: 'Temps partiel',
      contract: 'Contrat',
      temporary: 'Temporaire',
      internship: 'Stage'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos alertes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes alertes d'emploi</h1>
            <p className="text-gray-600 mt-2">
              Recevez des notifications pour les offres qui correspondent à vos critères
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvelle alerte
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingAlert ? 'Modifier l\'alerte' : 'Nouvelle alerte d\'emploi'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingAlert(null);
                      setFormData({
                        keywords: '',
                        location: '',
                        job_type: '',
                        salary_min: '',
                        salary_max: '',
                        frequency: 'daily',
                        is_active: true
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mots-clés
                      </label>
                      <input
                        type="text"
                        value={formData.keywords}
                        onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                        placeholder="Ex: développeur, marketing..."
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Localisation
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Ex: Yaoundé, Douala..."
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type d'emploi
                      </label>
                      <select
                        value={formData.job_type}
                        onChange={(e) => setFormData({...formData, job_type: e.target.value})}
                        className="input-field"
                      >
                        <option value="">Tous les types</option>
                        <option value="full_time">Temps plein</option>
                        <option value="part_time">Temps partiel</option>
                        <option value="contract">Contrat</option>
                        <option value="temporary">Temporaire</option>
                        <option value="internship">Stage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fréquence
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                        className="input-field"
                      >
                        <option value="daily">Quotidien</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salaire minimum (FCFA)
                      </label>
                      <input
                        type="number"
                        value={formData.salary_min}
                        onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                        placeholder="Ex: 100000"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salaire maximum (FCFA)
                      </label>
                      <input
                        type="number"
                        value={formData.salary_max}
                        onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                        placeholder="Ex: 500000"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Alerte active
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn-secondary"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingAlert ? 'Modifier' : 'Créer'} l'alerte
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Alerts List */}
        {alerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alerts.map((alert) => (
              <div key={alert.id} className="card group hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BellIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alert.keywords || 'Alerte générale'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getFrequencyLabel(alert.frequency)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        alert.is_active 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={alert.is_active ? 'Désactiver' : 'Activer'}
                    >
                      {alert.is_active ? (
                        <PlayIcon className="h-5 w-5" />
                      ) : (
                        <PauseIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {alert.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">📍</span>
                      <span>{alert.location}</span>
                    </div>
                  )}
                  {alert.job_type && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">💼</span>
                      <span>{getJobTypeLabel(alert.job_type)}</span>
                    </div>
                  )}
                  {(alert.salary_min || alert.salary_max) && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">💰</span>
                      <span>
                        {alert.salary_min && alert.salary_max
                          ? `${alert.salary_min.toLocaleString()} - ${alert.salary_max.toLocaleString()} FCFA`
                          : alert.salary_min
                          ? `À partir de ${alert.salary_min.toLocaleString()} FCFA`
                          : `Jusqu'à ${alert.salary_max.toLocaleString()} FCFA`
                        }
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(alert)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="Modifier"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => testAlert(alert.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Tester
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BellIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune alerte configurée
            </h3>
            <p className="text-gray-500 mb-6">
              Créez votre première alerte pour être notifié des nouvelles offres qui vous intéressent.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Créer ma première alerte
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAlerts;