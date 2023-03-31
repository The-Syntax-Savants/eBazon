const {Client} = require("pg")
// const {DATABASE_URL} = process.env

const client = new Client("postgres://localhost:5432/eBazon")

module.exports = {
    client
}
