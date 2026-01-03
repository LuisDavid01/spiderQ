import { JSONFilePreset } from "lowdb/node";
import type { AIMessage } from "../types";
import { v4 as uuidv4 } from "uuid";


// por ahora la base de datos para la memoria es
// en memoria con lowdb
// luego podriamos cambiarlo a una base de datos real
export type MessageWithMetadata = AIMessage & {
	id: string
	createdAt: string
}

type Data = {
	messages: MessageWithMetadata[]
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
}


export const getDB = async () => {
	const db = await JSONFilePreset<Data>('db.json', defaultData);
	return db
}

export const addMessage = async (message: AIMessage[]) => {
	const db = await getDB()
	db.data.messages.push(...message.map(addMetadata));
	await db.write();

}

export const getMessages = async () => {
	const db = await getDB()
	return db.data.messages.map(removeMetadata)

}

export const saveToolResponse = async (
	toolCallId: string,
	toolResponse: string
) => {
	return await addMessage([
		{ role: 'tool', content: toolResponse, tool_call_id: toolCallId },
	])
}


