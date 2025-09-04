import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    job_type: '',
    salary_min: '',
    salary_max: '',
    skills: []
  });
  const [skills, setSkills] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchJobs();
    fetchSkills();
    fetchCompanies();
  }, [currentPage, filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 12,
        ...filters
      });
      
      const response = await api.get(`/search/jobs?${params}`);
      setJobs(response.data.data || []);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total
      });
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await api.get('/search/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/search/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSkillToggle = (skillId) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId]
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      location: '',
      job_type: '',
      salary_min: '',
      salary_max: '',
      skills: []
    });
    setCurrentPage(1);
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

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3">
          <div className="card">
            <div className="card-header">
              <h5>Filtres</h5>
            </div>
            <div className="card-body">
              {/* Title Search */}
              <div className="mb-3">
                <label className="form-label">Titre du poste</label>
                <input
                  type="text"
                  className="form-control"
                  value={filters.title}
                  onChange={(e) => handleFilterChange('title', e.target.value)}
                  placeholder="Ex: Développeur Laravel"
                />
              </div>

              {/* Location */}
              <div className="mb-3">
                <label className="form-label">Localisation</label>
                <input
                  type="text"
                  className="form-control"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Ex: Yaoundé, Douala"
                />
              </div>

              {/* Job Type */}
              <div className="mb-3">
                <label className="form-label">Type d'emploi</label>
                <select
                  className="form-select"
                  value={filters.job_type}
                  onChange={(e) => handleFilterChange('job_type', e.target.value)}
                >
                  <option value="">Tous les types</option>
                  <option value="full_time">Temps plein</option>
                  <option value="part_time">Temps partiel</option>
                  <option value="contract">Contrat</option>
                  <option value="internship">Stage</option>
                </select>
              </div>

              {/* Salary Range */}
              <div className="mb-3">
                <label className="form-label">Salaire minimum (FCFA)</label>
                <input
                  type="number"
                  className="form-control"
                  value={filters.salary_min}
                  onChange={(e) => handleFilterChange('salary_min', e.target.value)}
                  placeholder="Ex: 500000"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Salaire maximum (FCFA)</label>
                <input
                  type="number"
                  className="form-control"
                  value={filters.salary_max}
                  onChange={(e) => handleFilterChange('salary_max', e.target.value)}
                  placeholder="Ex: 1000000"
                />
              </div>

              {/* Skills */}
              <div className="mb-3">
                <label className="form-label">Compétences</label>
                <div className="skills-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {skills.map((skill) => (
                    <div key={skill.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`skill-${skill.id}`}
                        checked={filters.skills.includes(skill.id)}
                        onChange={() => handleSkillToggle(skill.id)}
                      />
                      <label className="form-check-label" htmlFor={`skill-${skill.id}`}>
                        {skill.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Offres d'emploi</h2>
            <div className="text-muted">
              {pagination.total} offres trouvées
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h4>Aucune offre trouvée</h4>
              <p className="text-muted">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <>
              <div className="row">
                {jobs.map((job) => (
                  <div key={job.id} className="col-lg-6 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title">{job.title}</h5>
                          <span className="badge bg-primary">{getJobTypeLabel(job.job_type)}</span>
                        </div>
                        
                        <p className="card-text text-muted mb-2">
                          <i className="fas fa-building me-1"></i>
                          {job.company?.name}
                        </p>
                        
                        <p className="card-text text-muted mb-2">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {job.location}
                        </p>
                        
                        <p className="card-text text-muted mb-2">
                          <i className="fas fa-money-bill-wave me-1"></i>
                          {formatSalary(job.salary_min, job.salary_max)}
                        </p>
                        
                        <p className="card-text text-muted mb-3">
                          <i className="fas fa-calendar me-1"></i>
                          Clôture: {new Date(job.deadline).toLocaleDateString('fr-FR')}
                        </p>
                        
                        <p className="card-text">
                          {job.description.substring(0, 150)}...
                        </p>
                        
                        {job.matching_score && (
                          <div className="mb-3">
                            <small className="text-muted">Score de correspondance: </small>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${job.matching_score}%` }}
                              ></div>
                            </div>
                            <small className="text-muted">{job.matching_score}%</small>
                          </div>
                        )}
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <i className="fas fa-eye me-1"></i>
                            {job.views_count} vues
                          </small>
                          <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
                            Voir détails
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Précédent
                      </button>
                    </li>
                    
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === pagination.last_page ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === pagination.last_page}
                      >
                        Suivant
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;