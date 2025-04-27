import React from 'react'
import { fetchAllResumes } from '@/lib/actions';
import User_Table from '../components/User_Table';

const UserDashboard = async () => {
  
  const resume = await fetchAllResumes();
  
  return (
    <div>
      <User_Table resume={resume?.slice().reverse()}/>
      
    </div>
  )
}

export default UserDashboard