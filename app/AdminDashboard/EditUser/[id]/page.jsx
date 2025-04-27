import EditUser from '@/app/components/EditUser';
import { fetchOfficeById, } from '@/lib/actions';


const EditUserPage =async ({params}) => {
    const { id } = await params; // ✅ Await params before using

    const office = await fetchOfficeById(id);
    // ✅ Convert MongoDB document to plain object
    
    
  
  return (
   
    <EditUser id={id} office={office}/>
           
  )
}

export default EditUserPage