import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function DashboardLayout() {
  const { workspaces, loading } = useWorkspace();
  const location = useLocation();

  if (loading) return null;

  const hasNoWorkspaces = workspaces.length === 0;
  const isAtRoot = location.pathname === '/';
  const isAtNewWorkspacePage = location.pathname === '/new-workspace';

  if (isAtRoot) {
    if (hasNoWorkspaces) return <Navigate to="/new-workspace" replace />;
    return <Navigate to={`/w/${workspaces[0].slug}/settings`} replace />;
  }

  if (hasNoWorkspaces && !isAtNewWorkspacePage) {
    return <Navigate to="/new-workspace" replace />;
  }

  const showSidebar = !hasNoWorkspaces;

  // Helper for the class names
  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <div className="flex min-h-screen bg-white">
      {showSidebar && <Sidebar />}
      {/* REMOVED p-8 from main */}
      <main className={cn("flex-1 bg-white", showSidebar ? "ml-64" : "ml-0")}>
        <Outlet />
      </main>
    </div>
  );
}