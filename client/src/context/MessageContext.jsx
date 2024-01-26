import React, { createContext, useContext, useState } from "react";
const MessageContext = createContext();

export const useMessage = () => {
  return useContext(MessageContext);
};

export const MessageProvider = ({ children }) => {
  const [usermessage, setuserMessage] = useState();
  const fetchUserMessage = async (conversationid) => {

    try {
      const response = await fetch(
        `http://localhost:8080/api/getmessage/${conversationid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setuserMessage(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <MessageContext.Provider value={{ usermessage,fetchUserMessage, setuserMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
