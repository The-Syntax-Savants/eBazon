import express from "express";
import { requireUser, requireAdmin } from "./utils.js";
import { createTag, getAllTags } from "../db/tags.js";

export const tagsRouter = express.Router();
export default tagsRouter;

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

// GET /api/users/
tagsRouter.get("/", requireUser, async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log(name, "!!!!!!");
    if (name.length > 1) {
      const tag = await createTag(name);
      res.send(tag);
    } else {
      next({
        name: "CreateTagError",
        message: "Tag name must be at least 2 characters",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
