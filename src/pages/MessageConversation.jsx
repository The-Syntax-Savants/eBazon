import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

import { getConversationDB } from "../api-adapters/messages";

const MessageConversation = () => {
  const [conversation, setConversation] = useState([]);
  const info = useParams();
  console.log(info, "INFO");
  const fetchConversation = async () => {
    const data = await getConversationDB(info);
    setConversation(data);
    console.log(data);
  };
  useEffect(() => {
    fetchConversation();
  }, []);
  return (
    <div className="h-screen w-[98vw]">
      {conversation.length ? (
        <div className="ml-10 mr-10">
          {conversation.map((message, idx) => {
            if (message.sender_name !== localStorage.getItem("username")) {
              return (
                <div className="chat chat-start">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                  </div>
                  <div className="chat-header">
                    {message.sender_name}
                    <time className="text-xs opacity-50">12:45</time>
                  </div>
                  <div className="chat-bubble">{message.message}</div>
                  <div className="chat-footer opacity-50">Delivered</div>
                </div>
              );
            } else {
              return (
                <div className="chat chat-end">
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                  </div>
                  <div className="chat-header">
                    {message.sender_name}
                    <time className="text-xs opacity-50">12:46</time>
                  </div>
                  <div className="chat-bubble">{message.message}</div>
                  <div className="chat-footer opacity-50">Seen at 12:46</div>
                </div>
              );
            }
          })}
        </div>
      ) : (
        <h3>
          There is no conversation history for these users on this product
        </h3>
      )}
    </div>
  );
};

export default MessageConversation;
