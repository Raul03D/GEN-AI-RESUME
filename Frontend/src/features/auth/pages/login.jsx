import React,{useState} from 'react'
import "../auth.form.scss"
import { useNavigate,Link } from "react-router"
import {useAuth} from "../hooks/useAuth"


const Login = () => {

    const {loading,handlelogin}= useAuth()
    const navigate = useNavigate()

    const [email,setEmail]= React.useState("")
    const [password,setPassword]= React.useState("")

    const handleSubmit= async (e)=>{
        e.preventDefault()
        if (!email.trim() || !password.trim()) {
            return
        }
        const success = await  handlelogin({email,password})
        if (success) {
            navigate("/")
        }

    }



  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit} className="f">
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e)=>{setEmail(e.target.value)}}
                    value={email}
                    required
                    className="inputs" type="email" id="email" name="email" placeholder="Enter your email"/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e)=>{setPassword(e.target.value)}}
                    value={password}
                    required
                    className="inputs"type="password" id="password" name="password" placeholder="Enter your password"/>
                </div>
                <button className="button primary-button" type="submit" disabled={loading}>
                    {loading ? "loading..." : "Login"}
                </button>
            </form>
            
            <p>Don't have an account? <Link to={"/register"}>Sign up</Link></p>
        </div>
    </main>
  )
}

export default Login