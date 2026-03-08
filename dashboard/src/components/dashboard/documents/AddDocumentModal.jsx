import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addSingleDocument } from '@/api/documents';

export default function AddDocumentModal({ open, onOpenChange, workspaceSlug, onSuccess }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSingleDocument(workspaceSlug, url);
      setUrl('');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add document.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Single Document</DialogTitle>
          <DialogDescription>
            Enter the URL of the page you want to scrape and index into this workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">Page URL</Label>
            <Input 
              id="url" 
              type="url" 
              placeholder="https://example.com/page" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-gray-800">
              {loading ? 'Adding...' : 'Add Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}