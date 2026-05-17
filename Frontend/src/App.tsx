/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/layout/PageLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Public Pages (Lazy Loaded)
const Home = lazy(() => import("./pages/public/Home"));
const Projects = lazy(() => import("./pages/public/Projects"));
const ProjectDetails = lazy(() => import("./pages/public/ProjectDetails"));
const Contact = lazy(() => import("./pages/public/Contact"));

// Admin Pages (Lazy Loaded)
const Login = lazy(() => import("./pages/admin/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageProjects = lazy(() => import("./pages/admin/ManageProjects"));
const EditProfile = lazy(() => import("./pages/admin/EditProfile"));
const ViewMessages = lazy(() => import("./pages/admin/ViewMessages"));
const ManageTechStack = lazy(() => import("./pages/admin/ManageTechStack"));

import { ToastProvider } from "./components/ui/Toast";
import { ConfirmProvider } from "./components/ui/ConfirmDialog";
import { AuthProvider } from "./contexts/AuthContext";

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfirmProvider>
          <ToastProvider>
            <PageLayout>
              <Suspense fallback={<LoadingSpinner />}>
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
                    <Route
                      path="manage-projects"
                      element={<ManageProjects />}
                    />
                    <Route path="tech-stack" element={<ManageTechStack />} />
                    <Route path="profile" element={<EditProfile />} />
                    <Route path="messages" element={<ViewMessages />} />
                  </Route>
                </Routes>
              </Suspense>
            </PageLayout>
          </ToastProvider>
        </ConfirmProvider>
      </AuthProvider>
    </Router>
  );
}
