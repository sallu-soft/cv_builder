
import AddResume from '@/app/components/AddResume'
import { fetchAllOffices } from '@/lib/actions'
import React from 'react'

const AddEntry = async () => {
  const offices = await fetchAllOffices();
  console.log(offices)
  return (
    <AddResume offices={offices}/>
  )
}

export default AddEntry