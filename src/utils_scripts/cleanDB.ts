import { getDB } from "../memory";

async function cleanJsonDatabase() {
	const db = await getDB();
	db.data.messages = []
	console.log("Cleaning json database...\n")
	db.write();
	console.log("Database cleaned!\n")



}

await cleanJsonDatabase()
