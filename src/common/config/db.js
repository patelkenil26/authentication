import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
const client = global._postgresClient || postgres(connectionString, { max: 10 });

if (process.env.NODE_ENV !== 'production') {
  global._postgresClient = client
}

export const db = drizzle(client);

const connectDB = async () => {
  console.log("Connecting to POstgres Database...");
  try {
    await client`SELECT 1`;
    console.log("Database connected Successfully")
  } catch (error) {
    console.log("Error connecting to Database", error)
    process.exit(1) // Exit with failure code
  }
};

export default connectDB;