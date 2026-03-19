"use client";

import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Message } from "../_types";

interface ChatInterfaceProps {
  messages: Message[];
  sendMessage: (query: string, tags?: string[]) => void;
  isLoading: boolean;
}

export function ChatInterface({ messages, sendMessage, isLoading }: ChatInterfaceProps) {
  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput sendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}