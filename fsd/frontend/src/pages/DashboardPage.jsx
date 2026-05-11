import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import ProjectOwnerDashboard from '../components/dashboard/ProjectOwnerDashboard';
import { Navigate, useLocation } from 'react-router-dom';

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showApplications, setShowApplications] = useState(
    new URLSearchParams(location.search).get('applications') === 'true'
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {user.role === 'student' ? (
        <StudentDashboard />
      ) : (
        <ProjectOwnerDashboard
          showApplications={showApplications}
          onCloseApplications={setShowApplications}
        />
      )}
    </div>
  );
};

export default DashboardPage;
