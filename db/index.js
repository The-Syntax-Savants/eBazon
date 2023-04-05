import pkg from "pg";
const { Client } = pkg;
// const {DATABASE_URL} = process.env

export const client = new Client(
  process.env.DATABASE_URL || "postgres://localhost:5432/eBazon"
);
