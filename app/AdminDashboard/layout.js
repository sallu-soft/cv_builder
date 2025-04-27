import React from 'react'
import Navbar from '../components/Navbar'

// const getAllPassenger = async () => {
//   const passenger = await fetch(`/api/passenger`);
//   return passenger.json();
// }
const AdminLayout = ({children}) => {
  
  return (
    <div>
        <Navbar/>
        {children}
    </div>
  )
}

export default AdminLayout