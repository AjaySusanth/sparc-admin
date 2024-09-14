import { useEffect, useState} from "react"
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { supabase } from "../libs/helper/supabaseClient"

const Login = () => {

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

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError(null)
        try {
            const {data,error} = await supabase.auth.signInWithPassword({
                email:email,
                password:password
            })

            if(error) throw error;

            isRegisterIntent ? navigate('/register') : navigate('/')

        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }

    const googleSignIn = async(e) => {
        e.preventDefault()
        setError(null)
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                        redirectTo: isRegisterIntent
                            ? "https://sparc-admin.vercel.app/register"
                            :  "https://sparc-admin.vercel.app/"
                }
            })

            if (error) throw error;


        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }

    console.log(isRegisterIntent)


  return (
    <div className="ml-3">
        <h1 className="text-4xl text-blue-800">Login</h1>
        <div>
            <form className="flex flex-col mt-2" onSubmit={handleSubmit}>
                <label>Email</label>
                <input className="border w-40 p-2 mb-2" type="email" placeholder="Enter your email"
                onChange={(e)=>setEmail(e.target.value)}/>
                <label>Password</label>
                <input type="password" className="border w-40 p-2 mb-2" placeholder="Enter password"
                onChange={(e)=>setPassword(e.target.value)}/>
                <div className="flex gap-x-5">
                    <button type="submit" className="border p-2">Login</button>
                    <button type="button" onClick={googleSignIn} className="border p-2">Login with google</button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
            </form>
            <p>Don't' have an account? <Link to='/signup'>Sign up</Link></p>
        </div>
    </div>
  )
}
export default Login