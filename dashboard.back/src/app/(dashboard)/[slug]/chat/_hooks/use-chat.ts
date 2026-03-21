import { useState, useCallback } from "react";
import { Message, DocumentDebug, SSEStreamPayload } from "../_types";
import { useWorkspaces } from "@/hooks/use-workspaces";

interface AskApiPayload {
  query: string;
  tags: string[];
  debug: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDebugInfo, setCurrentDebugInfo] = useState<DocumentDebug[] | null>(null);
  const { activeWorkspace } = useWorkspaces();

  const sendMessage = useCallback(async (query: string, tags: string[] = []) => {
    if (!query.trim() || !activeWorkspace?.api_key) return;

    setCurrentDebugInfo(null);
    setIsLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const assistantMessageId = crypto.randomUUID();
    setMessages((prev) => [...prev, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
      debug: [],
    }]);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const url = `${baseUrl}/chat/ask/stream`;

      const payload: AskApiPayload = { query, tags, debug: true };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": activeWorkspace.api_key,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";
      let debugInfoReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n\n").filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.replace("data: ", "").trim();
              if (!jsonStr) continue;
              
              const data = JSON.parse(jsonStr) as SSEStreamPayload;
              
              if (!debugInfoReceived && data.debug && data.debug.length > 0) {
                setCurrentDebugInfo(data.debug);
                
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, debug: data.debug } : msg
                  )
                );
                debugInfoReceived = true;
              }

              if (data.content) {
                accumulatedContent += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId ? { ...msg, content: accumulatedContent } : msg
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing SSE chunk:", e, "Chunk:", line);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Sorry, an error occurred." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeWorkspace]);

  return {
    messages,
    sendMessage,
    isLoading,
    currentDebugInfo,
  };
}