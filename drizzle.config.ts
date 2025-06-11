import { defineConfig } from 'drizzle-kit'
import { join } from 'node:path'

export default defineConfig({
  dialect: 'sqlite',
  schema: './utils/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: `file:${join(process.cwd(), 'data', 'db.sqlite')}`,
  },
  verbose: true,
  strict: true,
}) 