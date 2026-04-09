import { useInput } from 'ink';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { setConfig, GlobalConfig } from "@spiderq/core/config";

type Screen = 'home' | 'models' | 'settings';

type Provider = 'openai' | 'openrouter' | 'local';

const PROVIDERS: {id: Provider; name: string; models: string[]}[] = [
	{id: 'openai', name: 'OpenAI', models: ['gpt-5-nano', 'gpt-5.4-nano']},
	{id: 'openrouter', name: 'OpenRouter', models: ['google/gemma-4-31b-it:free']},
	{id: 'local', name: 'Local', models: []},
];

type NavigationContext = {
	screen: Screen;
	navigate: (screen: Screen) => void;
	selectedProviderIndex: number;
	selectedModelIndex: number | null;
	providers: typeof PROVIDERS;
	setSelectedProviderIndex: (index: number) => void;
	setSelectedModelIndex: (index: number | null) => void;
	editingLocalUrl: boolean;
	setEditingLocalUrl: (editing: boolean) => void;
	localUrlInput: string;
	setLocalUrlInput: (url: string) => void;
};

const NavigationContext = createContext<NavigationContext | null>(null);

export function NavigationProvider({children}: {children: ReactNode}) {
	const [screen, setScreen] = useState<Screen>('home');
	const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);
	const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(0);
	const [editingLocalUrl, setEditingLocalUrl] = useState(false);
	const [localUrlInput, setLocalUrlInput] = useState(GlobalConfig.localUrl || '');

	useInput((input, key) => {
		if (key.meta && input === 'h') {
			setScreen('home');
			setSelectedProviderIndex(0);
			setSelectedModelIndex(null);
		}
		if (key.meta && input === 'm') {
			setScreen('models');
			setEditingLocalUrl(false);
		}
		if (key.meta && input === 's') setScreen('settings');

		if (screen === 'models' && editingLocalUrl) {
			if (key.escape) {
				setEditingLocalUrl(false);
				setLocalUrlInput(GlobalConfig.localUrl || '');
				return;
			}

			if (key.return) {
				setConfig({...GlobalConfig, provider: 'local', localUrl: localUrlInput});
				setScreen('home');
				setEditingLocalUrl(false);
				return;
			}

			if (key.backspace) {
				setLocalUrlInput((prev: string) => prev.slice(0, -1));
				return;
			}

			if (input) {
				setLocalUrlInput((prev: string) => prev + input);
				return;
			}
		}

		if (screen === 'models' && !editingLocalUrl) {
			if (key.escape) {
				setScreen('home');
				setEditingLocalUrl(false);
				return;
			}

			// ← → para cambiar de proveedor
			if (key.leftArrow) {
				setSelectedProviderIndex((prev) => Math.max(0, prev - 1));
				setSelectedModelIndex(null);
			}
			if (key.rightArrow) {
				setSelectedProviderIndex((prev) => Math.min(PROVIDERS.length - 1, prev + 1));
				setSelectedModelIndex(null);
			}

			// ↑ ↓ para navegar modelos dentro del proveedor
			if (key.upArrow) {
				if (selectedModelIndex === null) {
					setSelectedModelIndex(0);
				} else {
					setSelectedModelIndex((prev) => Math.max(0, (prev ?? 1) - 1));
				}
			}

			if (key.downArrow) {
				const provider = PROVIDERS[selectedProviderIndex];
				if (selectedModelIndex === null) {
					setSelectedModelIndex(0);
				} else if (provider.models.length > 0) {
					setSelectedModelIndex((prev) => Math.min(provider.models.length - 1, (prev ?? 0) + 1));
				}
			}

			if (key.return || input === ' ') {
				const provider = PROVIDERS[selectedProviderIndex];
				if (provider.id === 'local') {
					setEditingLocalUrl(true);
					return;
				}
				if (selectedModelIndex === null && provider.models.length > 0) {
					setSelectedModelIndex(0);
				} else if (selectedModelIndex !== null) {
					const model = provider.models[selectedModelIndex];
					setConfig({...GlobalConfig, provider: provider.id, model});
					setScreen('home');
					setSelectedProviderIndex(0);
					setSelectedModelIndex(null);
				}
			}
		}
	});

	return (
		<NavigationContext.Provider
			value={{
				screen,
				navigate: setScreen,
				selectedProviderIndex,
				selectedModelIndex,
				providers: PROVIDERS,
				setSelectedProviderIndex,
				setSelectedModelIndex,
				editingLocalUrl,
				setEditingLocalUrl,
				localUrlInput,
				setLocalUrlInput,
			}}
		>
			{children}
		</NavigationContext.Provider>
	);
}

export function useNavigation() {
	const ctx = useContext(NavigationContext);
	if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
	return ctx;
}