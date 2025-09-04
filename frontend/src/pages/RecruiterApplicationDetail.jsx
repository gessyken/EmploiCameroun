import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const RecruiterApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/recruiter/applications/${id}`);
      setApplication(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement de la candidature:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (status) => {
    setUpdating(true);
    try {
      await api.put(`/recruiter/applications/${id}`, { status });
      setApplication(prev => ({ ...prev, status }));
      alert(`Candidature ${status === 'accepted' ? 'acceptée' : 'rejetée'} avec succès !`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la candidature');
    } finally {
      setUpdating(false);
    }
  };

  const downloadFile = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = `${import.meta.env.VITE_API_URL}/storage/${filePath}`;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      accepted: 'Acceptée',
      rejected: 'Rejetée'
    };
    return labels[status] || status;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la candidature...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidature non trouvée</h2>
          <p className="text-gray-600 mb-6">Cette candidature n'existe pas ou a été supprimée.</p>
          <Link to="/recruiter/applications" className="btn-primary">
            Retour aux candidatures
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <Link
              to="/recruiter/applications"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Toutes les candidatures
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Candidature de {application.candidate?.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Pour le poste: <span className="font-medium">{application.job?.title}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`badge ${getStatusColor(application.status)}`}>
                {getStatusLabel(application.status)}
              </span>
              {application.status === 'pending' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateApplicationStatus('accepted')}
                    disabled={updating}
                    className="btn-success flex items-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Accepter
                  </button>
                  <button
                    onClick={() => updateApplicationStatus('rejected')}
                    disabled={updating}
                    className="btn-danger flex items-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium text-gray-900">{application.candidate?.name}</p>
                  </div>
                </div>
                
                {application.candidate?.email && (
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a 
                        href={`mailto:${application.candidate.email}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {application.candidate.email}
                      </a>
                    </div>
                  </div>
                )}

                {application.candidate?.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <a 
                        href={`tel:${application.candidate.phone}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {application.candidate.phone}
                      </a>
                    </div>
                  </div>
                )}

                {application.candidate?.address && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse</p>
                      <p className="font-medium text-gray-900">{application.candidate.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {application.candidate?.bio && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">À propos</h3>
                  <p className="text-gray-600">{application.candidate.bio}</p>
                </div>
              )}
            </div>

            {/* Lettre de motivation */}
            {application.cover_letter && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lettre de motivation</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{application.cover_letter}</p>
                </div>
              </div>
            )}

            {/* Compétences */}
            {application.candidate?.skills && application.candidate.skills.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Compétences</h2>
                <div className="flex flex-wrap gap-2">
                  {application.candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="badge bg-blue-100 text-blue-800"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de la candidature */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de la candidature</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date de candidature</p>
                    <p className="font-medium text-gray-900">{formatDate(application.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className={`badge ${getStatusColor(application.status)}`}>
                    {getStatusLabel(application.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-3">
                {application.resume && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">CV</span>
                    </div>
                    <button
                      onClick={() => downloadFile(application.resume, 'CV.pdf')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {application.documents && application.documents.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Documents supplémentaires</p>
                    {application.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">
                            Document {index + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => downloadFile(doc.file_path, `Document_${index + 1}.pdf`)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!application.resume && (!application.documents || application.documents.length === 0) && (
                  <p className="text-sm text-gray-500">Aucun document fourni</p>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            {application.status === 'pending' && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => updateApplicationStatus('accepted')}
                    disabled={updating}
                    className="btn-success w-full flex items-center justify-center"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Accepter la candidature
                  </button>
                  <button
                    onClick={() => updateApplicationStatus('rejected')}
                    disabled={updating}
                    className="btn-danger w-full flex items-center justify-center"
                  >
                    <XMarkIcon className="h-4 w-4 mr-2" />
                    Rejeter la candidature
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterApplicationDetail;
