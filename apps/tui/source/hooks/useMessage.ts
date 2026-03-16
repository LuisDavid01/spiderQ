// hooks/useMessages.ts
import { useState, useEffect } from "react";
import { getAllMessages } from "@spiderq/core";
import type { AIMessage } from "@spiderq/core/types";

interface UseMessagesResult {
  messages: AIMessage[];
  loading: boolean;
  error: Error | null;
  addMessage: (message: AIMessage) => void;
}

export function useMessages(): UseMessagesResult {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMessages() {
      try {
        const data = await getAllMessages();
        if (!cancelled) setMessages(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMessages();
    return () => { cancelled = true; };
  }, []);

  function addMessage(message: AIMessage) {
    setMessages((prev) => [...prev, message]);
  }

  return { messages, loading, error, addMessage };
}
