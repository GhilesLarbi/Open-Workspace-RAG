import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';

export default function NewTagInput({ onSave, onCancel, placeholder = "New tag..." }) {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName("");
    }
  };

  return (
    <div className="flex items-center gap-1 py-1 pr-2">
      <Input 
        autoFocus
        className="h-8 text-sm border-gray-300 focus-visible:ring-black bg-white"
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave();
          if (e.key === 'Escape') onCancel();
        }}
      />
      <div className="flex items-center">
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={handleSave}>
            <Check size={14} className="text-green-600" />
        </Button>
        <Button variant="ghost" className="h-8 w-8 p-0" onClick={onCancel}>
            <X size={14} className="text-gray-400" />
        </Button>
      </div>
    </div>
  );
}