import { useState } from 'react';
import { ChevronDown, ChevronRight, Link as LinkIcon, Calendar, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function DocumentItem({ document }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(document.created_at).toLocaleDateString();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-4 shadow-sm transition-all hover:border-gray-300">
      <div 
        className="p-4 flex items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="text-gray-400">
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate" dir="auto">
            {document.title && document.title !== "Untitled" ? document.title : document.url}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1 truncate max-w-[250px] sm:max-w-md">
              <LinkIcon size={12} />
              {document.url}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {date}
            </span>
            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium uppercase">
              {document.lang || 'EN'}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {document.tags?.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
          ))}
          {document.tags?.length > 3 && (
            <Badge variant="secondary" className="text-[10px]">+{document.tags.length - 3}</Badge>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Hash size={16} className="text-gray-400" />
            Extracted Chunks ({document.chunks?.length || 0})
          </h4>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {document.chunks?.length > 0 ? (
              document.chunks.map(chunk => (
                <div key={chunk.id} className="bg-white border border-gray-200 rounded-md p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <div className="text-xs text-gray-400 font-mono font-medium bg-gray-50 px-2 py-1 rounded">
                      Chunk #{chunk.chunk_index}
                    </div>
                  </div>
                  
                  {/* Tailwind typography prose + standard ReactMarkdown is all you need */}
                  <div 
                    className="prose prose-sm prose-gray max-w-none" 
                    dir="auto"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {chunk.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No chunks available for this document.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}