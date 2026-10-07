import  { useState ,useRef,useEffect } from 'react'
import { useGSAP } from '@gsap/react'   
import { gsap } from 'gsap'
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WatingForDriver from '../components/WatingForDriver'
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const[pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const panelCloseRef = useRef(null)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [ waitingForDriver, setWaitingForDriver ] = useState(false)
   const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const { Socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)
    const navigate = useNavigate()

    useEffect(() =>{
      Socket.emit("join", { userType:"user", userId: user.id })
    },[user])

    Socket.on('ride-confirmed',ride => {
      setVehicleFound(false)
      setWaitingForDriver(true)
      setRide(ride)
    })
    Socket.on('ride-started',() => {
      console.log("ride started")
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })



   const handlePickupChange = async (e) => {

        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

        const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) =>{
    e.preventDefault(e)
  }

  useGSAP(function(){
    if(panelOpen){
      gsap.to(panelRef.current, {
        height: "70%"
      })
      gsap.to(panelCloseRef.current, {
        opacity : 1
      })
    }else{
      gsap.to(panelRef.current, {
        height: "0%" ,
        padding : 24
      })
      gsap.to(panelCloseRef.current, {
        opacity : 0 ,
        padding : 0
      })
     
    }
  },[panelOpen])


    useGSAP(function(){
      if(vehiclePanel){
        gsap.to(vehiclePanelRef.current,{
          y :'0%'
        })
      }else{
        gsap.to(vehiclePanelRef.current,{
          y :'100%'
        })
      }
    },[vehiclePanel]
  )

   useGSAP(function(){
      if(confirmRidePanel){
        gsap.to(confirmRidePanelRef.current,{
          y :'0%'
        })
      }else{
        gsap.to(confirmRidePanelRef.current,{
          y :'100%'
        })
      }
    },[confirmRidePanel]
  )

     useGSAP(function(){
      if(vehicleFound){
        gsap.to(vehicleFoundRef.current,{
          y :'0%'
        })
      }else{
        gsap.to(vehicleFoundRef.current,{
          y :'100%'
        })
      }
    },[vehicleFound]
  )
      useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])

        async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


        setFare(response.data)


    }
        async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


    }


  return (
       <div className='h-screen relative overflow-hidden'>

            <img className='w-10 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='h-screen w-screen'>
                {/* image for temporary use  */}

                <img className='h-screen w-screen object-cover' src=" https://tb-static.uber.com/prod/udam-assets/23af4a7d-ed0e-560b-b138-fdf08f573ae9.gif" alt="" />
            </div>
          <div className='  flex flex-col justify-end absolute h-screen top-0 w-full '>

            <div className='h-[30%] p-6 bg-white relative '>

            <h5 ref={panelCloseRef} onClick={() => {
              setPanelOpen(false)
              }} className= 'absolute right-6 top-3 text-2xl'>
              <i className="ri-arrow-down-wide-fill"></i></h5>

            <h4 className='text-2xl font-semibold'> Find a trip </h4>

            <form onSubmit={(e) => {
              submitHandler(e)
            }}>
              <div className='line absolute h-16 w-1 top-[45%] left-10 bg-gray-900 rounded-full'></div>
              <input 
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
              type="text" placeholder='Add a pickup location'
               value={pickup} 
              onChange={handlePickupChange} />
              <input 
              onClick={() => {
                setPanelOpen(true)
                setActiveField('destination')
              }}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-4'
              type="text" placeholder='Enter your destination' 
              value={destination}
              onChange={handleDestinationChange}/>
            </form>
              <button
                  onClick={findTrip}
                  className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                      Find Trip
              </button>
            
          </div>
          <div ref={panelRef} className='h-0 bg-white '>
            <LocationSearchPanel 
           suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}  />
          </div>
          </div>
          <div ref={vehiclePanelRef} className='fixed  w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12' >
            <VehiclePanel 
              selectVehicle={setVehicleType}
              fare={fare} setConfirmRidePanel={setConfirmRidePanel}
              setVehiclePanel={setVehiclePanel} />
          </div>
           <div
    ref={confirmRidePanelRef}
    className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-14'
>
    <ConfirmRide
        setConfirmRidePanel={setConfirmRidePanel}
        setVehicleFound={setVehicleFound}
        setVehiclePanel={setVehiclePanel}
        pickup={pickup}
        destination={destination}
        fare={fare}
        vehicleType={vehicleType}
        createRide={createRide}
    />
</div>
            <div ref={vehicleFoundRef} className='fixed  w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-14' >
              <LookingForDriver
    setVehicleFound={setVehicleFound}
    setVehiclePanel={setVehiclePanel}
    pickup={pickup}
    destination={destination}
    fare={fare}
    vehicleType={vehicleType}
/>
          </div>
          <div ref={waitingForDriverRef} className='fixed  w-full z-10 bottom-0  bg-white px-3 py-6 pt-14' >
              <WatingForDriver  setWaitingForDriver={setWaitingForDriver} />
          </div>
    </div>
  )
}

export default Home

