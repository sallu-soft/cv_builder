"use client";

import { useState } from "react";
import { updateOffice } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const EditUser = ({ office }) => {
  const router = useRouter();
  const [updatedOffice, setUpdatedOffice] = useState({
    office_name: office.office_name || "",
    office_number: Array.isArray(office.office_number) ? office.office_number : [office.office_number || ""],
    office_address: office.office_address || "",
    office_email: office.office_email || "",
    office_logo: null,
    role: office.role || "user",
  });

  const handleFileChange = (e) => {
    setUpdatedOffice({ ...updatedOffice, office_logo: e.target.files[0] });
  };

  const handlePhoneNumberChange = (index, value) => {
    const updatedNumber = [...updatedOffice.office_number];
    updatedNumber[index] = value;
    setUpdatedOffice({ ...updatedOffice, office_number: updatedNumber });
  };

  const addPhoneNumber = () => {
    setUpdatedOffice({ ...updatedOffice, office_number: [...updatedOffice.office_number, ""] });
  };

  const removePhoneNumber = (index) => {
    const updatedNumber = updatedOffice?.office_number.filter((_, i) => i !== index);
    setUpdatedOffice({ ...updatedOffice, office_number: updatedNumber });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("office_name", updatedOffice.office_name);
    updatedOffice.office_number.forEach((num, index) => {
      formData.append(`office_number[${index}]`, num);
    });
    formData.append("office_address", updatedOffice.office_address);
    formData.append("office_email", updatedOffice.office_email);
    formData.append("role", updatedOffice.role);
    if (updatedOffice.office_logo) {
      formData.append("office_logo", updatedOffice.office_logo);
    }

    try {
      const res = await updateOffice(office._id, Object.fromEntries(formData.entries()));

      toast({
        title: "Success",
        description: "Office Edited Successfully!",
      });
      router.push("/AdminDashboard/Users")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[92vh] flex justify-center items-center">
      <div className="flex min-h-fit max-w-3xl flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-xl rounded-lg border-2 border-teal-600">
        <h2 className="mt-5 text-center text-2xl font-bold text-teal-900">Edit Office</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5" onSubmit={handleSubmit}>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-900">Office Name</label>
            <input
              type="text"
              value={updatedOffice.office_name}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, office_name: e.target.value })}
              required
              className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-900">Office Address</label>
            <input
              type="text"
              value={updatedOffice.office_address}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, office_address: e.target.value })}
              required
              className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-900">Office Numbers</label>
            {updatedOffice?.office_number?.map((num, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={num}
                  onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                  required
                  className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
                />
                {index > 0 && (
                  <button type="button" onClick={() => removePhoneNumber(index)} className="text-red-500">
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addPhoneNumber} className="mt-2 text-blue-500">
              + Add Another Number
            </button>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-900">Office Email</label>
            <input
              type="email"
              value={updatedOffice.office_email}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, office_email: e.target.value })}
              required
              className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-900">Role</label>
            <select
              value={updatedOffice.role}
              onChange={(e) => setUpdatedOffice({ ...updatedOffice, role: e.target.value })}
              className="block px-2 w-full rounded-md border py-1.5 text-gray-900 shadow-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-900">Office Logo (Optional)</label>
            <input type="file" onChange={handleFileChange} className="block w-full rounded-md border py-1.5 text-gray-900 shadow-sm" />
          </div>

          <div className="col-span-2">
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md">Update Office</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
