import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { useState } from "react";
import type { AIMessage } from "@spiderq/core/types";
import { useRunAgent } from "../hooks/useRunAgent";

interface MessageInputProps {
  addMessage: (message: AIMessage) => void;
}

export function MessageInput({ addMessage }: MessageInputProps) {
  const [text, setText] = useState("");
  const { run, loading, error } = useRunAgent(addMessage);

  async function handleSubmit(value: string) {
    if (!value.trim() || loading) return;
    setText("");
    await run(value);
  }

  return (
    <Box flexDirection="column" minHeight={3}>
      {error && (
        <Box paddingX={1}>
          <Text color="red">Error: {error.message}</Text>
        </Box>
      )}
      <Box
        borderStyle="single"
        borderTop={true}
        borderBottom={false}
        borderLeft={false}
        borderRight={false}
        paddingX={1}
        gap={1}
      >
        {loading ? (
          <Text color="yellow" dimColor>● thinking...</Text>
        ) : (
          <Text color="cyan">▸</Text>
        )}
        <TextInput
          value={text}
          onChange={setText}
          onSubmit={handleSubmit}
          placeholder={loading ? "" : "Type a message..."}
          focus={!loading}
        />
      </Box>
    </Box>
  );
}
