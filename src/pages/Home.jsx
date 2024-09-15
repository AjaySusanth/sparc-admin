import { useNavigate } from "react-router-dom"
import { useAuth } from "../libs/helper/AuthContext"
import { supabase } from "../libs/helper/supabaseClient"
import { useEffect, useState } from "react"

const Home = () => {

  const {user,loading:authLoading} = useAuth()
  const navigate = useNavigate()
  const [loading,setLoading] = useState(true)

/*
  useEffect(()=>{
    console.log(user)
    if(user!==undefined){
      setLoading(false)
    }
  },[user])*/

  useEffect(()=>{
    console.log(user)
    if(!authLoading)
      setLoading(false)
  },[authLoading])


  const handleLogout = async() => {
    try {
      const { error } = await supabase.auth.signOut(); 
      if (error) throw error;
      else console.log("Logout successfull")
    } catch (error) {
      console.log(error)
      console.error(error.meessage)
    }
  }

  const handleSignup = ()=> {
    navigate('/signup',{state:{toRegister:false}})
  }

  const handleRegister = () => {
    if (user) {
      navigate('/register')
    }
    else {
      navigate('/signup',{state:{toRegister:true}})
    }
  }

  if (loading) return <p>Loading....</p>

  return (
    <div className="flex flex-col justify-center items-center">
        <div className="flex gap-x-5 my-5">
            
            {
              user ?
              <button className="border p-2" onClick={handleLogout}>Logout</button>
              :
              <button className="border p-2" onClick={handleSignup}>Signup</button>
            }
        </div>

        <button onClick={handleRegister}>Register</button>
    </div>

  )
}
export default Home