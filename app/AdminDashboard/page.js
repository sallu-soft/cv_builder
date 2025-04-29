
import { fetchAllResumes, refreshAdminDashboard } from "@/lib/actions";
import Admin_Table from "../components/Admin_Table";

const AdminDashboard = async () => {

  
  const resume = await fetchAllResumes();
  
  return (
    <div className="m-4 shadow-lg mx-auto w-full">
      <Admin_Table passenger={resume?.slice().reverse()}/>
      {/* {resume[0].name} */}
    </div>
  );
};

export default AdminDashboard;
