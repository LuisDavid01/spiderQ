import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const messages = sqliteTable("messages", {
	id: integer("id").primaryKey({autoIncrement: true}),
	role: text("role"),
	chatId: integer("chat_id")
	.notNull()
	.references(() => chats.id, { onDelete: "cascade" }),
	data: text("data").notNull(),
	createdAt: integer("created_at", {mode: "timestamp"}),
})

export const chats = sqliteTable("chats", {
	id: integer("id").primaryKey({autoIncrement: true}),
	summary: text("summary"),
	title: text("title"),
	createdAt: integer("created_at", {mode: "timestamp"}),
})

export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, { fields: [messages.chatId], references: [chats.id] }),
}));

