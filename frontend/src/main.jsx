import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { MessageProvider } from "./context/MessageContext.jsx";
import { UserProvider } from "./context/Usercontext.jsx";
import { ConversationProvider } from "./context/ConversationContext.jsx";
import { SuccessProvider } from "./context/SuccessContext.jsx";
import { AuthProvider } from "./context/Authcontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   
      <AuthProvider>
        <UserProvider>
          <SuccessProvider>
            <MessageProvider>
              <ConversationProvider>
                <App />
              </ConversationProvider>
            </MessageProvider>
          </SuccessProvider>
        </UserProvider>
      </AuthProvider>
   
  </React.StrictMode>
);
