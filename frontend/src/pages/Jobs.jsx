import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import JobSearchFilters from '../components/JobSearchFilters';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import api from '../api';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    title: searchParams.get('title') || '',
    location: searchParams.get('location') || '',
    job_type: searchParams.get('job_type') || '',
    salary_min: searchParams.get('salary_min') || '',
    salary_max: searchParams.get('salary_max') || '',
    skills: searchParams.get('skills') ? searchParams.get('skills').split(',').map(Number) : [],
    company: searchParams.get('company') || ''
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '12',
        ...filters,
        skills: filters.skills.join(',')
      });

      const response = await api.get(`/search/jobs?${params.toString()}`);
      setJobs(response.data.data || []);
      setPagination({
        current_page: response.data.current_page || 1,
        last_page: response.data.last_page || 1,
        total: response.data.total || 0,
        per_page: response.data.per_page || 12
      });
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
        params.set(key, Array.isArray(value) ? value.join(',') : value);
      }
    });
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    fetchJobs(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = async (jobId) => {
    try {
      if (favorites.has(jobId)) {
        await api.delete(`/candidate/favorites/${jobId}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await api.post(`/candidate/favorites/${jobId}`);
        setFavorites(prev => new Set([...prev, jobId]));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      title: '',
      location: '',
      job_type: '',
      salary_min: '',
      salary_max: '',
      skills: [],
      company: ''
    };
    setFilters(emptyFilters);
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trouvez votre emploi idéal
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez des milliers d'offres d'emploi dans tous les secteurs au Cameroun
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <JobSearchFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors duration-200"
                  >
                    <FunnelIcon className="h-5 w-5" />
                    Filtres
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    {pagination.total > 0 ? (
                      <>
                        <span className="font-medium">{pagination.total}</span> offres trouvées
                        {hasActiveFilters && (
                          <span className="ml-2 text-blue-600">
                            (filtrées)
                          </span>
                        )}
                      </>
                    ) : (
                      'Aucune offre trouvée'
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Squares2X2Icon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <ListBulletIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <JobSearchFilters 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            )}

            {/* Jobs List */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="card animate-pulse">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.has(job.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.last_page > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.current_page}
                      totalPages={pagination.last_page}
                      onPageChange={handlePageChange}
                      totalItems={pagination.total}
                      itemsPerPage={pagination.per_page}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune offre trouvée
                </h3>
                <p className="text-gray-500 mb-6">
                  Essayez de modifier vos critères de recherche pour voir plus de résultats.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="btn-primary"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;