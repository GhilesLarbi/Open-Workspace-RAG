"use client";

import { useChat } from "./_hooks/use-chat";
import { ChatLayout } from "./_components/chat-layout";

export default function ChatPage() {
  const { messages, sendMessage, isLoading, currentDebugInfo } = useChat();

  return (
    <div className="flex flex-col h-[calc(100vh-154px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">AI Chat</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Interact with your workspace data using RAG.
        </p>
      </div>
      
      <ChatLayout 
        messages={messages}
        sendMessage={sendMessage}
        isLoading={isLoading}
        currentDebugInfo={currentDebugInfo}
      />
    </div>
  );
}