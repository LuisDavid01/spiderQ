import { eq, desc, asc } from "drizzle-orm";
import type { AIMessage } from "../types";
import { summarizeMessages } from "./llm";
import { db } from "./db/db";
import { messages, chats } from "./db/schema";

export type MessageWithMetadata = AIMessage & {
	id: string;
	createdAt: Date;
};

export const addMetadata = (message: AIMessage) => {
	return {
		...message,
		createdAt: new Date(),
	};
};

export const removeMetadata = (message: MessageWithMetadata) => {
	const { id, createdAt, ...rest } = message;
	return rest;
};

const ensureChatExists = async () => {
	const existingChat = await db.query.chats.findFirst({
		where: eq(chats.id, 1),
	});

	if (!existingChat) {
		await db.insert(chats).values({
			id: 1,
			summary: "",
			title: "Chat inicial",
			createdAt: new Date(),
		});
	}
};

export const addMessage = async (message: AIMessage[]) => {
	await ensureChatExists();

	const messagesWithMeta = message.map(addMetadata);

	await db.insert(messages).values(
		messagesWithMeta.map((msg) => ({
			role: msg.role,
			chatId: 1,
			data: JSON.stringify(msg),
			createdAt: msg.createdAt,
		}))
	);

	const allMessages = await db.query.messages.findMany({
		where: eq(messages.chatId, 1),
		orderBy: [asc(messages.id)],
	});

	if (allMessages.length > 0 && allMessages.length % 10 === 0) {
		const oldestFive = allMessages.slice(0, 5).map((m) => {
			const parsed = JSON.parse(m.data) as MessageWithMetadata;
			return removeMetadata(parsed);
		});
		const summary = await summarizeMessages(oldestFive);
		await db.update(chats).set({ summary }).where(eq(chats.id, 1));
	}
};

export const getAllMessages = async () => {
	await ensureChatExists();
	const allMessages = await db.query.messages.findMany({
		where: eq(messages.chatId, 1),
		orderBy: [asc(messages.id)],
	});

	return allMessages
		.map((m) => JSON.parse(m.data) as MessageWithMetadata)
		.map(removeMetadata);
};

export const getMessages = async () => {
	await ensureChatExists();
	const lastsix = await db.query.messages.findMany({
		where: eq(messages.chatId, 1),
		orderBy: [desc(messages.id)],
		limit: 6,
	});

	const parsedMessages = lastsix
		.map((m) => JSON.parse(m.data) as MessageWithMetadata)
		.map(removeMetadata)
		.reverse();


	const lastFive = parsedMessages.slice(-5);

		if (lastFive[lastFive.length - 1]?.role === "tool") {
			return parsedMessages;
		}
	return lastFive;
};

export const saveToolResponse = async (
	toolCallId: string,
	toolResponse: string
) => {
	return await addMessage([
		{ role: "tool", content: toolResponse, tool_call_id: toolCallId },
	]);
};

export const getSummary = async () => {
	const chat = await db.query.chats.findFirst({
		where: eq(chats.id, 1),
	});
	return chat?.summary ?? "";
};

export const getSessionId = async () => {
	return 1;
};
