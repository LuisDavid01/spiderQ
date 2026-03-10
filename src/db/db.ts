import * as schema from './schema'
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";


const client = createClient({ url: 'file:./main.db' })
export const db = drizzle(client, { schema })



