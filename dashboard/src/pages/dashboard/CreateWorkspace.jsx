import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/context/WorkspaceContext';
import { createWorkspace } from '@/api/workspace';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, AlertCircle } from 'lucide-react';

export default function CreateWorkspace() {
  const { refreshWorkspaces, setCurrentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", slug: "", url: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const newWs = await createWorkspace(form.name, form.slug, form.url);
      await refreshWorkspaces();
      setCurrentWorkspace(newWs);
      navigate(`/w/${newWs.slug}/settings`);
    } catch (err) {
      setError(err.response?.data?.detail || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // The component takes the full page, but the content is centered
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 mb-6">
            <Building size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create a new workspace</h1>
          <p className="text-gray-500 mt-2">A workspace represents a website or documentation you want to index.</p>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <Label htmlFor="name" className="font-semibold">Workspace Name</Label>
            <p className="text-sm text-gray-500 mb-2">A friendly name for your project.</p>
            <Input 
              id="name"
              placeholder="e.g. Developer Documentation" 
              className="h-11 border-gray-300 focus-visible:ring-black"
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="slug" className="font-semibold">Unique Slug</Label>
            <p className="text-sm text-gray-500 mb-2">Used in the URL (no spaces or special characters).</p>
            <Input 
              id="slug"
              placeholder="e.g. dev-docs" 
              className="h-11 border-gray-300 focus-visible:ring-black font-mono"
              value={form.slug} 
              onChange={e => setForm({...form, slug: e.target.value})} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="url" className="font-semibold">Base URL to Crawl</Label>
            <p className="text-sm text-gray-500 mb-2">The starting point for indexing your content.</p>
            <Input 
              id="url"
              type="url"
              placeholder="https://docs.example.com" 
              className="h-11 border-gray-300 focus-visible:ring-black"
              value={form.url} 
              onChange={e => setForm({...form, url: e.target.value})} 
              required 
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle size={16} />
                {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-gray-800 text-white font-medium transition-all"
          >
            {isLoading ? "Creating..." : "Create and Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}