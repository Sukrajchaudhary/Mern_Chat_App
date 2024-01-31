import React, { useContext, createContext, useState, useEffect } from "react";
const ConversationContext = createContext();

export const useConversation = () => {
  return useContext(ConversationContext);
};
export const ConversationProvider = ({ children }) => {
  const [conversation, setConversation] = useState(null);
  const [newconversatioonid, setnewconversatioonid] = useState();
  const createConversation = async (id, auth) => {
    try {
      const senderId = auth?.id;
      const receiverId = id;
      const response = await fetch("http://localhost:8080/api/Conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ senderId, receiverId }),
      });
      if (response.ok) {
        const result = await response.json();
        setnewconversatioonid(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchUserConversations = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/Conversations`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversation(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        conversation,
        setConversation,
        createConversation,
        newconversatioonid,
        setnewconversatioonid,
        fetchUserConversations
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
