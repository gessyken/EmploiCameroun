import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
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
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
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
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;