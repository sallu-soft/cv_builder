"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  autoUpdateOnholdStatus,
  refreshAdminDashboard,
  updateUserStatus,
} from "@/lib/actions";
import { MdPlayCircle } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatDate(dateString) {
  if (!dateString) return "";
  let date = new Date(dateString);
  let day = String(date.getUTCDate()).padStart(2, "0");
  let month = String(date.getUTCMonth() + 1).padStart(2, "0");
  let year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

const User_Table = ({ resume }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [open, setOpen] = useState(false);
  const options = [
    { value: "Pending", label: "Pending" },
    { value: "Onhold", label: "Onhold" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  // Helper function to update status with server action
  const handleVideoClick = (url) => {
    setVideoUrl(url);
    setOpen(true);
  };
  async function handleStatusUpdate(id, newStatus, office, setLoading) {
    try {
      setLoading(true); // Show a loading indicator if needed
      await updateUserStatus(id, newStatus, office);
      await refreshAdminDashboard();
      router.refresh();
      alert("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error.message);
      alert("Failed to update status");
    } finally {
      setLoading(false); // Hide the loading indicator
    }
  }
  useEffect(() => {
    autoUpdateOnholdStatus();
    refreshAdminDashboard();
  }, []);

  const columns = [
    {
      name: <p className="font-bold text-lg">Name</p>,
      selector: (row) => {
        const getAge = (dob) => {
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        };
        return (
          <div className="flex flex-col space-y-2">
            <h3 className="font-semibold text-green-600 text-md uppercase">
              {row.name}
            </h3>
            <p className="font-semibold">{row.passport_no}</p>
            <p>
              {row.dob} ({getAge(row.dob)} years)
            </p>
          </div>
        );
      },
      wrap: true,
      style: { minWidth: "150px", padding: "0px 8px" },
    },
    {
      name: <p className="font-bold text-lg">Position</p>,
      selector: (row) => row.position,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Video</p>,
      selector: (row) => {
        return (
          row?.cv_video && (
            <MdPlayCircle
              className="text-2xl text-blue-700 font-bold cursor-pointer"
              onClick={() => handleVideoClick(row.cv_video)}
            />
          )
        );
      },
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Salary</p>,
      selector: (row) => `${row.salary}`,
      wrap: true,
    },
    
    {
      name: <p className="font-bold text-lg">Religion</p>,
      selector: (row) => row.religion,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Social Status</p>,
      selector: (row) => row.social_status,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Picture</p>,
      selector: (row) =>
        row?.picture ? (
          <Image
            src={row.picture}
            alt={row.name}
            width={100}
            height={100}
            className="h-16 w-16 rounded object-cover"
          />
        ) : (
          <p className="text-gray-500">No Image</p> // Placeholder text when empty
        ),
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Passport Image</p>,
      selector: (row) =>
        row?.passport_image ? (
          <Image
            src={row.passport_image}
            alt={`Passport of ${row?.name}`}
            width={100}
            height={100}
            className="h-16 w-16 rounded object-cover"
          />
        ) : (
          <p className="text-gray-500">No Passport Image</p> // Placeholder text
        ),
      wrap: true,
    },

    {
      name: <p className="font-bold text-lg">Experience</p>,
      selector: (row) => row.experience,
      wrap: true,
    },
    
    {
      name: <p className="font-bold text-lg">Passport Expiry</p>,
      selector: (row) => row.passport_expire_date,
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Status</p>,

      selector: (row) => {
        const isAssignedToCurrentOffice = row?.approved_office?.includes(
          user?.office_name
        );
        const isApprovedByCurrentOffice =
          row?.status !== "Pending" &&
          row?.approved_office?.includes(user?.office_name);
        const isPendingAndUnapproved =
          row?.status === "Pending" &&
          (!row?.approved_office || row?.approved_office.length === 0);

        return (
          <div>
            {/* Show the dropdown if it's pending and unapproved, OR if approved by the current office */}
            {isPendingAndUnapproved || isApprovedByCurrentOffice ? (
              <select
                value={row?.status}
                onChange={(e) =>
                  handleStatusUpdate(
                    row._id,
                    e.target.value,
                    user.office_name,
                    setLoading
                  )
                }
                className="border-2 rounded-md p-2 w-full"
              >
                {options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value === "Pending" ? "Available" : option.label}
                  </option>
                ))}
              </select>
            ) : // Show the current status if the office is assigned but cannot edit
            isAssignedToCurrentOffice ? (
              <p className="text-sm text-gray-600">{row.status}</p>
            ) : (
              <p className="text-sm text-gray-500">Not Available</p>
            )}

            {/* Show loading indicator if needed */}
            {loading && (
              <p className="text-sm text-gray-500 mt-1">Updating...</p>
            )}
          </div>
        );
      },
      wrap: true,
      style: { minWidth: "150px" },
    },
    {
      name: <p className="font-bold text-lg">Entry Date</p>,
      selector: (row) => formatDate(row.createdAt),
      wrap: true,
    },
    {
      name: <p className="font-bold text-lg">Print</p>,
      selector: (row) => (
        <Link className="" href={`/UserDashboard/cv/${row?._id}`}>
          <button className="bg-green-600 px-6 py-2 rounded-lg text-white">
            Print CV
          </button>
        </Link>
      ),
      wrap: true,
      style: { minWidth: "150px" },
    },
  ];

  useEffect(() => {
    // Run only on the client
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem("user"))
        : null;
    setUser(storedUser);

    if (!storedUser || storedUser?.role !== "user") {
      router.push("/");
    }
  }, []);

  // const singleUsersData = resume.filter((pax) => {
  //   return (
  //     Array.isArray(pax.office) &&
  //     pax.office.includes(user?.office_name) &&
  //     pax?.approved_office === user?.office_name &&  // Check if approved_office matches user.office_name
  //     pax.status !== "Approved"
  //   );
  // });
  const singleUsersData = resume.filter((pax) => {
    return (
      Array.isArray(pax.office) && pax.office.includes(user?.id)
      //  &&
      // !(pax.status === "Approved" && pax.approved_office && pax.approved_office !== user?.office_name)
    );
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const result = singleUsersData.filter((item) => {
      return (
        item?.name?.toLowerCase().match(search.toLowerCase()) ||
        item?.passport_no?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilter(result);
  }, [search]);

  return (
    <>
      <p className="p-5 text-xl font-bold">Total : {singleUsersData.length}</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>CV Video Preview</DialogTitle>
          </DialogHeader>
          <video
            controls
            className="w-full max-h-[600px] object-cover rounded-md border"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
      <DataTable
        columns={columns}
        data={singleUsersData}
        pagination
        highlightOnHover
        subHeader
        subHeaderComponent={
          <div className="flex justify-between items-center w-full">
            <input
              type="text"
              className="w-25 form-control border-2 border-blue-500 p-2 rounded-md"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />
    </>
  );
};

export default User_Table;
