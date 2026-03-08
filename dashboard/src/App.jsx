import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './components/layout/DashboardLayout';
import WorkspaceSettings from './pages/dashboard/WorkspaceSettings';
import WorkspaceTags from './pages/dashboard/WorkspaceTags';
import WorkspaceDocuments from './pages/dashboard/WorkspaceDocuments';
import CreateWorkspace from './pages/dashboard/CreateWorkspace';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider> 
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
                <Route path="new-workspace" element={<CreateWorkspace />} />
                <Route path="w/:slug/settings" element={<WorkspaceSettings />} />
                <Route path="w/:slug/tags" element={<WorkspaceTags />} />
                <Route path="w/:slug/documents" element={<WorkspaceDocuments />} />
            </Route>
          </Routes>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}