import { db } from "./db";
import { chats } from "./schema";

await db.insert(chats).values({
  id: 1,
  summary: "",
  title: "Chat inicial",
  createdAt: new Date(),
}).onConflictDoNothing();

console.log("mock data inserted");
