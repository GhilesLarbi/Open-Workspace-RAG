import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const handleSelect = (ws) => {
    setCurrentWorkspace(ws);
    navigate(`/w/${ws.slug}/settings`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between h-auto py-3 px-2 hover:bg-gray-100 group transition-all">
          <div className="flex flex-col items-start gap-0.5 text-left overflow-hidden">
            <span className="text-sm font-bold text-gray-900 truncate w-full">
              {currentWorkspace?.name || "Select Workspace"}
            </span>
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider truncate w-full">
              {currentWorkspace?.slug || "No workspace"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 ml-2 shadow-xl border-gray-200 p-1" align="start">
        <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1.5">Your Workspaces</DropdownMenuLabel>
        
        <div className="max-h-60 overflow-y-auto">
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              onSelect={() => handleSelect(ws)}
              className={cn(
                "flex flex-col items-start gap-0.5 px-3 py-2 cursor-pointer focus:bg-gray-100",
                currentWorkspace?.id === ws.id && "bg-gray-50 border-l-2 border-black rounded-none"
              )}
            >
              <span className="font-semibold text-sm">{ws.name}</span>
              <span className="text-xs text-gray-500">{ws.url}</span>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem 
          onSelect={() => navigate('/new-workspace')} 
          className="cursor-pointer gap-2 py-2 px-3 text-black font-medium focus:text-black focus:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
          New Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}