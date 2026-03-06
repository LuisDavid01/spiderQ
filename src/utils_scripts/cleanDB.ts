import { getDB } from "../memory";
import { v4 as uuidv4 } from "uuid";

async function cleanJsonDatabase() {
	const db = await getDB();
	db.data = {
		messages: [],
		summary: "",
		sessionId: '',
	};
	console.log("Cleaning json database...\n")
	db.write();
	console.log("Database cleaned!\n")
	console.log("New session id: ", db.data.sessionId)



}

await cleanJsonDatabase()
