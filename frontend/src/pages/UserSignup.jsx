import   { useState } from "react" ;
import {Link , useNavigate} from "react-router-dom" ;
import axios from 'axios' ;
import {useContext} from 'react' ;
import  { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
   const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
 

  const navigate = useNavigate() 

  const {user ,setUser} = useContext(UserDataContext)


  const submitHandler= async(e)=> {
    e.preventDefault()

    const newUser = {
      
        fullname: {
          firstname: firstname,
          lastname: lastname,
                },
        email: email,
        password: password
      }
     
try {
    const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
    )

  
    if (response.status === 201) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token',data.token)
       
        navigate('/home')
    }

    setFirstname("")
    setLastname("")
    setEmail("")
    setPassword("")

} catch (error) {
    console.log("BACKEND ERROR:", error.response?.data)
}
  }
  return (
    <div>
      <div className="p-7 h-screen flex flex-col justify-between">
          <div>
            <img className="w-16 mb-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />
       
              <form onSubmit={(e) => {
            submitHandler(e)
          }}>
              <h3 className="text-lg w-1/2  font-medium mb-2"> What's your name </h3>
              <div className="flex gap-4 mb-7">
                <input
                  className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base" 
                  required
                  value={firstname}
                  onChange={(e)=>{setFirstname(e.target.value)}}
                  type="text" 
                  placeholder='firstname'
                  />
                <input
                  className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base" 
                  value={lastname}
                  onChange={(e)=>{setLastname(e.target.value)}}
                  type="text" 
                  placeholder='lastname'
                  />
           </div>

          <h3 className="text-lg font-medium mb-2">What's is your email </h3>
            <input
            className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base" 
            required
            value={email}
            onChange={
              (e)=>{ 
                setEmail(e.target.value)
              }
            }
            type="text"
            placeholder="Email" 
            />

            <h3 className="text-lg font-medium mb-2"> Enter Password </h3>
            <input 
            className="bg-[#eeeeee] w-full rounded-lg px-4 py-2 border  text-lg placeholder:text-base"
            required
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            type="text"
            placeholder="password"
            />
            <button className="bg-[#111] text-white font-semibold  mt-3 mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">Create Account</button>

           </form>
        <p className='text-center'>Already have account? <Link to='/login' className="text-blue-600" >Login here</Link></p>
      </div>
        <div>
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup

