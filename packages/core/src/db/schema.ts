import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const chats = sqliteTable("chats", {
	id: integer("id").primaryKey({autoIncrement: true}),
	summary: text("summary"),
	title: text("title"),
	createdAt: integer("created_at", {mode: "timestamp"}),
})
export const messages = sqliteTable("messages", {
	id: integer("id").primaryKey({autoIncrement: true}),
	role: text("role"),
	chatId: integer("chat_id")
	.notNull()
	.references(() => chats.id, { onDelete: "cascade" }),
	data: text("data").notNull(),
	createdAt: integer("created_at", {mode: "timestamp"}),
})

export const experiments = sqliteTable("experiments", {
	id: integer("id").primaryKey({autoIncrement: true}),
	name: text("name"),
	sets: integer("sets"),
	createdAt: integer("created_at", {mode: "timestamp"}),

})

export const sets = sqliteTable("sets", {
	id: integer("id").primaryKey({autoIncrement: true}),
	experimentId: integer("experiment_id")
		.notNull()
		.references(() => experiments.id, { onDelete: "cascade" }),
	runs: integer("runs"),
	score: integer("score"),
	createdAt: integer("created_at", {mode: "timestamp"}),

})

export const runs = sqliteTable("runs", {
	id: integer("id").primaryKey({autoIncrement: true}),
	setId: integer("set_id")
		.notNull()
		.references(() => sets.id, { onDelete: "cascade" }),
	input: text("input"),
	output: text("output"),
	expected: text("expected"),
	scores: integer("scores"),
	createdAt: integer("created_at", {mode: "timestamp"}),

})

export const scores = sqliteTable("scores", {
	id: integer("id").primaryKey({autoIncrement: true}),
	runId: integer("run_id")
		.notNull()
		.references(() => runs.id, { onDelete: "cascade" }),
	name: text("name"),
	score: integer("score"),
})


export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, { fields: [messages.chatId], references: [chats.id] }),
}));

export const setsRelations = relations(sets, ({ one }) => ({
  experiment: one(experiments, { fields: [sets.experimentId], references: [experiments.id] }),
}));

export const runsRelations = relations(runs, ({ one }) => ({
  set: one(sets, { fields: [runs.setId], references: [sets.id] }),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
  run: one(runs, { fields: [scores.runId], references: [runs.id] }),
}));

