import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({
    children
}) => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { captain, setCaptain } = useContext(CaptainDataContext)
    const [ isLoading, setIsLoading ] = useState(true)




useEffect(() => {
    if (!token) {
        navigate('/captain-login')
        return
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {

        console.log("PROFILE RESPONSE:", response.data);

        if (response.status === 200) {
            setCaptain(response.data.captain)
            setIsLoading(false)
        }

    })
    .catch(err => {

        console.log("PROFILE ERROR:", err.response?.data);

        localStorage.removeItem('token')
        navigate('/captain-login')
    })

}, [token])

    

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }



    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper