// src/app/(dashboard)/[slug]/chat/_components/chat-messages.tsx
import { useEffect, useRef } from "react";
import { Message } from "../_types";
import { ChatMessageItem } from "./chat-message-item";
import { Sparkles } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="size-16 rounded-3xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
            <Sparkles className="size-8 text-zinc-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">Chat Bot</h3>
            <p className="text-sm text-muted-foreground max-w-[280px] mt-2">
              Query your data using natural language. Detailed context will appear in the debug panel.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {messages.map((m, i) => (
            <ChatMessageItem
              key={m.id}
              message={m}
              isLoading={isLoading}
              isLastMessage={i === messages.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}