"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const router = useRouter()
  const HandleLogout = () => {
    localStorage.removeItem("user");
    router.push('/')
  }
  return (
    <nav className="flex items-center top-0 sticky w-full justify-between bg-teal-500 py-3 px-6">
        <Link href="/AdminDashboard" className="flex items-center flex-shrink-0 text-white mr-6 hover:text-pink-800 text-xl cursor-pointer">
          <svg
            className="fill-current h-8 w-8 mr-2"
            width="54"
            height="54"
            viewBox="0 0 54 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
          </svg>
          <span className="font-semibold text-xl tracking-tight">
            CV Builder
          </span>
        </Link>

        <div className="flex gap-3">
            <Link
              href="/AdminDashboard/AddEntry"
              className="inline-block text-md px-4 py-3 leading-none border rounded text-white border-white hover:border-transparent font-bold  hover:text-teal-500 hover:bg-black lg:mt-0"
            >
              Add Resume
            </Link>
            <Link
              href="/AdminDashboard/Users"
              className="inline-block text-md px-4 py-3 leading-none border rounded text-white border-white hover:border-transparent font-bold  hover:text-teal-500 hover:bg-black lg:mt-0"
            >
              Manage Company
            </Link>
            <Link
              href="/AdminDashboard/AddUser"
              className="inline-block text-md px-4 py-3 leading-none border rounded text-white border-white hover:border-transparent font-bold  hover:text-teal-500 hover:bg-black lg:mt-0"
            >
              Add New Company
            </Link>
            <button
             onClick={HandleLogout}
              className="inline-block text-md px-4 py-3 leading-none border rounded text-white border-white hover:border-transparent font-bold  hover:text-teal-500 hover:bg-black lg:mt-0"
            >
              Logout
            </button>
        </div>
      </nav>
  )
}

export default Navbar