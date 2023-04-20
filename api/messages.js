import express from "express";
import { requireUser } from "./utils.js";
import { createMessage, getAllUnreadMessagesByUsername } from "../db/messages.js";

export const messagesRouter = express.Router()
export default messagesRouter

messagesRouter.use((req, res, next) => {
    console.log("A request is being made to /messages");
  
    next();
  });

  //Create a new message
  messagesRouter.post("/:productId", requireUser, async(req,res,next)=> {
    try {
        const {productId} = req.params
        const info = req.body
        info.productId = Number(productId)
        if(info.senderName){
            console.log(info, "THIS IS INFO")
            const newMessage = await createMessage(info)
            if(newMessage.receiver_name){
                res.send(newMessage)
            }else{
                next({
                    name: "createMessageError",
                    message: "There was an error creating a message"
                })
            }
        }
        
    } catch ({name, message}) {
        next({name, message})
    }
    
  })

  //Get All Unread Messages By Username
  messagesRouter.get("/:username", requireUser, async(req,res,next)=> {
    try {
        const {username} = req.params
        const messages = await getAllUnreadMessagesByUsername(username)
        if(messages.length){
            res.send(messages)
        }else if(messages.length === 0 && !messages.name){
            res.send("This user has no messages")
        }else{
            next({
                name: "UserDoesNotExistError",
                message: "This user does not exist"
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
  })