import React from 'react'
import UserNavbar from '../components/UserNavbar'

const UserLayout = ({children}) => {
  
  return (
    <div>
        <UserNavbar/>
        {children}
    </div>
  )
}

export default UserLayout