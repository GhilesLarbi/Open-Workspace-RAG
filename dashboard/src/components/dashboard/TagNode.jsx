import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewTagInput from './NewTagInput';
import { cn } from '@/lib/utils';

export default function TagNode({ node, onAddChild, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  // Auto-cancel the delete confirmation after 3 seconds of inactivity
  useEffect(() => {
    let timer;
    if (isConfirmingDelete) {
      timer = setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [isConfirmingDelete]);

  const handleSaveChild = (newName) => {
    onAddChild(node.path, newName);
    setIsAdding(false);
    setIsExpanded(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (isConfirmingDelete) {
      onDelete(node.path); // Second click: actually delete
    } else {
      setIsConfirmingDelete(true); // First click: enter confirm mode
    }
  };

  return (
    <div className="w-full" onMouseLeave={() => setIsConfirmingDelete(false)}>
      <div className={cn(
          "group flex items-center h-9 px-2 hover:bg-gray-100 rounded-md transition-all cursor-pointer",
          isConfirmingDelete && "bg-red-50 hover:bg-red-100"
      )}>
        <div 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-200 rounded"
        >
          {hasChildren ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) 
                       : (<div className="w-1 h-1 bg-gray-300 rounded-full" />)}
        </div>
        <span 
            className={cn("flex-1 text-sm font-medium ml-1", isConfirmingDelete ? "text-red-800" : "text-gray-700")}
            onClick={() => setIsExpanded(!isExpanded)}
        >
          {node.name}
        </span>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          <Button variant="ghost" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}>
            <Plus size={14} />
          </Button>
          <Button 
            variant="ghost" 
            className={cn(
                "h-7 w-7 p-0",
                isConfirmingDelete 
                    ? "text-red-700 bg-red-100 hover:bg-red-200" 
                    : "text-gray-400 hover:text-red-600"
            )}
            onClick={handleDeleteClick}
          >
            {isConfirmingDelete ? <Check size={14} /> : <Trash2 size={14} />}
          </Button>
        </div>
      </div>

      {(isExpanded || isAdding) && (
        <div className="ml-[11px] pl-4 border-l border-gray-200 mt-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TagNode key={child.path} node={child} onAddChild={onAddChild} onDelete={onDelete} />
          ))}
          {isAdding && (
            <NewTagInput 
              onSave={handleSaveChild} 
              onCancel={() => setIsAdding(false)}
              placeholder="New sub-tag..."
            />
          )}
        </div>
      )}
    </div>
  );
}