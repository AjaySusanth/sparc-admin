import { useEffect, useState } from 'react'
import qr from '../assets/qrcode.jpg'
import { supabase } from '../libs/helper/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../libs/helper/AuthContext'
import useMediaQuery from '../libs/helper/MediaQuery'

const Register = () => {



  const navigate = useNavigate()
  const [isRegistered,setIsRegistered] = useState(false)
  const [isVerified,setIsVerified] = useState(false)
  const [loading,setLoading] = useState(true)
  const [file,setFile] = useState(null)
  const UPI_LINK = 'upi://pay?pa=8943460250@ptsbi&pn=AjaySusanth&am=100&cu=INR&tn=Sparc%20Registration%20Fee'


  const isMobile = useMediaQuery('(max-width:768px')


  const [formData,setFormData] = useState({
    name:'',
    class:'',
    ticket:'',
  })

  const {user,loading:authLoading} = useAuth()
  const checkRegistration = async() => {
  try {
    const {data,error} = await supabase
    .from('registrations')
    .select('*')
    .eq('user_id',user.id)

    if(error) {
      console.log("Error fetching registration data",error)
      return;
    }

    if (data.length>0) {
      setIsRegistered((data[0].registered))
      setIsVerified((data[0].verified))
    }
  } catch (error) {
    console.error("Unexpected error",error.message)
  }
  finally {
    setLoading(false)
  }

}
  const handleChange = (e) =>{
    const {name,value} = e.target
    setFormData({...formData,[name]:value})
  }

  const handleFileChange = async(e) => {
    const file = e.target.files[0]
    setFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let screenshotURL = null

    if(file) {
      const fileExtension = file.name.split('.').pop()
      const fileName = `${user.email}_${user.id}.${fileExtension}`

  
      const {data:uploadData,error:uploadError} = await supabase
      .storage
      .from('screenshots')
      .upload(fileName,file)

      if(uploadError) {
        console.log('Fileupload error',uploadError)
        return;
      }

      screenshotURL = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName)
      .data
      .publicUrl

      console.log(screenshotURL)
    } 
    try {
      const {data,error} = await supabase
      .from('registrations')
      .insert([
        {
          name:formData.name,
          class:formData.class,
          ticket:formData.ticket,
          email:user.email,
          screenshotURL:screenshotURL,
          registered:true
        }
      ])
      .select()

      if(error) {
        console.log(error)
      }
      else{
        console.log("Registered successfully",data)
        setIsRegistered(true)
      }
      

    } catch (error) {
      console.error("Submission error",error)
    }
  }

  useEffect(()=>{
    if(!user && !authLoading){
      navigate('/login')
    }
    else if (user)
    {
      console.log(user)
      checkRegistration()
    }
  },[user,authLoading])

  if (loading) return <p>Loading.....</p>
  if(isVerified) return <p>Already Verified</p>
  if(isRegistered) return <p>Already Registered</p>



  return (
    <form className="flex flex-col justify-center items-center mt-16" onSubmit={handleSubmit}>

      <label>Name</label>
      <input
      type="text"
      name='name'
      onChange={handleChange}
      value={formData.name}
      className="border w-60 mb-3"/>

      <label>Class</label>
      <input 
      type="text"
      name='class'
      placeholder='eg: S3 AI'
      value={formData.class}
      onChange={handleChange}
      className="border w-60 mb-3"/>

      <label>Ticket</label>
      <select
      name='ticket'
      value={formData.ticket}
      onChange={handleChange}
      className="w-60 mb-3 outline-none">
        <option value="" disabled default>Select Ticket Type</option>
        <option value="ieee">ieee</option>
        <option value="non-ieee-mace">non ieee maceian</option>
        <option value="non-ieee">non ieee</option>
      </select>

      <label>QR CODE</label>
      <div className="relative">
        <img src={qr} className="size-52" alt="QR Code" />
        {isMobile && (
          <button
            type="button"
            onClick={() => window.open(UPI_LINK, '_blank')}
            className="border p-2"
            aria-label="UPI Payment"
          >Pay via UPI APP</button>
        )}
      </div>

      <label>Add screenshot</label>   
      <input type="file" name="screenshot" accept="image/*" onChange={handleFileChange} />
         
      <button type="submit" className="border w-32 mt-3">Submit</button>
    </form>
  )
}
export default Register
