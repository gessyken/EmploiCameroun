import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalCandidates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [jobsResponse, companiesResponse] = await Promise.all([
        api.get('/search/jobs?per_page=1'),
        api.get('/search/companies?per_page=1')
      ]);
      
      setStats({
        totalJobs: jobsResponse.data.total || 0,
        totalCompanies: companiesResponse.data.total || 0,
        totalCandidates: 1250 // Mock data
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery || searchLocation) {
      const params = new URLSearchParams();
      if (searchQuery) params.append('title', searchQuery);
      if (searchLocation) params.append('location', searchLocation);
      window.location.href = `/jobs?${params.toString()}`;
    }
  };

  const features = [
    {
      icon: BriefcaseIcon,
      title: 'Offres d\'emploi',
      description: 'Découvrez des milliers d\'offres d\'emploi dans tous les secteurs',
      color: 'text-blue-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Candidats qualifiés',
      description: 'Trouvez les meilleurs talents pour votre entreprise',
      color: 'text-green-600'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Entreprises de confiance',
      description: 'Postulez auprès des meilleures entreprises du Cameroun',
      color: 'text-purple-600'
    }
  ];

  const benefits = [
    'Recherche avancée avec filtres',
    'Matching intelligent des profils',
    'Alertes personnalisées',
    'Interface moderne et intuitive',
    'Support client 24/7',
    'Gratuit pour tous les utilisateurs'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Trouvez votre{' '}
              <span className="text-yellow-300">emploi idéal</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              La plateforme de référence pour connecter les talents aux opportunités au Cameroun
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Titre du poste, mots-clés..."
                      className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 text-lg"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPinIcon className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Ville, région..."
                      className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 border-0 focus:ring-0 text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
                    Rechercher
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Voir toutes les offres
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalJobs.toLocaleString()}+
              </div>
              <div className="text-gray-600">Offres d'emploi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalCompanies.toLocaleString()}+
              </div>
              <div className="text-gray-600">Entreprises</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalCandidates.toLocaleString()}+
              </div>
              <div className="text-gray-600">Candidats</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir EmploiCameroun ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme moderne et intuitive pour faciliter votre recherche d'emploi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center group hover:shadow-lg transition-shadow duration-200">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200 mb-6`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Des fonctionnalités qui font la différence
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Découvrez tous les outils dont vous avez besoin pour réussir votre recherche d'emploi
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center"
                >
                  Commencer maintenant
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Interface moderne
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Une expérience utilisateur optimisée pour une navigation fluide et intuitive.
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <span>Découvrir l'interface</span>
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à trouver votre emploi idéal ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de candidats qui ont trouvé leur emploi de rêve grâce à EmploiCameroun
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Créer un compte gratuit
            </Link>
            <Link
              to="/jobs"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
            >
              Voir les offres
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;