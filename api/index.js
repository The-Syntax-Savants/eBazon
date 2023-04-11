import jwt from "jsonwebtoken";
import express from "express";
import { getUserById } from "../db/users.js";
import usersRouter from "./users.js";
import productsRouter from "./products.js";
import cartsRouter from "./carts.js";
import tagsRouter from "./tags.js";
import stripeRouter from "./stripe.js";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

export const apiRouter = express.Router();
export default apiRouter;

apiRouter.get("/health", async (req, res, next) => {
  try {
    res.send({ message: "Server is healthy" });
  } catch (error) {
    next(error);
  }
});

// apiRouter.use(async (req, res, next) => {
//   const prefix = "Bearer ";
//   const auth = req.header("Authorization");

//   if (!auth) {
//     next();
//   } else if (auth.startsWith(prefix)) {
//     const token = auth.slice(prefix.length);
//     try {
//       const { id } = jwt.verify(token, JWT_SECRET);
//       if (id) {
//         req.user = await getUserById(id);
//         if (req.user) {
//           console.log("User is set:", req.user);
//         }
//         next();
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   } else {
//     next({
//       name: "AuthorizationHeaderError",
//       message: `Authorization token must start with ${prefix}`,
//     });
//   }
// });

apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    console.log("Token received:", token);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      console.log("User ID from token:", id); // Add this line
      if (id) {
        req.user = await getUserById(id);
        if (req.user) {
          console.log("User is set:", req.user);
        } else {
          console.log("User not found with id:", id); // Add this line
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

apiRouter.use("/users", usersRouter);

apiRouter.use("/products", productsRouter);

apiRouter.use("/carts", cartsRouter);

apiRouter.use("/tags", tagsRouter);

apiRouter.use("/stripe", stripeRouter);
