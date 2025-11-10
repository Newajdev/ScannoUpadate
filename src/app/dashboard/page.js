"use client";
import Dashboard from "@/components/Dashboard";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const [token, setToken] = useState();
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("Acces-Token");

    if (!storedToken) {
      router.push("/dashboard/login");
    } else {
      
      setToken(storedToken);
    }
  }, []);

  
    return (
      <h1 className="text-white">
        <Dashboard />
      </h1>
    );
  
};

export default page;
