import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { neon } from '@neondatabase/serverless'
import { drizzle as neonHttp } from 'drizzle-orm/neon-http'
import * as schema from './schema'

function createDB() {
  const neonDBUrl = process.env.NEON_DB_URL

  if (neonDBUrl) {
    const client = neon(neonDBUrl)
    return neonHttp(client, { schema, logger: false })
  } else {
    const queryClient = process.env.DATABASE_URL!
    return drizzle(queryClient, { schema, logger: true })
  }
}

const db = createDB()

export default db
