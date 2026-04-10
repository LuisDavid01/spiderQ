import { Box, Text } from "ink";
import { useNavigation } from "./NavigationProvider";
import { useConfig } from "../hooks/useConfig";
import { VERSION } from "../ascii";

interface HeaderProps {
  showBanner?: boolean;
  columns: number;
}

export function Header({ showBanner = false, columns }: HeaderProps) {
  const { navigate } = useNavigation();
  const { config } = useConfig();

  const modelInfo = config ? `${config.provider}:${config.model}` : 'loading...';

  return (
    <Box flexDirection="column">

      <Box
        flexDirection="row"
        borderStyle="single"
        borderTop={false}
        borderLeft={false}
        borderRight={false}
        borderBottom={true}
        paddingX={1}
      >
        <Box>
          <Text color="green">●</Text>
          <Text> </Text>
          <Text bold>{`${modelInfo} spiderQ ${VERSION}`}</Text>
        </Box>
        <Box flexGrow={1} />
        <Box gap={2}>
          <Text dimColor>[<Text color="yellow">alt+m</Text>]models</Text>
          <Text dimColor>[<Text color="yellow">alt+s</Text>]settings</Text>
        </Box>
      </Box>
    </Box>
  );
}
