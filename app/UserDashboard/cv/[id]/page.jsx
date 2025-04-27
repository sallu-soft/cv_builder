import Cv_format from "@/app/components/Cv_format";
import { fetchSingleResume } from "@/lib/actions";
import Image from "next/image";
import React from "react";

const CvPage = async ({ params }) => {
  const id = await params?.id; // Ensure params is awaited properly
  console.log(id);
  const resume = await fetchSingleResume(id);
  return (
    <Cv_format resume={resume}/>
    
  );
};

export default CvPage;