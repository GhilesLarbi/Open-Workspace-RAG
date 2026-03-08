import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkspace } from '@/context/WorkspaceContext';
import { getWorkspaceBySlug } from '@/api/workspace';
import { addTagToWorkspace, removeTagFromWorkspace } from '@/api/tags';
import { buildTagTree } from '@/lib/treeUtils';
import TagNode from '@/components/dashboard/TagNode';
import NewTagInput from '@/components/dashboard/NewTagInput';
import { Plus, FolderTree } from 'lucide-react';

export default function WorkspaceTags() {
  const { slug } = useParams();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const [isAddingRoot, setIsAddingRoot] = useState(false);

  const tagTree = useMemo(() => {
    return buildTagTree(currentWorkspace?.tags || []);
  }, [currentWorkspace?.tags]);

  const handleAdd = async (parentPath, newSegment) => {
    const fullPath = parentPath ? `${parentPath}.${newSegment}` : newSegment;
    try {
      const data = await addTagToWorkspace(slug, fullPath);
      setCurrentWorkspace(prev => ({ ...prev, tags: data.tags }));
      setIsAddingRoot(false);
    } catch (err) {
      alert("Invalid tag name (no spaces or special chars).");
    }
  };

  const handleDelete = async (path) => {
    try {
      await removeTagFromWorkspace(slug, path);
      const data = await getWorkspaceBySlug(slug);
      setCurrentWorkspace(data);
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (!currentWorkspace) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    // REMOVED `max-w-2xl` and `mx-auto`
    <div className="w-full h-full p-6">
      {/* PAGE HEADER */}
      <header className="pb-8 border-b border-gray-200 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
              <FolderTree size={24} />
          </div>
          <div>
              <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
              <p className="text-gray-500 text-sm mt-0.5">Define your document hierarchy.</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-3xl"> {/* Inner container for readability */}
        <div className="space-y-1">
          {tagTree.map((node) => (
            <TagNode 
              key={node.path} 
              node={node} 
              onAddChild={handleAdd} 
              onDelete={handleDelete} 
            />
          ))}

          {isAddingRoot ? (
            <div className="pl-[34px]">
              <NewTagInput
                onSave={(name) => handleAdd(null, name)}
                onCancel={() => setIsAddingRoot(false)}
                placeholder="New root tag..."
              />
            </div>
          ) : (
            <div 
              className="group flex items-center h-9 px-2 text-gray-400 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
              onClick={() => setIsAddingRoot(true)}
            >
              <div className="w-6 h-6 flex items-center justify-center mr-1">
                <Plus size={14} />
              </div>
              <span className="text-sm font-medium">Add a root tag</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}