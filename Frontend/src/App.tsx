/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PageLayout } from './components/layout/PageLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Projects from './pages/public/Projects';
import ProjectDetails from './pages/public/ProjectDetails';
import Contact from './pages/public/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import EditProfile from './pages/admin/EditProfile';
import ViewMessages from './pages/admin/ViewMessages';
import ManageTechStack from './pages/admin/ManageTechStack';

import { ToastProvider } from './components/ui/Toast';
import { ConfirmProvider } from './components/ui/ConfirmDialog';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfirmProvider>
          <ToastProvider>
            <PageLayout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="manage-projects" element={<ManageProjects />} />
                  <Route path="tech-stack" element={<ManageTechStack />} />
                  <Route path="profile" element={<EditProfile />} />
                  <Route path="messages" element={<ViewMessages />} />
                </Route>
              </Routes>
            </PageLayout>
          </ToastProvider>
        </ConfirmProvider>
      </AuthProvider>
    </Router>
  );
}
