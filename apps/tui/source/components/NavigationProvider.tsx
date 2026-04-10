import { useInput } from 'ink';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getConfig, updateConfig } from "@spiderq/core/config";
import type { Config } from "@spiderq/core/types";

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
	refreshConfig: () => Promise<void>;
	handleSaveLocalUrl: (url: string) => void;
};

const NavigationContext = createContext<NavigationContext | null>(null);

function getProviderIndex(provider: string): number {
	const idx = PROVIDERS.findIndex(p => p.id === provider);
	return idx >= 0 ? idx : 0;
}

export function NavigationProvider({children}: {children: ReactNode}) {
	const [screen, setScreen] = useState<Screen>('home');
	const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);
	const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(0);
	const [editingLocalUrl, setEditingLocalUrl] = useState(false);
	const [localUrlInput, setLocalUrlInput] = useState('');
	const [currentConfig, setCurrentConfig] = useState<Config | null>(null);

	const refreshConfig = useCallback(async () => {
		const config = await getConfig();
		setCurrentConfig(config);
		setSelectedProviderIndex(getProviderIndex(config.provider));
		setLocalUrlInput(config.localUrl || '');
		const provider = PROVIDERS[getProviderIndex(config.provider)];
		if (provider.models.length > 0) {
			const modelIdx = provider.models.indexOf(config.model);
			setSelectedModelIndex(modelIdx >= 0 ? modelIdx : 0);
		} else {
			setSelectedModelIndex(null);
		}
	}, []);

	const handleSaveModel = useCallback(async (providerId: Provider, model: string) => {
		await updateConfig({ provider: providerId, model });
		setScreen('home');
	}, []);

	const handleSaveLocalUrl = useCallback(async (url: string) => {
		await updateConfig({ provider: 'local', localUrl: url });
		setScreen('home');
		setEditingLocalUrl(false);
	}, []);

	useEffect(() => {
		if (screen === 'models') {
			refreshConfig();
		}
	}, [screen, refreshConfig]);

	useInput((input, key) => {
		if (key.meta && input === 'h') {
			setScreen('home');
		}
		if (key.meta && input === 'm') {
			setScreen('models');
			setEditingLocalUrl(false);
		}
		if (key.meta && input === 's') setScreen('settings');

		// Cuando se está editando la URL local, no procesar teclas globales para evitar interferencia con TextInput
		if (editingLocalUrl) {
			if (key.escape) {
				setEditingLocalUrl(false);
				setLocalUrlInput(currentConfig?.localUrl || '');
				return;
			}
			// No procesar meta keys mientras se edita la URL
			return;
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
					handleSaveModel(provider.id, model);
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
				refreshConfig,
				handleSaveLocalUrl,
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