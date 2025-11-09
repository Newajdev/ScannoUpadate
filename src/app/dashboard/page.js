"use client";
import Dashboard from "@/components/Dashboard";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  // const [token, setToken] = useState();
  const token = localStorage.getItem("Acces-Token");

  // useEffect(() => {
  //   const storedToken = localStorage.getItem("Acces-Token");
  //   setToken(storedToken);
  // }, []);

  if (!token) {
    return redirect("/dashboard/login");
  } else {
    return (
      <h1 className="text-white">
        <Dashboard />
      </h1>
    );
  }
};

export default page;
