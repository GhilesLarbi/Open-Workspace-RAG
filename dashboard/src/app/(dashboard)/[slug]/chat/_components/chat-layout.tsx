// src/app/(dashboard)/[slug]/chat/_components/chat-layout.tsx
"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ChatInterface } from "./chat-interface";
import { DebugPanel } from "./debug-panel";
import { Message, DocumentDebug } from "../_types";

interface ChatLayoutProps {
  messages: Message[];
  sendMessage: (query: string, tags?: string[]) => void;
  isLoading: boolean;
  currentDebugInfo: DocumentDebug[] | null;
}

export function ChatLayout({ 
  messages, 
  sendMessage, 
  isLoading, 
  currentDebugInfo 
}: ChatLayoutProps) {
  return (
    <ResizablePanelGroup  className="flex-1 w-full">
      
      <ResizablePanel 
        defaultSize={35} 
        minSize={25} 
        className="bg-zinc-100/50 dark:bg-zinc-900/30 rounded-3x"
      >
        <DebugPanel debugInfo={currentDebugInfo} isLoading={isLoading} />
      </ResizablePanel>

      <ResizableHandle 
        withHandle 
        className="mx-2 w-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border-none hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" 
      />

      <ResizablePanel 
        defaultSize={65} 
        minSize={40} 
        className="bg-zinc-50/50 dark:bg-zinc-900/30 rounded-3xl"
      >
        <ChatInterface
          messages={messages}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}