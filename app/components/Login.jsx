"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { processLogin } from "@/lib/actions";

// Server Action for login

const Login = () => {
  const [user, setUser] = useState({
    office_email: "",
    office_password: "",
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("office_email", user.office_email);
    formData.append("office_password", user.office_password);
    try {
      const response = await processLogin(formData);
      
        localStorage.setItem("user", JSON.stringify(response.user));
      alert("Successfully Logged In!");
    
      if (response.user.role === "admin" ) {
        router.push("/AdminDashboard");
      } else {
        router.push("/UserDashboard");
      }
      
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-fit max-w-fit flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white shadow-xl rounded-lg border-2 border-pink-600">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Log in
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              User Name
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setUser({ ...user, office_email: e.target.value })}
                value={user.name}
                id="office_email"
                name="office_email"
                type="email"
                required
                className="block px-2 w-full min-w-[300px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setUser({ ...user, office_password: e.target.value })}
                value={user.password}
                id="office_password"
                name="office_password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;