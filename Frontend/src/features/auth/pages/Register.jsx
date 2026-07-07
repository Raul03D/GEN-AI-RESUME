import React, { useState } from 'react'
import "../auth.form.scss"
import {useNavigate,Link} from "react-router"
import {useAuth} from "../hooks/useAuth"

const Register = () => {

  const navigate = useNavigate()
  const [username,setUsername]=useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState()

  const {loading,handleregister} = useAuth()

    const handleSubmit= async (e)=>{
        e.preventDefault()
        await handleregister({username,email,password})
        navigate("/")
    }

    if(loading){
        return (<main><h1>Loading......</h1></main>)
    }

  return (  
    <main>
        <div className="form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit} className="f">

                   <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input 
                    onChange={(e)=>{setUsername(e.target.value)}}
                    className="inputs" type="username" id="username" name="usernsme" placeholder="Enter your username"/>
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=>{setEmail(e.target.value)}}
                    className="inputs" type="email" id="email" name="email" placeholder="Enter your email"/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e)=>{setPassword(e.target.value)}}
                    className="inputs"type="password" id="password" name="password" placeholder="Enter your password"/>
                </div>
                <button className="button primary-button" type="submit">Register</button>
            </form>
            
            <p>Already have a account? <Link to={"/login"}>Log in </Link></p>
        </div>
    </main>
  )
}

export default Register