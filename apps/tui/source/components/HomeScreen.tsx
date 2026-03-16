import { Box, Text } from "ink";
import { useMessages } from "../hooks/useMessage";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

export function HomeScreen() {
  const { messages, loading, error, addMessage } = useMessages();

  if (loading) {
    return (
      <Box paddingX={1}>
        <Text dimColor>Loading messages...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box paddingX={1}>
        <Text color="red">Error: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <MessageList messages={messages} />
      <MessageInput addMessage={addMessage} />
    </Box>
  );
}
