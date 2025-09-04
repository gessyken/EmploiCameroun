import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CandidateProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: '',
    address: '',
    date_of_birth: '',
    gender: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    skills: [],
    experiences: [],
    educations: []
  });

  useEffect(() => {
    fetchProfile();
    fetchSkills();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/candidate/profile');
      setProfile(response.data);
      setFormData({
        phone_number: response.data.phone_number || '',
        address: response.data.address || '',
        date_of_birth: response.data.date_of_birth || '',
        gender: response.data.gender || '',
        bio: response.data.bio || '',
        linkedin_url: response.data.linkedin_url || '',
        github_url: response.data.github_url || '',
        portfolio_url: response.data.portfolio_url || '',
        skills: response.data.skills || [],
        experiences: response.data.experiences || [],
        educations: response.data.educations || []
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillToggle = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.some(s => s.id === skillId)
        ? prev.skills.filter(s => s.id !== skillId)
        : [...prev.skills, { id: skillId, level: 'intermediate' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/candidate/profile', formData);
      setProfile(response.data.profile);
      setEditing(false);
      alert('Profil mis à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert('Erreur lors de la mise à jour du profil');
    }
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

  if (!profile) {
    return (
      <div className="text-center py-5">
        <h3>Profil non trouvé</h3>
        <p className="text-muted">Veuillez créer votre profil candidat</p>
        <button className="btn btn-primary" onClick={() => setEditing(true)}>
          Créer mon profil
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Mon Profil Candidat</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Annuler' : 'Modifier'}
            </button>
          </div>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Informations personnelles */}
            <div className="col-lg-6">
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Informations personnelles</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Adresse</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Date de naissance</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Genre</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Sélectionner</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Biographie</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Liens et réseaux */}
            <div className="col-lg-6">
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Liens et réseaux</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">LinkedIn</label>
                    <input
                      type="url"
                      className="form-control"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/votre-profil"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">GitHub</label>
                    <input
                      type="url"
                      className="form-control"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleInputChange}
                      placeholder="https://github.com/votre-profil"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Portfolio</label>
                    <input
                      type="url"
                      className="form-control"
                      name="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={handleInputChange}
                      placeholder="https://votre-portfolio.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compétences */}
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Compétences</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {skills.map((skill) => (
                      <div key={skill.id} className="col-md-3 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`skill-${skill.id}`}
                            checked={formData.skills.some(s => s.id === skill.id)}
                            onChange={() => handleSkillToggle(skill.id)}
                          />
                          <label className="form-check-label" htmlFor={`skill-${skill.id}`}>
                            {skill.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-lg">
                Sauvegarder le profil
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="row">
          {/* Affichage du profil */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <h3>{user?.name}</h3>
                <p className="text-muted">{profile.bio || 'Aucune biographie disponible'}</p>
                
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Téléphone:</strong> {profile.phone_number || 'Non renseigné'}</p>
                    <p><strong>Adresse:</strong> {profile.address || 'Non renseignée'}</p>
                    <p><strong>Date de naissance:</strong> {profile.date_of_birth || 'Non renseignée'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Genre:</strong> {profile.gender || 'Non renseigné'}</p>
                    <p><strong>LinkedIn:</strong> {profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">Voir le profil</a> : 'Non renseigné'}</p>
                    <p><strong>GitHub:</strong> {profile.github_url ? <a href={profile.github_url} target="_blank" rel="noopener noreferrer">Voir le profil</a> : 'Non renseigné'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compétences */}
            <div className="card mb-4">
              <div className="card-header">
                <h5>Compétences</h5>
              </div>
              <div className="card-body">
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill.id} className="badge bg-primary">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Aucune compétence renseignée</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5>Statut du profil</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className={`badge ${profile.is_complete ? 'bg-success' : 'bg-warning'} me-2`}>
                    {profile.is_complete ? 'Complet' : 'Incomplet'}
                  </div>
                </div>
                
                {!profile.is_complete && (
                  <div className="alert alert-warning">
                    <small>Complétez votre profil pour améliorer vos chances d'être recruté.</small>
                  </div>
                )}
                
                <div className="mt-3">
                  <h6>Progression</h6>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar" 
                      style={{ width: profile.is_complete ? '100%' : '60%' }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    {profile.is_complete ? '100%' : '60%'} complété
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;