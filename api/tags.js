const express = require("express");
const { requireUser, requireAdmin } = require("./utils.js");
const {createTag, getAllTags} = require("../db/tags.js")

const tagsRouter = express.Router();

tagsRouter.use((req, res, next)=>
{
    console.log("A request is being made to /tags");

    next();
});

// GET /api/users/
tagsRouter.get("/", requireUser, async (req, res)=>
{
    const tags = await getAllTags();

    res.send({
        tags 
    });
});

tagsRouter.post("/", requireAdmin, async (req,res,next) => {
    try {
        const {name} = req.body
        console.log(name, "!!!!!!")
        if(name.length > 1){
            const tag = await createTag(name)
            res.send(tag)
        }else{
            next({
                name: "CreateTagError",
                message: "Tag name must be at least 2 characters"
            })
        }

    } catch ({name, message}) {
        next({name, message})
    }
})

module.exports = tagsRouter