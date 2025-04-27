
import EditResume from '@/app/components/EditResume';
import { fetchAllOffices, fetchSingleResume, refreshAdminDashboard } from '@/lib/actions';


const EditEntry =async ({params}) => {
    const { id } = await params; // ✅ Await params before using

    const offices = await fetchAllOffices();
    const resume = await fetchSingleResume(id);
    // ✅ Convert MongoDB document to plain object
    const plainResume = JSON.parse(JSON.stringify(resume));

    // ✅ Parse office string to array
    if (plainResume.office && typeof plainResume.office === "string") {
        plainResume.office = JSON.parse(plainResume.office);
    }
    
  
  return (
   
    <EditResume id={id} office={offices} resume={plainResume} />
           
  )
}

export default EditEntry