import { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Protectedrouter from "./Router/Protectedrouter";
import ModalComponent from "./components/ModalComponent";
import { useAuthContext } from "./context/Authcontext";
import { useUser } from "./context/Usercontext";
function App() {
  const { auth, setauth } = useAuthContext();
  const {user}=useUser()
  const CheckAuth = async () => {
  
  try {
    
    const response = await fetch("http://localhost:8080/api/checkAuth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const doc = await response.json();
      setauth(doc);
    }
    else{
      const error= await response.json()
      setauth(error.success)
    }
  
  } catch (error) {
   console.log(error)
  
  }
    
  };
  useEffect(() => {
    CheckAuth(); // Fix: Correct the function name to CheckAuth
  }, [user]);
  
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Protectedrouter>
          <Dashboard></Dashboard>
        </Protectedrouter>
      ),
    },
    {
      path: "/Login",
      element: <Login></Login>,
    },
    {
      path: "/Signup",
      element: <Signup></Signup>,
    },
  ]);
  return <>

 { auth &&(<RouterProvider router={router} />)
}
  </>;
}

export default App;
