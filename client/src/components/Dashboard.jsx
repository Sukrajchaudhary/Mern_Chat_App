import React, { useEffect, useState } from "react";
import { useUser } from "../context/Usercontext";
import { useConversation } from "../context/ConversationContext";
import { useMessage } from "../context/MessageContext";
import { useAuthContext } from "../context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:8080";
let socket;
const Dashboard = () => {
  const [onlineUser, setonlineUser] = useState(null);
  const { user } = useUser();
  const { usermessage, setuserMessage, fetchUserMessage } = useMessage([]);
  const [info, setInfo] = useState({
    userid: "",
    conversationId: "",
  });
  const { auth } = useAuthContext();
  const {
    conversation,
    createConversation,
    newconversatioonid,
    fetchUserConversations,
  } = useConversation();
  const [getallusers, setAllusers] = useState(null);
  const [createMessage, setcreateMessage] = useState({
    message: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    setcreateMessage({ ...createMessage, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchUserConversations();
  }, []);

  // get all user
  const getAllusers = async (e) => {
    try {
      const response = await fetch("http://localhost:8080/api/getUsers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        setAllusers(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllusers();
  }, []);

  const getinfo = (userid, conversationid) => {
    setInfo({ ...info, userid: userid, conversationId: conversationid });
  };

  const userMessage = async () => {
    try {
      const senderId = auth?.id;
      const message = createMessage?.message;
      const conversationId = info?.conversationId
        ? info?.conversationId
        : newconversatioonid?._id;
      const receiverId = info?.userid;
      socket.emit("sendMessages", {
        senderId,
        message,
        conversationId,
        receiverId,
      });
      const response = await fetch("http://localhost:8080/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ senderId, message, conversationId, receiverId }),
      });

      if (response.ok) {
        const result = await response.json();

        toast.success(result.message, {
          position: "top-center",
          autoClose: 1000,
        });

        // Corrected line to clear the input field
        setcreateMessage({ message: "" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
  }, []);
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", auth?.id);
    socket.on("getOnlineUsers", (res) => {
      setonlineUser(res);
    });
  }, [socket]);
  useEffect(() => {
    if (socket === null) {
      return;
    } else {
      socket.on("getMessage", (res) => {
        if (res?.message) {
          setuserMessage((prev) => [...prev, res]);
        }
      });
    }
  }, [socket]);
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r border-gray-300">
          {/* Sidebar Header */}
          <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
            <h1 className="text-2xl font-semibold">Chat Web</h1>
            <div className="relative">
              <button id="menuButton" className="focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </header>
          {/* user profile */}
          <div className=" h-6 p-3 mb-9 pb-20 bg-green-800">
            <div className="flex items-center mb-4 cursor-pointer  p-2 rounded-md">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                <img
                  src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">
                  {auth?.username}
                </h2>
              </div>
            </div>
          </div>
          {/* end of user profile */}
          {/* Contact List */}
          <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
            {conversation?.map((conversation, index) => (
              <div
                onClick={() => fetchUserMessage(conversation.conversationid)}
                className={`flex items-center mb-4 cursor-pointer p-2 rounded-md`}
                key={index}
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                  <img
                    src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  {onlineUser?.map((user) => {
                    if (user.userId === conversation.userid) {
                      return (
                        <div className="border-2 border-black rounded-full h-4 w-4 bg-green-500 relative bottom-[20%] left-1"></div>
                      );
                    }
                  })}
                </div>
                <div
                  onClick={() =>
                    getinfo(conversation.userid, conversation.conversationid)
                  }
                  className="flex-1"
                >
                  <h2 className="text-lg font-semibold">
                    {conversation.username}
                  </h2>
                  <p className="text-gray-600">Hooray!!</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1">
          {/* Chat Header */}
          <header className="bg-red-300 p-4 text-gray-700">
            <h1 className=" font-semibold">Sukraj</h1>
          </header>
          {/* Chat Messages */}
          <div className="h-screen overflow-y-auto p-4 pb-36">
            {/* Incoming Message */}

            {usermessage?.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.senderId !== auth?.id &&
                  message?.senderId !== message?.receiverId
                    ? "flex justify-start mb-8 cursor-pointer"
                    : "flex justify-end  mb-8 cursor-pointer relative "
                }`}
              >
                <div className="w-9 h-9 rounded-full flex  items-center justify-center ml-2 relative">
                  <img
                    src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                    alt="My Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </div>

                <div
                  className={`${
                    message.senderId !== auth?.id
                      ? "flex max-w-96 bg-black text-white rounded-lg p-3 gap-3"
                      : "flex max-w-96 bg-blue-900 text-white rounded-lg p-3 gap-3"
                  }`}
                >
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/6">
            <div className="flex items-center">
              <input
                onChange={(e) => handleChange(e)}
                type="text"
                value={createMessage.message}
                name="message"
                placeholder="Type a message..."
                className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => userMessage()}
                disabled={createMessage.message === "" ? true : false}
                className="bg-indigo-500 text-white px-7 py-2 rounded-md ml-2"
              >
                Send
              </button>
            </div>
          </footer>
        </div>
        {/* End of main chat area */}

        {/*  starts of All users */}
        <div className="w-1/5 bg-black text-white border-r border-gray-300">
          <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
            <h1 className="text-2xl font-semibold">All Users</h1>
            <div className="relative">
              <button id="menuButton" className="focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-100"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                </svg>
              </button>
            </div>
          </header>
          <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
            {getallusers
              ?.filter((u) => u._id !== auth?.id)
              .map((users, index) => (
                <div
                  onClick={() => createConversation(users._id, auth)}
                  key={index}
                  className="flex items-center mb-4 cursor-pointer p-2 rounded-md"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3  ">
                    <img
                      src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    {onlineUser?.map((user) => {
                      if (user.userId === users._id) {
                        return (
                          <div className="border-2 border-black rounded-full h-4 w-4 bg-green-500 relative bottom-[20%] left-1"></div>
                        );
                      }
                    })}
                    {/* <div className="border-2 border-black rounded-full h-4 w-4 bg-green-500 relative bottom-[20%] left-1"></div> */}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{users.username}</h2>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Dashboard;
