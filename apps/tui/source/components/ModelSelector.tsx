import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { useNavigation } from "./NavigationProvider";

export function ModelSelector() {
  const {
    selectedProviderIndex,
    selectedModelIndex,
    providers,
    editingLocalUrl,
    localUrlInput,
    setLocalUrlInput,
    handleSaveLocalUrl,
    setEditingLocalUrl,
  } = useNavigation();

  const currentProvider = providers[selectedProviderIndex];

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box paddingY={1}>
        <Text bold>Select Model</Text>
        <Box flexGrow={1} />
        <Text dimColor>[esc] back</Text>
      </Box>

      <Box
        borderStyle="single"
        borderTop={true}
        borderLeft={true}
        borderRight={true}
        borderBottom={true}
      >
        {providers.map((provider, pIdx) => (
          <Box
            key={provider.id}
            flexDirection="column"
            paddingX={1}
            paddingY={0}
            borderStyle="single"
            borderTop={false}
            borderLeft={false}
            borderRight={false}
            borderBottom={provider.id !== 'local'}
          >
            <Box flexDirection="row">
              <Text color={selectedProviderIndex === pIdx ? 'green' : 'dimColor'}>
                {selectedProviderIndex === pIdx ? '●' : '○'}
              </Text>
              <Text> </Text>
              <Text bold={selectedProviderIndex === pIdx}>{provider.name}</Text>
              <Text dimColor>
                {' '}
                -{' '}
                {provider.id === 'openai'
                  ? "OpenAI's latest models"
                  : provider.id === 'openrouter'
                    ? 'Aggregated API with free tier'
                    : 'Ollama or llama.cpp'}
              </Text>
            </Box>

            {selectedProviderIndex === pIdx && (
              <Box flexDirection="column" marginLeft={3}>
                {provider.models.length > 0 ? (
                  provider.models.map((model, mIdx) => (
                    <Box key={model} flexDirection="row">
                      <Text
                        color={
                          selectedModelIndex === mIdx && selectedProviderIndex === pIdx
                            ? 'cyan'
                            : 'dimColor'
                        }
                      >
                        {selectedModelIndex === mIdx && selectedProviderIndex === pIdx
                          ? '▸'
                          : ' '}
                      </Text>
                      <Text
                        color={
                          selectedModelIndex === mIdx && selectedProviderIndex === pIdx
                            ? 'cyan'
                            : 'white'
                        }
                      >
                        {selectedModelIndex === mIdx && selectedProviderIndex === pIdx
                          ? ' ' + model
                          : '  ' + model}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Box flexDirection="column">
                    <Text dimColor>Local URL:</Text>
                    <Box flexDirection="row">
                      <Text color="yellow">{'>'}</Text>
                      <Text> </Text>
                      {editingLocalUrl ? (
                        <Box flexGrow={1}>
                          <TextInput
                            value={localUrlInput}
                            onChange={setLocalUrlInput}
                            onSubmit={handleSaveLocalUrl}
                            placeholder="http://localhost:11434/v1"
                            focus={true}
                          />
                        </Box>
                      ) : (
                        <Text color="white">{localUrlInput || 'not set (press Enter to edit)'}</Text>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Box paddingY={1}>
        {editingLocalUrl ? (
          <Text dimColor>Enter save | Esc cancel</Text>
        ) : (
          <Text dimColor>← → change provider | ↑ ↓ select model | Enter confirm | Esc back</Text>
        )}
      </Box>
    </Box>
  );
}