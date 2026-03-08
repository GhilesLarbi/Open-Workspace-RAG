import { NavLink } from 'react-router-dom';
import { Settings, FileText, Tags, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { logout } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const links = currentWorkspace ? [
    { name: 'Settings', href: `/w/${currentWorkspace.slug}/settings`, icon: Settings },
    { name: 'Tags', href: `/w/${currentWorkspace.slug}/tags`, icon: Tags },
    { name: 'Documents', href: `/w/${currentWorkspace.slug}/documents`, icon: FileText },
  ] : [];

  return (
    <div className="w-64 h-screen border-r bg-gray-50/50 flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b bg-white">
        {/* Switcher is always here so you can click "Create Workspace" */}
        <WorkspaceSwitcher />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.name}
          </NavLink>
        ))}
        {!currentWorkspace && (
            <p className="text-xs text-gray-400 px-3 py-4 italic">
                No workspace selected. Create one above to get started.
            </p>
        )}
      </nav>

      <div className="p-4 border-t bg-white">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}