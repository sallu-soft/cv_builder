"use client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Margin, usePDF } from "react-to-pdf";

const Cv_format = ({ resume }) => {
  const [user, setUser] = useState();

  console.log(user);
  const targetRef = useRef(null);

  const captureAsJPG = async () => {
    if (targetRef.current) {
      const canvas = await html2canvas(targetRef.current, { scale: 2 });
      const image = canvas.toDataURL("image/jpeg", 1.0);

      const link = document.createElement("a");
      link.href = image;
      link.download = `${resume?.name}-cv.jpg`;
      link.click();
    }
  };
  const downloadPDF = async () => {
    if (!targetRef.current) return;

    const canvas = await html2canvas(targetRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${resume?.name}-cv.pdf`);
  };
  useEffect(() => {
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem("user"))
        : null;
    setUser(storedUser);

    // if (!storedUser || storedUser?.role !== "user") {
    //   router.push("/");
    // }
  }, []);
  const printRef = useRef();
  // const handlePrint = useReactToPrint({ contentRef: printRef });
  const formattedDate = resume?.dob
    ? new Date(resume?.dob).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(resume?.dob);

  return (
    <>
      <div ref={targetRef} className="w-[1000px] p-2 mx-auto">
        <div>
          {user ? (
            <Image
              src={user?.office_logo}
              alt={resume?.name}
              width={300}
              height={200}
              className="rounded w-full h-[120px]  object-contain"
            />
          ) : (
            "...loading"
          )}
        </div>
        <div className="flex justify-between">
          <h3 className="text-[20px] ">APPLICATION FOR EMPLOYMENT</h3>
          <div className="grid grid-cols-2 border border-black w-[35%]">
            <div className="border-r border-black px-1 pb-2 !pt-0  ">
              REF NO:
            </div>
            <div className="px-1 pb-2 !pt-0 text-center  border-r border-black">
              2
            </div>
          </div>
        </div>

        <div className="gap-x-3 mt-2 flex w-full">
          <div className="w-full ">
            <div className="w-[110%]">
              <div className="border border-black font-semibold border-collapse">
                <div className="grid grid-cols-3 border-b border-black ">
                  <div className="border-r border-black px-1 text-[13px] pb-3 bg-gray-200">
                    POSITION APPLIED FOR:
                  </div>
                  <div className="px-1 text-[13px] border-r border-black pb-3 text-center">
                    {resume?.position}
                  </div>
                  <div className="px-1 pb-3 bg-gray-200 text-[13px] text-end">
                    الوظيفة
                  </div>
                </div>

                <div className="grid grid-cols-3 border-b border-black">
                  <div className="border-r pb-2 bg-gray-200 border-black px-1 text-[13px]">
                    MONTHLY SALARY:
                  </div>
                  <div className="px-1 border-r border-black pb-2 text-[13px] text-center">
                    {resume?.salary}
                  </div>
                  <div className="px-1 text-[13px] bg-gray-200 text-end pb-2">
                    :الراتب
                  </div>
                </div>

                <div className="grid grid-cols-3">
                  <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                    CONTRACT PERIOD:
                  </div>
                  <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                    {resume?.contract}
                  </div>
                  <div className="px-1 pb-2 !pt-0 bg-gray-200 text-[13px] text-end">
                    مدة العقد:
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="grid grid-cols-3 border border-black  font-semibold mt-2">
                <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                  FULL NAME:
                </div>
                <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                  {resume?.name}
                </div>
                <div className="text-end bg-gray-200 px-1 pb-2 !pt-0 text-[13px]">
                  الاسم كامل:
                </div>
              </div>
            </div>
            <div className="">
              <div className="w-[100%] mt-2 shadow-lg ">
                {/* Position Details */}

                {/* Details Section */}
                <div>
                  <div className="text-center text-[13px] font-bold mt-2 bg-gray-200 py-1 pb-2 border border-black">
                    DETAILS OF APPLICATION
                  </div>

                  <div className="border border-black font-semibold">
                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="bg-gray-200 border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                        NATIONALITY:
                      </div>
                      <div className="border-r uppercase border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.nationality}
                      </div>
                      <div className="bg-gray-200 px-1 pb-2 !pt-0 text-[13px] text-end">
                        الجنسية
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        RELIGION:
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center uppercase">
                        {resume?.religion}
                      </div>
                      <div className="bg-gray-200 px-1 pb-2 !pt-0 text-[13px] text-end">
                        الدين
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        DATE OF BIRTH:
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {formattedDate}
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] bg-gray-200 text-end">
                        تاريخ الميلاد
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        AGE:
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {age !== null ? age : "N/A"} YEARS
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] bg-gray-200 text-end">
                        العمر
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        PLACE OF BIRTH:
                      </div>
                      <div className="uppercase border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.place_of_birth}
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] bg-gray-200 text-end">
                        مكان الميلاد
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b  border-black">
                      <div className="border-r border-black bg-gray-200 px-1 pb-2 !pt-0 text-[13px]">
                        ADDRESS:
                      </div>
                      <div className=" uppercase border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.address}
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] bg-gray-200 text-end">
                        العنوان
                      </div>
                    </div>

                    <div className="grid grid-cols-3  border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        MARITAL STATUS:
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.social_status}
                      </div>
                      <div className="px-1 pb-2 bg-gray-200 !pt-0 text-[13px] text-end">
                        الحالة الاجتماعية
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        NO. OF CHILDREN:
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.no_of_kids}
                      </div>
                      <div className="px-1 pb-2 bg-gray-200 !pt-0 text-[13px] text-end">
                        عدد الأطفال
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        WEIGHT (KG):
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.weight}
                      </div>
                      <div className="px-1 pb-2 bg-gray-200 !pt-0 text-[13px] text-end">
                        الوزن
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        HEIGHT (FEET):
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.height}
                      </div>
                      <div className="px-1 pb-2 bg-gray-200 !pt-0 text-[13px] text-end">
                        الطول
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        EDUCATION:
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.education}
                      </div>
                      <div className="px-1 bg-gray-200 pb-2 !pt-0 text-[13px] text-end">
                        التعليم
                      </div>
                    </div>

                    <div className="grid grid-cols-3">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        CONTACT NO:
                      </div>
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        {resume?.phone_number}
                      </div>
                      <div className="px-1 pb-2 bg-gray-200 !pt-0 text-[13px] text-end">
                        رقم الهاتف
                      </div>
                    </div>
                  </div>
                  {/* Work Experience */}
                  <div className="text-center text-[13px] font-bold mt-2 bg-gray-200 py-1 pb-2 border border-black">
                    WORK EXPERIENCE
                  </div>
                  <div className="border border-black px-1 pb-2 !pt-0 text-[13px] text-center uppercase font-semibold">
                    {resume?.experience}
                  </div>
                  <div className="border mt-2 border-black text-[13px] font-semibold border-collapse">
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="border-r pb-2 bg-gray-200 border-black p-1 text-[13px]">
                        HOUSEHOLD EXPERIENCE
                      </div>
                      <div className="bg-gray-200 p-1 pb-2 text-[13px] border-r border-black text-center">
                        خبرات العمل:
                      </div>
                    </div>

                    <div className="grid grid-cols-4 border-b border-black">
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        BABY SITTING
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                        CLEANING
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] text-center border-r border-black">
                        COOKING
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] text-center">
                        WASHING
                      </div>
                    </div>

                    <div className="grid grid-cols-4">
                      <div className="border-r border-black px-1 pb-1 !pt-0 text-center text-[16px] font-bold">
                        √
                      </div>
                      <div className="px-1 pb-1 !pt-0 text-[16px] font-bold border-r border-black text-center">
                        √
                      </div>
                      <div className="px-1 pb-1 !pt-0 text-[16px] font-bold border-r border-black text-center">
                        √
                      </div>
                      <div className="px-1 pb-1 !pt-0 text-[16px] font-bold   text-center">
                        √
                      </div>
                    </div>
                    <div className="grid grid-cols-4 border-y border-black">
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center">
                        IRONING
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                        ARABIC COOKING
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] text-center border-r border-black">
                        DISABLED CARE
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] text-center"></div>
                    </div>

                    <div className="grid grid-cols-4">
                      <div className="border-r border-black px-1 pb-1 !pt-0 text-center text-[16px] font-bold">
                        √
                      </div>
                      <div className="px-1 pb-1 !pt-0 text-[16px] font-bold border-r border-black text-center">
                        √
                      </div>
                      <div className="px-1 pb-1 !pt-0 text-[16px] font-bold border-r border-black text-center">
                        √
                      </div>
                      <div className="px-1 pb-1 !pt-0 text-[16px] font-bold   text-center"></div>
                    </div>
                  </div>
                  <div className="border mt-2 border-black  font-semibold border-collapse">
                    <div className="grid grid-cols-2 border-b border-black border-collapse">
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] bg-gray-200">
                        LANGUAGE SPOKEN
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] text-center bg-gray-200">
                        اجادة اللغات
                      </div>
                    </div>

                    <div className="grid grid-cols-4 border-b border-black">
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-[13px] text-center"></div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                        VERY GOOD ممتاز
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] text-center border-r border-black">
                        GOOD متوسط{" "}
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] text-center">
                        LITTLE قليل
                      </div>
                    </div>

                    <div className="grid grid-cols-4 border-collapse border-b border-black">
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-center text-[13px] font-bold">
                        ARABIC
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[16px] font-bold border-r border-black text-center">
                        √
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[16px] font-bold border-r border-black text-center"></div>
                      <div className="px-1 pb-2 !pt-0 text-[16px] font-bold   text-center"></div>
                    </div>
                    <div className="grid grid-cols-4 border-b border-black border-collapse">
                      <div className="border-r border-black px-1 pb-2 !pt-0 text-center text-[13px] font-bold">
                        ENGLISH
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[16px] font-bold border-r border-black text-center"></div>
                      <div className="px-1 pb-2 !pt-0 text-[16px] font-bold border-r border-black text-center">
                        √
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[20px] font-bold   text-center"></div>
                    </div>
                  </div>
                  <div className="border mt-2 border-black text-lg font-semibold border-collapse">
                    <div className="grid grid-cols-1 border-b border-black">
                      <div className="border-r bg-gray-200 border-black px-1 pb-2 !pt-0 text-[13px]">
                        PASSPORT DETAILS
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="bg-gray-200 border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                        PASSPORT NO.
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                        {resume?.passport_no}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className=" bg-gray-200 border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                        DATE OF ISSUED
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                        {resume?.passport_issue_date}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="bg-gray-200 border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                        DATE OF EXPIRATION
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                        {resume?.passport_expire_date}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="bg-gray-200 border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                        PLACE ISSUED
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                        {resume?.passport_issue_place}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-b border-black">
                      <div className="bg-gray-200 border-r border-black px-1 pb-2 !pt-0 text-[13px]">
                        REFERENCE
                      </div>
                      <div className="px-1 pb-2 !pt-0 text-[13px] border-r border-black text-center">
                        {resume?.refference}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end flex-col">
            <div className="flex max-w-[190px] justify-end">
              {resume?.picture ? (
                <Image
                  src={resume?.picture}
                  alt={resume?.name}
                  width={350}
                  height={340}
                  className="rounded max-h-[290px] object-contain"
                />
              ) : (
                "No Image"
              )}
            </div>
            <div className="w-full mt-2">
              <div className="gap-y-3 max-w-[380px] flex flex-col ">
                {resume?.picture && resume?.passport_image ? (
                  <>
                    <Image
                      src={resume?.passport_image}
                      alt={resume?.name}
                      width={350}
                      height={850}
                      className="rounded max-h-[450px] object-contain"
                    />
                  </>
                ) : (
                  "No Images"
                )}
              </div>
              <div className="grid mt-2 max-w-[350px] grid-cols-2 gap-2">
                {resume?.visas?.map((visa, key) => {
                  const imageHeight = resume.visas.length === 1 ? 330 : 280; // Set height dynamically

                  return (
                    <Image
                      src={visa}
                      key={key}
                      alt={resume?.name}
                      width={300}
                      height={imageHeight}
                      className={`h-[${imageHeight}px]`}
                    />
                  );
                })}
              </div>
            </div>
           
          </div>
          
        </div>
        
        <div className="bg-gray-700 text-white w-full flex gap-5 items-center justify-center text-2xl pb-3 flex-wrap">
          {Array.isArray(user?.office_number)
            ? user?.office_number.map((number, index) => (
                <span key={index}>{number}</span>
              ))
            : user?.office_number}
        </div>
        <div className="bg-gray-700 text-white w-full flex gap-3 items-center justify-center text-2xl pb-4 flex-wrap">
          {user?.office_email}
        </div>
      </div>

      <div className="flex justify-center mb-4 w-[1000px] mx-auto">
        {printRef && (
          <div className="flex gap-x-3">
            <button
              className="bg-orange-500 px-6 py-2 rounded-lg text-white text-xl font-medium"
              // onClick={handlePrint}
              onClick={downloadPDF}
            >
              Download PDF
            </button>
            <button
              className="bg-green-500 px-6 py-2 rounded-lg text-white text-xl font-medium"
              onClick={captureAsJPG}
            >
              Download JPG
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cv_format;
