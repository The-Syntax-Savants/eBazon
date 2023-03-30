const express = require("express");
const server = express();
require("dotenv").config();
const { client } = require("./db");
const PORT = 3000;


const morgan = require("morgan");
server.use(morgan("dev"));

const cors = require("cors");
server.use(cors()); 

server.use(express.json());

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
    
    next();
});

const apiRouter = require("./api");
server.use("/api", apiRouter);

// 404 handler
app.get("*", (req, res) => {
    res.status(404).send({
      name: "404 - Not Found",
      message: "No route found for the requested URL",
    });
  });
  
  // error handling middleware
  app.use((error, req, res, next) => {
    console.error("SERVER ERROR: ", error);
    if (res.statusCode < 400) res.status(500);
    res.send({ name: error.name, message: error.message });
  });

client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});