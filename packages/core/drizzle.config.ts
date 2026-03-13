import { type Config } from "drizzle-kit";
import { join } from "node:path";

export default {
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: `file:${join(__dirname, "src/db/main.db")}`,
  },
} satisfies Config;
