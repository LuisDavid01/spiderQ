import * as schema from './schema'
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { homedir } from 'os';
import { join } from "path";

const client = createClient({ url: `file:${join(homedir(),".spiderq", "main.db")}` });
export const db = drizzle(client, { schema })



