import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import { client } from "./db/index.js";
import morgan from "morgan";
import apiRouter from "./api/index.js";
const server = express();
const PORT = 3001;

morgan.token("body", (req) => JSON.stringify(req.body));
const customMorganFormat =
  ":method :url HTTP/:http-version :status :res[content-length] - :response-time ms :body";

client.connect();

server.use(morgan(customMorganFormat));

server.use(cors());

// server.use((req, res, next) => {
//   console.log("<____Body Logger START____>");
//   console.log(req.body);n
//   console.log("<_____Body Logger END_____>");

//   next();
// });
server.use(express.json());

server.use("/api", apiRouter);

// 404 handler
server.get("*", (req, res) => {
  res.status(404).send({
    name: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

// error handling middleware
server.use((error, req, res, next) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({ name: error.name, message: error.message });
});

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});
