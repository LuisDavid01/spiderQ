import { Box, Text } from "ink";
import { useMessages } from "../hooks/useMessage";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface HomeScreenProps {
  columns: number;
  rows: number;
}

export function HomeScreen({ columns, rows }: HomeScreenProps) {
  const INPUT_HEIGHT = 3;
  const availableRows = rows - INPUT_HEIGHT;
  const { messages, loading, error, addMessage } = useMessages();

  if (loading) {
    return (
      <Box width={columns} height={rows} alignItems="center" justifyContent="center">
        <Text dimColor>Loading messages...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box width={columns} height={rows} alignItems="center" justifyContent="center">
        <Text color="red">Error: {error.message}</Text>
      </Box>
    );
  }

  return (
    <Box width={columns} height={rows} flexDirection="column">
      {/* MessageList ocupa todo el espacio disponible menos el input */}
      <Box flexGrow={1} flexDirection="column" height={availableRows}>
        <MessageList messages={messages} rows={availableRows} />
      </Box>
      {/* Input siempre visible al fondo */}
      <MessageInput addMessage={addMessage} />
    </Box>
  );
}
