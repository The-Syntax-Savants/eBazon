import pkg from "pg";
const { Client } = pkg;

export const client = new Client(
  process.env.DATABASE_URL || "postgres://localhost:5432/eBazon"
);
