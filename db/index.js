const {Client} = require("pg")
// const {DATABASE_URL} = process.env

const client = new Client(process.env.DATABASE_URL || "postgres://localhost:5432/eBazon")

module.exports = {
    client
}
