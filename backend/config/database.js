import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// export const db = new Pool({
//     user: process.env.user,
//     host: process.env.host,
//     password: process.env.password,
//     database: process.env.database,
//     port: process.env.port,
// });

export const db = new Pool({
  connectionString: process.env.string,
});

export default db;