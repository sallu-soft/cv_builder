// "use client"
// import React, { useLayoutEffect } from "react";
import { fetchAllResumes, refreshAdminDashboard } from "@/lib/actions";
import Admin_Table from "../components/Admin_Table";

const AdminDashboard = async () => {
  // console.log("hellow")
  // const isLoggedIn = typeof window !== "undefined" ? JSON.parse(window.localStorage.getItem('user')) : false;
  // console.log(isLoggedIn)
  // if (!isLoggedIn) {
  //   redirect("/");
  // }

  // useLayoutEffect(()=>{
  //   const storedUserData = localStorage.getItem('user');
  //   const user = storedUserData ? JSON.parse(storedUserData) : null; 
  //   if(!user){
  //     redirect("/")
  //   }
  // },[]);
  
  const resume = await fetchAllResumes();
  
  return (
    <div className="m-4 shadow-lg mx-auto w-full">
      <Admin_Table passenger={resume?.slice().reverse()}/>
      {/* {resume[0].name} */}
    </div>
  );
};

export default AdminDashboard;
