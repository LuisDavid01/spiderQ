import { type Config } from "drizzle-kit";
import { homedir } from "node:os";
import { join } from "node:path";

export default {
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${join(homedir(),".spiderq", "main.db")}`,
  },
} satisfies Config;
