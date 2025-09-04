import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
  Home,
  Login,
  Register,
  Jobs,
  JobDetail,
  ApplyJob,
  CandidateProfile,
  CandidateApplications,
  Favorites,
  JobAlerts,
  RecruiterJobs,
  RecruiterApplications,
  RecruiterApplicationDetail,
  AdminDashboard,
  AdminPendingJobs,
  AdminReviewJob,
} from './pages';

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">EmploiCameroun</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/jobs">Jobs</Link>
              </li>
              {user ? (
                <>
                  {user.role === 'candidate' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/candidate/profile">Profile</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/candidate/favorites">Favoris</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/candidate/job-alerts">Alertes</Link>
                      </li>
                    </>
                  )}
                  {user.role === 'recruiter' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/recruiter/jobs">My Jobs</Link>
                    </li>
                  )}
                  {user.role === 'admin' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/dashboard">Admin</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/jobs/:id/apply" element={<ApplyJob />} />

          {/* Candidate Routes */}
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/applications" element={<CandidateApplications />} />
          <Route path="/candidate/favorites" element={<Favorites />} />
          <Route path="/candidate/job-alerts" element={<JobAlerts />} />

          {/* Recruiter Routes */}
          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          <Route path="/recruiter/applications" element={<RecruiterApplications />} />
          <Route path="/recruiter/applications/:id" element={<RecruiterApplicationDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/jobs/pending" element={<AdminPendingJobs />} />
          <Route path="/admin/jobs/:id/review" element={<AdminReviewJob />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;