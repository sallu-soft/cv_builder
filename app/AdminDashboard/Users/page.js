import OfficeLists from "@/app/components/OfficeLists";
import {fetchAllOffices } from "@/lib/actions";


const OfficeDashboard = async () => {
  // Fetch all offices using the server action
  const offices = await fetchAllOffices();
  console.log(offices)
  
  return (
    
    <OfficeLists offices={offices}/>
  );
};

export default OfficeDashboard;
