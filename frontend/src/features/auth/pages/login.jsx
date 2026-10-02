import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const {loading, handleLogin} = useAuth();
 const navigate = useNavigate()
 const location = useLocation()
const [email, setEmail] = useState("")
const [password,setPassword] = useState("")
const [loginError, setLoginError] = useState("")

const handleSubmit = async (e) => {
    e.preventDefault()
     setLoginError("")
     try {
        await handleLogin({email,password})
        navigate('/')
     } catch (error) {
        setLoginError(error.response?.data?.message || error.message || "Unable to sign in. Please try again.")
     }
}
if(loading){
    return (<main><h1>Loading.....</h1></main>)
}

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                {location.state?.message && <p role="status">{location.state.message}</p>}
                {loginError && <p role="alert">{loginError}</p>}

                <form onSubmit={handleSubmit}>

               <div className="input-group">
                <label htmlFor="email">Email</label>
                <input 
                onChange={(e) =>  setEmail (e.target.value)}
                type = "email" name ='email'
                 placeholder = 'Enter email address'/>
                 </div>
                 <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                onChange ={(e) =>  setPassword (e.target.value)}
                 type ="password" id="password" name='password' placeholder='enter password'/>
               </div>
              <button className='button primary-button'>Login</button>
                </form>
               <p>Dont't have an acount? <Link to={"/register"}>Register</Link></p>


                </div>
        </main>
    )
}

export default Login;