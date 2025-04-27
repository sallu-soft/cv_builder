'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const UserNavbar = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
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
      const HandleLogout = () => {
          typeof window !== "undefined"
            ? window.localStorage.removeItem("user")
            : false;
          router.push("/");
        };
  return (
    <nav className="flex items-center top-0 sticky w-full justify-between bg-teal-500 py-3 px-6">
        <Link href="/UserDashboard" className="flex items-center flex-shrink-0 text-white mr-6 hover:text-pink-800 text-xl cursor-pointer">
          {user?.office_name?.toUpperCase()}
        </Link>

        <div className="flex gap-3">
          <button
            onClick={HandleLogout}
            className="inline-block text-md px-4 py-3 leading-none border rounded text-white border-white hover:border-transparent font-bold hover:text-teal-500 hover:bg-black lg:mt-0"
          >
            Logout
          </button>
        </div>
      </nav>
  )
}

export default UserNavbar