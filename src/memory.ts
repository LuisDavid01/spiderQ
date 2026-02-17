import { JSONFilePreset } from "lowdb/node";
import type { AIMessage } from "../types";
import { v4 as uuidv4 } from "uuid";
import { summarizeMessages } from "./llm";


// por ahora la base de datos para la memoria es
// en memoria con lowdb
// luego podriamos cambiarlo a una base de datos real
export type MessageWithMetadata = AIMessage & {
	id: string
	createdAt: string
}

type Data = {
	messages: MessageWithMetadata[]
	summary: string
}

export const addMetadata = (message: AIMessage) => {
	return {
		...message,
		id: uuidv4(),
		createdAt: new Date().toLocaleString(),
	}
}


export const removeMetadata = (message: MessageWithMetadata) => {
	const { id, createdAt, ...rest } = message
	return rest
}


const defaultData: Data = {
	messages: [],
	summary: '',
}


export const getDB = async () => {
	const db = await JSONFilePreset<Data>('db.json', defaultData);
	return db
}

export const addMessage = async (message: AIMessage[]) => {
	const db = await getDB()
	db.data.messages.push(...message.map(addMetadata));

	// cada 10 mensajes, actualiza un resumen de la conversación
	if (db.data.messages.length % 10 === 0) {
		const oldestMessage = db.data.messages.slice(0, 5).map(removeMetadata)
		const summary = await summarizeMessages(oldestMessage)
		db.data.summary = summary
	}
	await db.write();

}

export const getAllMessages = async () => {
	const db = await getDB()
	return db.data.messages.map(removeMetadata)

}

export const getMessages = async () => {
	const db = await getDB()
	const messages = db.data.messages.map(removeMetadata)
	const lastFive = messages.slice(-5)

	if (lastFive[0]?.role === 'tool') {
		const sixMessage = messages[messages.length - 6]
		if (sixMessage) {
			return [sixMessage, ...lastFive]
		}
	}
	return lastFive
}

export const saveToolResponse = async (
	toolCallId: string,
	toolResponse: string
) => {
	return await addMessage([
		{ role: 'tool', content: toolResponse, tool_call_id: toolCallId },
	])
}

export const getSummary = async () => {
	const db = await getDB()
	return db.data.summary
}
