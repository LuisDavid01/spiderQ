import { getDB } from "../memory";
import { v4 as uuidv4 } from "uuid";

async function cleanJsonDatabase() {
	const db = await getDB();
	db.data = {
		messages: [],
		summary: "",
		sessionId: `${Date.now()}${uuidv4()}`,
	};
	console.log("Cleaning json database...\n")
	db.write();
	console.log("Database cleaned!\n")



}

await cleanJsonDatabase()
