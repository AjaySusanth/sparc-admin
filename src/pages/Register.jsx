import { useEffect, useState } from 'react'
import qr from  "../assets/qrcode.jpg"
import { supabase } from '../libs/helper/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../libs/helper/AuthContext'
import useMediaQuery from '../libs/helper/MediaQuery'

const ticketOptions = {
  'ieee': {
    qrCode:qr,
    UPI_LINK: 'upi://pay?pa=8943460250@ptsbi&pn=AjaySusanth&am=50&cu=INR&tn=Sparc%20Registration'
  },
  'non-ieee-mace': {
    qrCode: qr,
    UPI_LINK: 'upi://pay?pa=e8943460250@ptsbi&pn=AjaySusanth&am=100&cu=INR&tn=Sparc%20Registration'
  },
  'non-ieee': {
    qrCode: qr,
    UPI_LINK: 'upi://pay?pa=e8943460250@ptsbi&pn=AjaySusanth&am=150&cu=INR&tn=Sparc%20Registration'
  }
}


const Register = () => {

  const navigate = useNavigate()
  const [isRegistered,setIsRegistered] = useState(false)
  const [isVerified,setIsVerified] = useState(false)
  const [loading,setLoading] = useState(true)
  const [file,setFile] = useState(null)
  const [error,setError] = useState("")
  const [qrCode,setQrCode] = useState(null)
  const [upiLink,setUpiLink] = useState(null)

// Custom media query hook
  const isMobile = useMediaQuery('(max-width:768px')


  const [formData,setFormData] = useState({
    name:'',
    class:'',
    ticket:'',
  })

  const {user,loading:authLoading} = useAuth()

  // Checking if user has already registered
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
    setError("Unexpected error,try again later")
  }
  finally {
    setLoading(false)
  }

}
  const handleChange = (e) =>{
    setError("")
    const {name,value} = e.target
    setFormData({...formData,[name]:value})
    if (name === 'ticket') {
      const ticket = ticketOptions[value]
      if(ticket) {
        setQrCode(ticket.qrCode)
        setUpiLink(ticket.UPI_LINK)
      }
    }
  }

  const handleFileChange = async(e) => {
    setError("")
    const file = e.target.files[0]
    setFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let screenshotURL = null
    setError("")
    
    // Form validation
    if (!formData.name || !formData.class || !formData.ticket  || !file)
    {
      setError('Please fill all the fields and upload the screenshot')
      return;
    }

    if(file) {
      const fileExtension = file.name.split('.').pop()
      // creating custom file to access later
      const fileName = `${user.email}_${user.id}.${fileExtension}`

  
      const {data:uploadData,error:uploadError} = await supabase
      .storage
      .from('screenshots')
      .upload(fileName,file)

      if(uploadError) {
        console.log('Fileupload error',uploadError)
        setError("Error uploading screenshot")
        return;
      }

      // Fetching the file link from bucket to add it to the db
      screenshotURL = supabase.storage
      .from('screenshots')
      .getPublicUrl(fileName)
      .data
      .publicUrl

     // console.log(screenshotURL)
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
        setError("Error submitting form,try again later")
        return;
      }
      else{
        console.log("Registered successfully",data)
        setIsRegistered(true)
      }
      

    } catch (error) {
      console.error("Submission error",error)
      setError("Unexpected error,try again later")
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
        {
          qrCode ? <img src={qrCode} className="size-52" alt="QR Code" />
          :
          <div className='size-52 border p-3 flex justify-center items-center'><p>Select ticket to generate qrcode</p></div>
        }
        
        {isMobile && upiLink && (
          <button
            type="button"
            onClick={() => window.open(upiLink, '_blank')}
            className="border p-2"
            aria-label="UPI Payment"
          >Pay via UPI APP</button>
        )}
      </div>

      <label>Add screenshot</label>   
      <input type="file" name="screenshot" accept="image/*" onChange={handleFileChange} />
         
      <button type="submit" className="border w-32 mt-3">Submit</button>
      {
        error && <p className='text-red-600 text-basis'>{error}</p>
      }
    </form>
  )
}
export default Register
