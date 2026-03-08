import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/context/WorkspaceContext';
import { updateWorkspace, deleteWorkspace } from '@/api/workspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, CheckCircle, AlertCircle } from 'lucide-react';

export default function WorkspaceSettings() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { workspaces, refreshWorkspaces, setCurrentWorkspace } = useWorkspace();
  
  const [formData, setFormData] = useState({ name: '', slug: '', url: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ message: '', type: '' });
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Load workspace data into form when slug changes
  useEffect(() => {
    const ws = workspaces.find(w => w.slug === slug);
    if (ws) {
      setFormData({ name: ws.name, slug: ws.slug, url: ws.url });
      setCurrentWorkspace(ws);
    }
  }, [slug, workspaces, setCurrentWorkspace]);

  // Auto-clear success/error messages
  useEffect(() => {
    if (saveStatus.message) {
      const timer = setTimeout(() => setSaveStatus({ message: '', type: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  // Auto-cancel delete confirmation
  useEffect(() => {
    let timer;
    if (isConfirmingDelete) {
      timer = setTimeout(() => setIsConfirmingDelete(false), 4000);
    }
    return () => clearTimeout(timer);
  }, [isConfirmingDelete]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({ message: '', type: '' });
    try {
      await updateWorkspace(slug, formData);
      await refreshWorkspaces();
      setSaveStatus({ message: 'Settings saved successfully!', type: 'success' });
      if (formData.slug !== slug) navigate(`/w/${formData.slug}/settings`);
    } catch (err) {
      setSaveStatus({ message: err.response?.data?.detail || "Update failed", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorkspace(slug);
      await refreshWorkspaces();
      navigate('/'); 
    } catch(err) {
      alert("Failed to delete the workspace.");
    }
  };

  return (
    <div className="w-full h-full p-6">
      <header className="pb-8 border-b border-gray-200 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <Settings size={24} />
          </div>
          <div>
              <h1 className="text-2xl font-bold tracking-tight">Workspace Settings</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage and configure your workspace.</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl">
        <form onSubmit={handleUpdate} className="space-y-8 border border-gray-200 p-8 rounded-xl bg-white shadow-sm">
          <div>
            <Label htmlFor="name" className="text-base font-semibold">Display Name</Label>
            <p className="text-sm text-gray-500 mb-2">This is how your workspace will be identified in the dashboard.</p>
            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div>
            <Label htmlFor="url" className="text-base font-semibold">Base URL</Label>
            <p className="text-sm text-gray-500 mb-2">The starting point for the web crawler.</p>
            <Input id="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
          </div>

          <div>
            <Label htmlFor="slug" className="text-base font-semibold">Slug</Label>
            <p className="text-sm text-gray-500 mb-2">The unique identifier used in the URL. Must be unique.</p>
            <Input id="slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          </div>

          <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-100">
            {saveStatus.message && (
              <div className={`flex items-center gap-2 text-sm ${saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {saveStatus.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {saveStatus.message}
              </div>
            )}
            <Button type="submit" disabled={isSaving} className="bg-black px-8 w-28">
                {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>

        <Separator className="my-10" />

        <div className="border border-red-200 bg-red-50/50 p-8 rounded-xl" onMouseLeave={() => setIsConfirmingDelete(false)}>
            <h3 className="text-red-900 font-semibold">Delete Workspace</h3>
            <p className="text-red-700 text-sm mt-1 mb-6">Permanently delete this workspace and all its data. This action is irreversible.</p>
            <Button 
                variant="destructive" 
                onClick={isConfirmingDelete ? handleDelete : () => setIsConfirmingDelete(true)}
                className="bg-red-600 text-white hover:bg-red-700 w-48"
            >
                {isConfirmingDelete ? 'Confirm Deletion' : 'Delete Workspace'}
            </Button>
        </div>
      </div>
    </div>
  );
}