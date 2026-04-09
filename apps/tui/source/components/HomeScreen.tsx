import { Box } from "ink";
import { useMessages } from "../hooks/useMessage";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Header } from "./Header";

interface HomeScreenProps {
  columns: number;
  rows: number;
}

export function HomeScreen({ columns, rows }: HomeScreenProps) {
  const INPUT_HEIGHT = 3;
  const BANNER_HEIGHT = 6;
  const HEADER_INFO_HEIGHT = 2;
  const reservedHeight = INPUT_HEIGHT + BANNER_HEIGHT + HEADER_INFO_HEIGHT;
  const availableRows = rows - reservedHeight;
  const { messages, loading, error, addMessage } = useMessages();

  if (loading) {
    return (
      <Box width={columns} height={rows} alignItems="center" justifyContent="center">
        <Box>
          <Header showBanner={true} columns={columns} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box width={columns} height={rows} alignItems="center" justifyContent="center">
        <Box>
          <Header showBanner={true} columns={columns} />
        </Box>
      </Box>
    );
  }

  return (
    <Box width={columns} height={rows} flexDirection="column">
      <Header showBanner={true} columns={columns} />
      <Box flexGrow={1} flexDirection="column" height={availableRows}>
        <MessageList messages={messages} rows={availableRows} />
      </Box>
      <MessageInput addMessage={addMessage} />
    </Box>
  );
}