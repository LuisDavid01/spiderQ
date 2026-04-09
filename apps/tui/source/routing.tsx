import { Box } from "ink";
import { useNavigation } from "./components/NavigationProvider.js";
import { HomeScreen } from "./components/HomeScreen.js";
import { ModelSelector } from "./components/ModelSelector.js";
import { Settings } from "./components/Settings.js";

interface RoutingProps {
  columns: number;
  rows: number;
}

export function Routing({ columns, rows }: RoutingProps) {
  const { screen } = useNavigation();

  return (
    <Box width={columns} height={rows} flexDirection="column">
      {screen === 'home'     && <HomeScreen columns={columns} rows={rows} />}
      {screen === 'models'   && <ModelSelector />}
      {screen === 'settings' && <Settings />}
    </Box>
  );
}