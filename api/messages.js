import express from "express";
import { requireUser } from "./utils.js";
import { getUser } from "../db/users.js"
import {
  createMessage,
  getAllUnreadMessagesByUsername,
  getConversationBetweenUsersForProduct,
  setMessageToRead,
} from "../db/messages.js";

export const messagesRouter = express.Router();
export default messagesRouter;

messagesRouter.use((req, res, next) => {
  console.log("A request is being made to /messages");

  next();
});

//Create a new message
messagesRouter.post("/:productId", requireUser, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const info = req.body;
    info.productId = Number(productId);
    if (!info.offerPrice && req.user.username === info.senderName) {
      const newMessage = await createMessage(info);
      if (newMessage.receiver_name) {
        res.send(newMessage);
      } else {
        next({
          name: "createMessageError",
          message: "There was an error creating a message",
        });
      }
    } 
    // HANDLE OFFERS
    // else if (info.offerPrice && req.user.username === info.senderName) {
    //   const newOffer = await createOffer(info);
    //   if (newOffer.offer_price) {
    //     res.send(newOffer);
    //   } else {
    //     next({
    //       name: "createOfferError",
    //       message: "There was an error creating an offer",
    //     });
    //   }
    // }

    else{
        next({
            name: "userMustBeLoggedInError",
            message: "You are either not logged in, or trying to send a message as a user that is not you"
        })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Get All Unread Messages By Username
messagesRouter.get("/:username", requireUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await getUser(username)
    if(user.username){
      if(req.user.username === username || req.user.is_admin){
          const messages = await getAllUnreadMessagesByUsername(username);
          if (messages.length) {
            res.send(messages);
          } 
      }else{
          next({
              name: "UserMustBeLoggedInError",
              message: "You are either not logged in, or trying to get somebody's messages who is not you."
          })
      }
    }else{
      next({
        name: "UserDoesNotExistError",
        message: `User: ${username} does not exist, please double check spelling and capitalization.`
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Set ALL UNREAD Messages to read by conversation
messagesRouter.post("/read/:productId", requireUser, async(req,res,next) => {
  try {
    const {productId} = req.params
    const data = req.body
    data.productId = productId
    if(data.senderName && data.receiverName){
      const read = await setMessageToRead(data)
      res.send(read)
    }else{
      next({
        name: "NoUserNameError",
        message: "You must pass in 2 usernames in order to know which conversation to mark as read"
      })
    }
  } catch ({name, message}) {
    next({name, message})
  }
})


//Get conversation between 2 users on a product
messagesRouter.get("/conversation/:productId", requireUser, async(req,res,next) => {
    try {
        const {productId} = req.params
        const info = req.body
        info.productId = Number(productId)
        if(req.user.username === info.user1Name || req.user.username === info.user2Name || req.user.is_admin){ 
            const conversation = await getConversationBetweenUsersForProduct(info)
            if(conversation.length){
                res.send(conversation)
            }else{
                next({
                    name: "UsersNoConversationHistoryError",
                    message: "These users do not have a conversation history"
                })
            }
        } else{
            next({
                name: "UserMustBeLoggedIn",
                message: "You are either not logged in, or trying to get somebody's messages who is not you."
            })
        }
        
    } catch ({name, message}) {
        next({name, message})
    }
})
