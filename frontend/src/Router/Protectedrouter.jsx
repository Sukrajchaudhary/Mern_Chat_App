import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/Authcontext';
const Protectedrouter = ({children}) => {
const {auth}=useAuthContext()

 if(!auth){
    return <Navigate to="/Login" replace={true}></Navigate>
 }
 return children
}

export default Protectedrouter
