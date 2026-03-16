// hooks/useRunAgent.ts
import { useState } from "react";
import type { AIMessage } from "@spiderq/core/types";
import { runAgent, tools } from "@spiderq/core";

interface UseRunAgentResult {
  run: (text: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useRunAgent(
  addMessage: (message: AIMessage) => void
): UseRunAgentResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function run(text: string) {
    if (!text.trim() || loading) return;

    // 1. Agregar mensaje de usuario al estado
    addMessage({ role: "user", content: text });

    setLoading(true);
    setError(null);

    try {
      // 2. Llamar al agente
		const response = await runAgent({userMessage: text, tools});

      // 3. Agregar respuesta del asistente al estado
      addMessage({ role: "assistant", content: response });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }

  return { run, loading, error };
}
