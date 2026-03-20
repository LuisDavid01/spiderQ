import fs from 'fs/promises'
import { homedir } from 'os'
import path from 'path'
import type { Config } from 'types'

const defaultConfig: Config = {
	apiKey: '',
	model: 'gpt-5-nano',
	maxTokens: 5000,
	spiderqApiKey: '',
	provider: 'openai',
	localUrl: 'http://localhost:11434/v1',
}


export let GlobalConfig: Config = defaultConfig

export async function getConfig(): Promise<Config> {
	const configPath = path.join(homedir(),'.spiderq')
	await fs.mkdir(configPath, { recursive: true })

	const configFilePath = path.join(configPath, 'config.json')
	let configFile: Config
	try {
		const fileContent = await fs.readFile(configFilePath, 'utf-8')
		configFile = JSON.parse(fileContent)
	}catch(e){
		await fs.writeFile(configFilePath, JSON.stringify(defaultConfig))
		configFile = defaultConfig
	}

	return configFile
}

export async function setConfig(config: Config) {
	const configFilePath = path.join(homedir(),'.spiderq','config.json')
	await fs.writeFile(configFilePath, JSON.stringify(config))
}

export async function loadConfig(config?: Config) {
	console.log('Loading config...')
	if (!config) {
	GlobalConfig = await getConfig()
	} else {
		await setConfig(config)
		GlobalConfig = config
	}
	console.log('Config loaded:', GlobalConfig)
}
