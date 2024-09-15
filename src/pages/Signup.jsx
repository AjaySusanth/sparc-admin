import { useState,useEffect } from "react"
import { supabase } from "../libs/helper/supabaseClient"
import {Link, useLocation, useNavigate} from 'react-router-dom'
const Signup = () => {

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState(null)
    const [isRegisterIntent, setIsRegisterIntent] = useState(false);    
    const location = useLocation()
    const navigate = useNavigate() 
    
    useEffect(() => {
    if (location.state?.toRegister) {
        setIsRegisterIntent(location.state.toRegister);
    }
    }, [location]);

    const handleOnClickLogin = ()=> {
        if(isRegisterIntent) {
            navigate('/login',{state:{toRegister:true}})
        }
        else {
            navigate('/login',{state:{toRegister:false}})
        }
    }



    const handleSubmit = async(e) => {
        e.preventDefault()
        setError(null)
        try {
            const {data,error} = await supabase.auth.signUp({
                name:name,
                email:email,
                password:password,
                options:{
                    data: {
                        name:name
                    }
                }
            })
                if(error){
                    throw error;
                }

                isRegisterIntent ? navigate('/register') : navigate('/')

                if (data){
                    console.log("Sign up")
                }
            
        } catch (error) {

            console.log(error)
            setError(error.message)
        }
    }

    const googleSignup = async(e) => {
        e.preventDefault()
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: isRegisterIntent
                        ?   "https://sparc-admin.vercel.app/register" // "http://localhost:5173/register"
                        :"https://sparc-admin.vercel.app/" //"http://localhost:5173/"
            }
              })
        } catch (error) {
            
        }
        console.log('Google sign up')
        console.log("Registerintent",isRegisterIntent)
    }

    return (
      <div className="ml-3">
          <h1 className="text-4xl text-blue-800">Signup</h1>
          <div>
              <form className="flex flex-col mt-2" onSubmit={handleSubmit}>
                <label>Name</label>
                <input className="border w-40 p-2 mb-2" type="text" placeholder="Enter your name"
                onChange={(e)=>setName(e.target.value)}/>
                  <label>Email</label>
                  <input className="border w-40 p-2 mb-2" type="email" placeholder="Enter your email"
                  onChange={(e)=>setEmail(e.target.value)}/>
                  <label>Password</label>
                  <input type="password" className="border w-40 p-2 mb-2" placeholder="Enter password"
                  onChange={(e)=>setPassword(e.target.value)}/>
                  <div className="flex gap-x-5">
                      <button type="submit" className="border p-2">Signup</button>
                      <button type="button" onClick={googleSignup} className="border p-2">Signup with google</button>
                  </div>
                  {error && <p className="text-red-500">{error}</p>}
              </form>
                <p onClick={handleOnClickLogin}>Already have an account?{" "}Login</p> 
          </div>
      </div>
    )
  }
  export default Signup