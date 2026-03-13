import { Box } from "ink";
import { useNavigation } from "./components/NavigationProvider.js";
import { HomeScreen } from "./components/HomeScreen.js";
import { Models } from "./components/Models.js";
import { Settings } from "./components/Settings.js";

export function Routing() {
	const {screen} = useNavigation();
	return (
		<Box>
			{screen === 'home' && <HomeScreen />}
			{screen === 'models' && <Models />}
			{screen === 'settings' && <Settings />}
		</Box>
	);
}
