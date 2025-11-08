"use client";
import { redirect } from "next/navigation";

const page = () => {
  const token = localStorage.getItem("Acces-Token");

  if (!token) {
    return redirect("/dashboard/login");
  } else {
    return <h1 className="text-white">This Is Admin Dashboard</h1>;
  }
};

export default page;
