import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const JobCard = ({ job, onToggleFavorite, isFavorite = false }) => {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Salaire non spécifié';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} FCFA`;
    if (min) return `À partir de ${min.toLocaleString()} FCFA`;
    if (max) return `Jusqu'à ${max.toLocaleString()} FCFA`;
    return 'Salaire non spécifié';
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

  const getJobTypeColor = (type) => {
    const colors = {
      full_time: 'bg-green-100 text-green-800',
      part_time: 'bg-blue-100 text-blue-800',
      contract: 'bg-purple-100 text-purple-800',
      temporary: 'bg-yellow-100 text-yellow-800',
      internship: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isNew = () => {
    const jobDate = new Date(job.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              <Link to={`/jobs/${job.id}`} className="hover:underline">
                {job.title}
              </Link>
            </h3>
            <p className="text-sm text-gray-600">{job.company?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isNew() && (
            <span className="badge badge-primary text-xs">Nouveau</span>
          )}
          <button
            onClick={() => onToggleFavorite(job.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`badge ${getJobTypeColor(job.job_type)}`}>
          {getJobTypeLabel(job.job_type)}
        </span>
        {job.skills && job.skills.slice(0, 3).map((skill) => (
          <span key={skill.id} className="badge bg-gray-100 text-gray-700">
            {skill.name}
          </span>
        ))}
        {job.skills && job.skills.length > 3 && (
          <span className="badge bg-gray-100 text-gray-700">
            +{job.skills.length - 3} autres
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <MapPinIcon className="h-4 w-4 mr-2" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
          <span>{formatSalary(job.salary_min, job.salary_max)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 mr-2" />
          <span>Publié le {formatDate(job.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <Link
            to={`/jobs/${job.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Voir les détails
          </Link>
        </div>
        <Link
          to={`/jobs/${job.id}/apply`}
          className="btn-primary text-sm px-4 py-2"
        >
          Postuler
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
