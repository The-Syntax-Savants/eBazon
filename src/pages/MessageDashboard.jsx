import React, { useEffect, useState } from "react";

import { getAllUnreadMessagesForUserDB } from "../api-adapters/messages";
import { getProductByIdDB } from "../api-adapters/products";
import { useParams } from "react-router";

const MessageDashboard = () => {
  const { username } = useParams();
  const [messages, setMessages] = useState([]);

  const productNameArr = [];
  const senderNameArr = [];

  const getMessages = async () => {
    const data = await getAllUnreadMessagesForUserDB(username);
    if(data !== undefined){
      setMessages(data);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className="overflow-x-auto w-full h-full">
      {messages.length ?
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>Product</th>
            <th>Message</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => {
            console.log(message)
            if (!productNameArr.includes(message.product_name)) {
              senderNameArr.push(message.sender_name)
              productNameArr.push(message.product_name);

              return (
                <tr key={message.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">{message.sender_name}</div>
                        <div className="text-sm opacity-50">United States</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {message.product_name}
                    <br />
                  </td>
                  <td>{message.message}</td>
                  <th>
                    <button className="btn btn-xs">Chat</button>
                  </th>
                </tr>
              );
            }else if (productNameArr.includes(message.product_name) && !senderNameArr.includes(message.sender_name)){
              senderNameArr.push(message.sender_name)
              console.log(senderNameArr)

              return (
                <tr key={message.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-bold">{message.sender_name}</div>
                        <div className="text-sm opacity-50">United States</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {message.product_name}
                    <br />
                  </td>
                  <td>{message.message}</td>
                  <th>
                    <button className="btn btn-xs">chat</button>
                  </th>
                </tr>
              );
            }
          })}
        </tbody>
        {/* foot */}
        <tfoot>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
            <th></th>
          </tr>
        </tfoot>
      </table> : <h3>User: {username} does not exist. Please double check spelling and capitalization.</h3>}
    </div>
  );
};

export default MessageDashboard;
