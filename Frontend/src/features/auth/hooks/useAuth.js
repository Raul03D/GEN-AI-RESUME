import {useContext,useEffect} from "react"
import {AuthContext} from "../auth.context.jsx"
import {login,register,logout,getMe} from "../services/auth.api";

export const useAuth = () =>{

    const context=useContext(AuthContext)
    const {user,setUser,loading,setLoading}=context

    const handlelogin = async ({email,password})=>{
        setLoading(true)
        try{

     const data =  await login({email,password})

     if (data && data.user) {
        setUser(data.user)
        return true
     }
     return false
        }catch(err){
            return false
        }
        finally{
        setLoading(false)
        }    
    }

    const handleregister = async ({username,email,password})=>{
        setLoading(true)
        try{
        const data = await register({username,email,password})
        setUser(data.user)
        }catch(err){

        }
        finally{
        setLoading(false)
        }
    }

    const handlelogout = async ()=>{
        setLoading(true)
        try{
            const data = await logout()
            setUser(null)
        }catch(err){

        }
        finally{
            setLoading(false)
        }
    }

        useEffect(()=>{

        const getAndSetUser = async ()=>{
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                }
            } catch(err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    },[])

    return {
        user,
        loading,
        handleregister,
        handlelogin,
        handlelogout
    }
}
