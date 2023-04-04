const express = require("express");
const { requireUser, requireAdmin } = require("./utils.js");
const {createTag, getAllTags, getTagById, deleteTag, editTag} = require("../db/tags.js")

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

tagsRouter.patch("/:id", requireAdmin, async (req,res,next) => {
    try {
        const {id} = req.params
        const {name} = req.body
        const _tag = await getTagById(id)
        console.log(_tag, "!!!!!")
        if(_tag){
           const tag = await editTag(id, name)
           res.send(tag)
        }else{
            next({
                name: "TagDoesNotExistError",
                message: `Tag with an id of ${id} does not exist`
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
})

tagsRouter.delete("/:id", requireAdmin, async (req,res,next) => {
    try {
        const {id} = req.params
        const _tag = await getTagById(id)
        if(_tag){
            await deleteTag(id)
            res.send(`You have successfully deleted a tag with id: ${id}`)
        }else{
            next({
                name: "TagDoesNotExistError",
                message: `Tag with an id of ${id} does not exist`
            })
        }

    } catch ({name, message}) {
        next({name, message})
    }
})

module.exports = tagsRouter