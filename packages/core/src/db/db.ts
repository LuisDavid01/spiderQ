import * as schema from './schema'
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { join } from "path";

const client = createClient({ url: `file:${join(import.meta.dir, "main.db")}` });
export const db = drizzle(client, { schema })



