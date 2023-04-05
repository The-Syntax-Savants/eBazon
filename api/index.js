import express from "express";
import jwt from "jsonwebtoken";
const { getUserById } = require("../db/users");
const { JWT_SECRET } = process.env;
const apiRouter = express.Router();
apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "Server is healthy" });
  } catch (error) {
    next(error);
  }
});

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      if (id) {
        req.user = await getUserById(id);
        if (req.user) {
          console.log("User is set:", req.user);
        }
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const productsRouter = require("./products");
apiRouter.use("/products", productsRouter);

const cartsRouter = require("./carts");
apiRouter.use("/carts", cartsRouter);

const tagsRouter = require("./tags");
apiRouter.use("/tags", tagsRouter);

module.exports = apiRouter;
