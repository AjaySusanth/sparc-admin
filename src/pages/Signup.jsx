import { useState } from "react"
import { supabase } from "../libs/helper/supabaseClient"
import {Link} from 'react-router-dom'
const Signup = () => {

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState(null)
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
                provider: 'google'
              })
        } catch (error) {
            
        }
        console.log('Google sign up')
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
                <p>Already have an account? <Link to='/login'>Login</Link></p> 
          </div>
      </div>
    )
  }
  export default Signup