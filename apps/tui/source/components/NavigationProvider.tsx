import {useInput} from 'ink';
import {createContext, useContext, useState, type ReactNode} from 'react';

type Screen = 'home' | 'models' | 'settings';

type NavigationContext = {
	screen: Screen;
	navigate: (screen: Screen) => void;
};

const NavigationContext = createContext<NavigationContext | null>(null);

export function NavigationProvider({children}: {children: ReactNode}) {
	const [screen, setScreen] = useState<Screen>('home');

	useInput((input, key) => {
		if (key.meta && input === 'h') setScreen('home');
		if (key.meta && input === 'm') setScreen('models');
		if (key.meta && input === 's') setScreen('settings');
	});

	return (
		<NavigationContext.Provider value={{screen, navigate: setScreen}}>
			{children}
		</NavigationContext.Provider>
	);
}

export function useNavigation() {
	const ctx = useContext(NavigationContext);
	if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
	return ctx;
}
