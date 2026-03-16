import { Box, Text, useInput, useStdout } from "ink";
import { useState, useMemo, useEffect, useRef } from "react";
import type { AIMessage } from "@spiderq/core/types";
import { ScrollView, type ScrollViewRef } from "ink-scroll-view";

function estimateMessageHeight(text: string, terminalWidth: number): number {
  const lines = text.split("\n");
  return lines.reduce((acc, line) => {
    return acc + Math.max(1, Math.ceil(line.length / terminalWidth));
  }, 2); // +2 por padding top/bottom
}

function AssistantMessage({ content }: { content: string }) {
  return (
    <Box flexDirection="column" paddingY={1}>
      <Box gap={1}>
        <Text color="green" bold>
          ●
        </Text>
        <Text color="green" dimColor>
          assistant
        </Text>
      </Box>
      <Box marginLeft={2}>
        <Text wrap="wrap">{content}</Text>
      </Box>
    </Box>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <Box flexDirection="column" paddingY={1}>
      <Box gap={1}>
        <Text color="cyan" bold>
          ▸
        </Text>
        <Text color="cyan" dimColor>
          user
        </Text>
      </Box>
      <Box marginLeft={2}>
        <Text color="white" wrap="wrap">
          {content}
        </Text>
      </Box>
    </Box>
  );
}

function ToolMessage({
  content,
  tool_call_id,
}: {
  content: string;
  tool_call_id: string;
}) {
  return (
    <Box flexDirection="column" paddingY={1}>
      <Box gap={1}>
        <Text color="yellow">⚙</Text>
        <Text color="yellow" dimColor>
          tool
        </Text>
        <Text dimColor>· {tool_call_id}</Text>
      </Box>
      <Box marginLeft={2}>
        <Text dimColor wrap="wrap">
          {content}
        </Text>
      </Box>
    </Box>
  );
}


function MessageItem({ message }: { message: AIMessage }) {
  switch (message.role) {
    case "assistant":
      return (
        <AssistantMessage content={message.content as string} />
      );
    case "user":
      return <UserMessage content={message.content} />;
    case "tool":
      return (
        <ToolMessage
          content={message.content}
          tool_call_id={message.tool_call_id}
        />
      );
  }
}


interface MessageListProps {
  messages: AIMessage[];
  rows: number;
}

export function MessageList({ messages, rows }: MessageListProps) {
  const { stdout } = useStdout();
  const scrollRef = useRef<ScrollViewRef>(null);

  useEffect(() => {
    const handleResize = () => scrollRef.current?.remeasure();
    stdout?.on("resize", handleResize);
    return () => { stdout?.off("resize", handleResize); };
  }, [stdout]);

  useEffect(() => {
    scrollRef.current?.scrollToBottom();
  }, [messages.length]);

  useInput((_, key) => {
    if (key.upArrow)   scrollRef.current?.scrollBy(-1);
    if (key.downArrow) scrollRef.current?.scrollBy(1);
    if (key.pageUp) {
      const height = scrollRef.current?.getViewportHeight() ?? 1;
      scrollRef.current?.scrollBy(-height);
    }
    if (key.pageDown) {
      const height = scrollRef.current?.getViewportHeight() ?? 1;
      scrollRef.current?.scrollBy(height);
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1}>
      {/* Header */}
      <Box
        paddingX={1}
        borderStyle="single"
        borderTop={false}
        borderLeft={false}
        borderRight={false}
        borderBottom={true}
      >
        <Text bold>messages</Text>
        <Box flexGrow={1} />
        <Text dimColor>{messages.length} total</Text>
      </Box>

      {/* Scroll area */}
      <Box flexGrow={1} flexDirection="column">
        <ScrollView ref={scrollRef}>
          <Box flexDirection="column" paddingX={1}>
            {messages.length === 0 ? (
              <Box paddingY={1}>
                <Text dimColor>No hay mensajes aún.</Text>
              </Box>
            ) : (
              messages.map((message, index) => (
                <MessageItem key={index} message={message} />
              ))
            )}
          </Box>
        </ScrollView>
      </Box>

      {/* Footer */}
      <Box
        paddingX={1}
        borderStyle="single"
        borderTop={true}
        borderBottom={false}
        borderLeft={false}
        borderRight={false}
        gap={2}
      >
        <Text dimColor>↑↓ scroll</Text>
        <Text dimColor>pgup/pgdn jump</Text>
      </Box>
    </Box>
  );
}
