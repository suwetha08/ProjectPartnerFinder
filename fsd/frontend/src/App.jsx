import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BackgroundGradient from './components/ui/BackgroundGradient';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import TeamChatPage from './pages/TeamChatPage';

function App() {
  return (
    <BackgroundGradient>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1F2937',
          color: '#F3F4F6',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }} />
      <Navbar />
      <main className="pt-24 min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/create-project" element={<CreateProjectPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<TeamChatPage />} />
          <Route path="/chat/:projectId" element={<TeamChatPage />} />
        </Routes>
      </main>
      <Footer />
    </BackgroundGradient>
  );
}

export default App;
