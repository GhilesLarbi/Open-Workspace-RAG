import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Plus, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDocuments } from '@/api/documents';
import DocumentItem from '@/components/dashboard/documents/DocumentItem';
import AddDocumentModal from '@/components/dashboard/documents/AddDocumentModal';
import ScrapeWorkspaceModal from '@/components/dashboard/documents/ScrapeWorkspaceModal';

export default function WorkspaceDocuments() {
  const { slug } = useParams();
  const [documents, setDocuments] = useState([]);
  const[loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 10;
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isScrapeOpen, setIsScrapeOpen] = useState(false);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocuments(slug, page * limit, limit);
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoading(false);
    }
  }, [slug, page]);

  // Refetch when slug or page changes
  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleNextPage = () => {
    if (documents.length === limit) {
      setPage(p => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(p => p - 1);
    }
  };

  return (
    <div className="w-full h-full p-6">
      <header className="pb-8 border-b border-gray-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <FileText size={24} />
          </div>
          <div>
              <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage and view all indexed pages in this workspace.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsAddOpen(true)} variant="outline" className="gap-2">
            <Plus size={16} />
            Add Page
          </Button>
          <Button onClick={() => setIsScrapeOpen(true)} className="gap-2 bg-black text-white hover:bg-gray-800">
            <Globe size={16} />
            Deep Scrape
          </Button>
        </div>
      </header>

      {/* Changed from "max-w-5xl" to just "w-full" to take the full width */}
      <div className="w-full">
        {loading ? (
          <div className="py-20 text-center text-gray-500 text-sm">Loading documents...</div>
        ) : documents.length > 0 ? (
          <div className="flex flex-col">
            {documents.map(doc => (
              <DocumentItem key={doc.id} document={doc} />
            ))}
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Page {page + 1}
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevPage} 
                  disabled={page === 0}
                  className="gap-1"
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextPage} 
                  disabled={documents.length < limit}
                  className="gap-1"
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full p-20 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <FileText size={24} />
              </div>
              <h3 className="text-gray-900 font-medium">No documents found</h3>
              <p className="text-gray-400 text-sm mt-1 mb-4">
                  {page > 0 
                    ? "You've reached the end of the list." 
                    : "Add a single page or trigger a deep scrape to start indexing."}
              </p>
              
              {page === 0 && (
                <div className="flex items-center gap-3">
                  <Button onClick={() => setIsAddOpen(true)} variant="outline" size="sm">
                    Add Single Page
                  </Button>
                  <Button onClick={() => setIsScrapeOpen(true)} className="bg-black text-white hover:bg-gray-800" size="sm">
                    Start Scrape
                  </Button>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Action Modals */}
      <AddDocumentModal 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
        workspaceSlug={slug}
        onSuccess={fetchDocs} 
      />
      
      <ScrapeWorkspaceModal 
        open={isScrapeOpen} 
        onOpenChange={setIsScrapeOpen} 
        workspaceSlug={slug}
        onSuccess={fetchDocs}
      />
    </div>
  );
}