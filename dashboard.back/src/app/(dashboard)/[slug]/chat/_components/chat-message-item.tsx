import { useState, useEffect } from "react";
import { Message } from "../_types";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageItemProps {
  message: Message;
  isLoading: boolean;
  isLastMessage: boolean;
}

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor((ms % 1000) / 100); 
  return `${seconds.toString().padStart(2, '0')}.${milliseconds}s`;
}

export function ChatMessageItem({ message, isLoading, isLastMessage }: ChatMessageItemProps) {
  const isAssistant = message.role === "assistant";
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isAssistant && isLastMessage && isLoading) {
      const startTime = Date.now();
      const timerId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 50);
      
      return () => clearInterval(timerId);
    }
  }, [isLoading, isLastMessage, isAssistant]);

  return (
    <div className={cn("flex items-end gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-md mb-1">
          <Bot className="size-4" />
        </div>
      )}

      <div className={cn("max-w-[85%] flex flex-col", isAssistant ? "items-start" : "items-end")}>
        <div className={cn(
          "px-4 py-3 shadow-sm",
          isAssistant
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-bl-none ring-1 ring-zinc-100 dark:ring-zinc-800"
            : "bg-zinc-900 text-zinc-50 rounded-2xl rounded-br-none"
        )}>
          <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content || (isAssistant && isLoading ? "..." : "")}
            </ReactMarkdown>
          </div>
        </div>
        
        {isAssistant && elapsedTime > 0 && (
          <div className="flex items-center gap-1.5 mt-2 px-1 text-[10px] text-muted-foreground tracking-widest opacity-70">
            {isLoading && isLastMessage && (
              <span className="relative flex h-1.5 w-1.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-500"></span>
              </span>
            )}
            <span>{formatTime(elapsedTime)}</span>
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-zinc-200 mb-1">
          <User className="size-4 text-zinc-600" />
        </div>
      )}
    </div>
  );
}