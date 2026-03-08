import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { scrapeWorkspace } from '@/api/documents';

export default function ScrapeWorkspaceModal({ open, onOpenChange, workspaceSlug, onSuccess }) {
  const [maxPages, setMaxPages] = useState(1000);
  const [depth, setDepth] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await scrapeWorkspace(workspaceSlug, maxPages, depth);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to start deep scrape.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deep Scrape Workspace</DialogTitle>
          <DialogDescription>
            Start a deep crawl from the workspace's base URL to index multiple pages.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPages">Max Pages</Label>
              <Input 
                id="maxPages" 
                type="number" 
                min={1}
                value={maxPages}
                onChange={(e) => setMaxPages(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Crawl Depth</Label>
              <Input 
                id="depth" 
                type="number" 
                min={1}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-gray-800">
              {loading ? 'Starting...' : 'Start Scrape'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}