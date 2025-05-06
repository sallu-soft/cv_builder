"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createFormAction, editFormAction } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import Select from "react-select";
import Image from "next/image";

// Server Action for login (to be implemented based on your server)



const EditResume = ({resume, office,id}) => {
  const router = useRouter();

  const [formState, setFormState] = useState({
    office: resume?.office || [],  // default to empty array if undefined
    name: resume?.name || "",
    passport_no: resume?.passport_no || "",
    dob: resume?.dob || "",
    position: resume?.position || "",
    salary: resume?.salary || "",
    contract: resume?.contract || "",
    religion: resume?.religion || "",
    social_status: resume?.social_status || "",
    picture: resume?.picture || null,
    picture_preview: resume?.picture || null,
    passport_image: resume?.passport_image || null,
    passport_image_preview: resume?.passport_image || null,
    place_of_birth: resume?.place_of_birth || "",
    address: resume?.address || "",
    education: resume?.education || "",
    phone_number: resume?.phone_number || "",
    passport_issue_place: resume?.passport_issue_place || "",
    passport_issue_date: resume?.passport_issue_date || "",
    passport_expire_date: resume?.passport_expire_date || "",
    height: resume?.height || "",
    weight: resume?.weight || "",
    no_of_kids: resume?.no_of_kids || "",
    nationality: resume?.nationality || "",
    experience: resume?.experience || "",
    refference: resume?.refference || "",
    visas: resume?.visas || null,
    previews: resume?.visas || null,

  });
  const removeImage = (index) => {
    setFormState((prev) => ({
      ...prev,
      visas: prev.visas.filter((_, i) => i !== index),
      previews: prev.previews.filter((_, i) => i !== index), // Remove preview
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
  
    try {
      console.log("beforeSubmit");
  
      // Initialize a new FormData object
      const formDataToSubmit = new FormData();
  
      // Append scalar form fields from formState
      formDataToSubmit.append("office", JSON.stringify(formState.office));
      formDataToSubmit.append("name", formState.name);
      formDataToSubmit.append("passport_no", formState.passport_no);
      formDataToSubmit.append("dob", formState.dob);
      formDataToSubmit.append("position", formState.position);
      formDataToSubmit.append("salary", formState.salary);
      formDataToSubmit.append("contract", formState.contract);
      formDataToSubmit.append("religion", formState.religion);
      formDataToSubmit.append("social_status", formState.social_status);
      formDataToSubmit.append("place_of_birth", formState.place_of_birth);
      formDataToSubmit.append("address", formState.address);
      formDataToSubmit.append("education", formState.education);
      formDataToSubmit.append("phone_number", formState.phone_number);
      formDataToSubmit.append("passport_issue_place", formState.passport_issue_place);
      formDataToSubmit.append("passport_issue_date", formState.passport_issue_date);
      formDataToSubmit.append("passport_expire_date", formState.passport_expire_date);
      formDataToSubmit.append("height", formState.height);
      formDataToSubmit.append("weight", formState.weight);
      formDataToSubmit.append("no_of_kids", formState.no_of_kids);
      formDataToSubmit.append("nationality", formState.nationality);
      formDataToSubmit.append("experience", formState.experience);
      formDataToSubmit.append("refference", formState.refference);
  
      // Append file fields to FormData
      if (formState?.picture) {
        formDataToSubmit.append("picture", formState.picture); // 'picture' is the key expected by the server
      }
      if (formState?.passport_image) {
        formDataToSubmit.append("passport_image", formState.passport_image); // 'passport_image' is the key expected by the server
      }
      formState?.visas?.forEach((file, index) => {
        formDataToSubmit.append(`visas[${index}]`, file);
      });
      console.log(formState)
      // Submit the FormData using your server action
      const result = await editFormAction(formDataToSubmit,id);
      console.log("Form successfully edited:", result);
  
      // Reset form state after successful submission
      setFormState({
        office: [],
        name: "",
        passport_no: "",
        dob: "",
        position: "",
        salary: "",
        contract: "",
        religion: "",
        social_status: "",
        picture: null,
        passport_image: null,
        place_of_birth:"",
        address:"",
        education:"",
        phone_number:"",
        passport_issue_place:"",
        passport_issue_date: "",
        passport_expire_date: "",
        height: "",
        weight: "",
        no_of_kids: "",
        nationality: "",
        experience: "",
        refference: "",
        visas: [],
      });
      
      toast({
        title: "Success",
        description: "Form submitted successfully!",
      });
      router.push("/AdminDashboard")
    } catch (error) {
      console.error("Form creation failed:", error);
  
      toast({
        title: "Error",
        description: "Failed to submit the form.",
      });
    }
  };
 
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
  
    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
  
    setFormState((prev) => ({
      ...prev,
      visas: [...(prev?.visas || []), ...files],  // Ensure prev.visas is an array
      previews: [...(prev?.previews || []), ...newPreviews], // Ensure prev.previews is an array
    }));
  };
  // const handleChange = (e) => {
  //   // Check if it's a Select change event
  //   if (e && e.value) {
  //     setFormState((prev) => ({
  //       ...prev,
  //       office: e.value,  // e.value is the selected office's value
  //     }));
  //   } else {
  //     // Handle regular input fields
  //     const { name, value, files } = e.target || {};
  //     if (!name) return; // Early exit if name is undefined
      
  //     setFormState((prev) => ({
  //       ...prev,
  //       [name]: files ? files[0] : value, // Handle file input
  //     }));
  //   }
  // };
 
  const handleChange = (e) => {
    const { name, value, files } = e.target || {};
    if (!name) return; // Early exit if name is undefined
  
    if (files && files[0]) {
      const file = files[0];
  
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
  
      setFormState((prev) => ({
        ...prev,
        [name]: file, // Store file
        [`${name}_preview`]: previewUrl, // Store preview URL
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  // Convert offices data to the format needed by React-Select
  const options = office.map((office) => ({
    value: office?._id, // Use office ID as value
    label: office?.office_name, // Use office name as label
  }));

  return (
    <div className="flex flex-col min-h-fit mt-10 max-w-7xl mx-auto p-6 py-12 bg-white shadow-xl rounded-lg border-2 border-pink-600">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-8">
        Enter Candidates CV Information
      </h2>
<form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="Office" // Bind the label to the select dropdown
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Select Office
          </label>
          <div className="mt-2">
          <Select
            name="office"
            options={options}
            value={options.filter((option) => formState.office.includes(option.value))} // Show selected values
            onChange={(selectedOptions) =>
              setFormState((prevState) => ({
                ...prevState,
                office: selectedOptions.map((option) => option.value), // Store only IDs
              }))
            }
            isMulti
            isSearchable
            className="w-full text-gray-900"
          />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Passport No", name: "passport_no", type: "text" },
            {
              label: "Passport Issue Date",
              name: "passport_issue_date",
              type: "date",
            },
            {
              label: "Passport Expiry Date",
              name: "passport_expire_date",
              type: "date",
            },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Position", name: "position", type: "text" },
            { label: "Salary", name: "salary", type: "number" },
            { label: "Contract", name: "contract", type: "text" },
            // { label: "Religion", name: "religion", type: "text" },
            // { label: "Social Status", name: "social_status", type: "text" },
            { label: "Place Of Birth", name: "place_of_birth", type: "text" },
            { label: "Address", name: "address", type: "text" },
            { label: "Education", name: "education", type: "text" },
            { label: "Phone Number", name: "phone_number", type: "text" },

            {
              label: "Passport Issue Place",
              name: "passport_issue_place",
              type: "text",
            },

            { label: "Height", name: "height", type: "number" },
            { label: "Weight", name: "weight", type: "number" },
            { label: "Number of Kids", name: "no_of_kids", type: "number" },
            { label: "Nationality", name: "nationality", type: "text" },
            { label: "Experience", name: "experience", type: "text" },
            { label: "Reference", name: "refference", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {label}
              </label>
              <div className="mt-2">
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formState[name]}
                  onChange={handleChange}
                  required={name !== "refference"} // Optional field for reference
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          ))}
          <div>
            <label
              htmlFor="religion"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Religion
            </label>
            <div className="mt-2">
              <select
                id="religion"
                name="religion"
                value={formState.religion}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select Religion</option>
                <option value="MUSLIM">MUSLIM</option>
                <option value="NON-MUSLIM">NON-MUSLIM</option>
              </select>
            </div>
          </div>

          {/* Social Status Dropdown */}
          <div>
            <label
              htmlFor="social_status"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Social Status
            </label>
            <div className="mt-2">
              <select
                id="social_status"
                name="social_status"
                value={formState.social_status}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select Social Status</option>
                <option value="Married">Married</option>
                <option value="Unmarried">Unmarried</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Upload Picture
            </label>
            <input
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {formState.picture_preview && (
              <Image
                src={formState.picture_preview}
                alt="Picture Preview"
                width={100}
                height={100}
                className="mt-2 border rounded-md"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">
              Upload Passport Image
            </label>
            <input
              type="file"
              name="passport_image"
              accept="image/*"
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {formState.passport_image_preview && (
              <Image
                src={formState.passport_image_preview}
                alt="Passport Preview"
                width={100}
                height={100}
                className="mt-2 border rounded-md"
              />
            )}
          </div>
          <div>
            <label
              htmlFor="visa_images"
              className="block text-sm font-medium text-gray-900"
            >
              Upload Visa Images
            </label>
            <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              name="visa_images"
              id="visa_images"
              multiple // Allow multiple file selection
              onChange={handleFileChange}
              className="block w-full border rounded-md py-1.5 px-2"
            />
            <div className="mt-2 flex gap-2 flex-wrap">
            {formState?.previews?.map((preview, index) => (
    <div key={index} className="relative">
      <Image
        src={preview} // Use stored preview URL
        alt="Uploaded preview"
        width={96} // Required for Next.js Image
        height={96} // Required for Next.js Image
        className="w-24 h-24 object-cover rounded"
      />
      <button
        type="button"
        className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full"
        onClick={() => removeImage(index)}
      >
        ✖
      </button>
    </div>
  ))}
  </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditResume;

