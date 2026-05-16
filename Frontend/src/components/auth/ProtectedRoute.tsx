import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from '../layout/AdminSidebar';
import { useAuth } from '@/src/contexts/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-neutral-50 dark:bg-black overflow-hidden" id="admin-layout-root">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar" id="admin-content">
        <div className="p-4 md:p-8 pb-32">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
