// src/app/(dashboard)/[slug]/chat/_components/chat-input.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  sendMessage: (query: string, tags?: string[]) => void;
  isLoading: boolean;
}

export function ChatInput({ sendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input, []); // Sending empty tags array
    setInput("");
  };

  return (
    <div className="p-6 bg-transparent">
      <form 
        onSubmit={handleSubmit} 
        className="relative group bg-white dark:bg-zinc-900 rounded-2xl shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800 transition-all focus-within:ring-zinc-300 dark:focus-within:ring-zinc-700"
      >
        <Textarea
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[60px] w-full resize-none border-0 bg-transparent pr-14 py-4 focus-visible:ring-0 shadow-none text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="absolute right-3 bottom-3 size-9 rounded-xl transition-all"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
      <p className="text-[10px] text-center text-muted-foreground mt-3 opacity-60">
        AI-generated content may be inaccurate.
      </p>
    </div>
  );
}