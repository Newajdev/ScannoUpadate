"use client";
import { AuthContext } from "@/provider/AuthProvider";
import useAxiosPublic from "@/utils/useAxiosPublic";
import React, { useContext, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";


export default function page() {
  const [apikey, setApikey] = useState("");
const axiosPublic = useAxiosPublic();
const { loadding, setLoading } = useContext(AuthContext);

useEffect(() => {
  const fetchApiKey = async () => {
    try {
      const token = localStorage.getItem("Acces-Token");
      if (!token) return;

      const res = await axiosPublic.get("/admin/apikey", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApikey(res.data?.key_preview); 
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  fetchApiKey();
}, [loadding]);  

const hendleAPIkey = async (e) => {
  e.preventDefault();
  const newAPI = e.target.apikey.value;

  setLoading(true);

  try {
    const res = await axiosPublic.post(
      "/admin/apikey",
      { api_key: newAPI },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Acces-Token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200) {

      toast.success("API Key updated successfully", {
        position: "top-center",
        theme: "dark",
      });

    }
  } catch (error) {
    console.log(error);

    if (error.response?.status === 401) {
      toast.error("Unauthorized!", {
        position: "top-center",
        theme: "dark",
      });
    }

    if (error.response?.status === 422) {
      toast.error("Invalid API Key format!", {
        position: "top-center",
        theme: "dark",
      });
    }
  } finally {
    setLoading(false);  
  }
};


  return (
    <div className="text-white w-full flex items-center justify-center flex-col text-center">
      <div className="w-full lg:w-1/2 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
          Hendle Your API keys
        </h2>

        <p className="text-2xl my-6 flex flex-col md:flex-row gap-0 md:gap-3 ">
          <span>Current APIKey:</span>
          <span className="text-[#00a151] font-medium">
            {JSON.stringify(apikey, null, 2)}
          </span>
        </p>

        <form
          onSubmit={hendleAPIkey}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <div className="flex flex-col md:flex-row w-full items-center  gap-x-4 gap-y-2">
            <label htmlFor="apikey" className="text-white text-xl mb-1">
              Update API key
            </label>
            <input
              id="apikey"
              name="apikey"
              type="text"
              placeholder="Paste Api Key"
              className="flex-1 input border-2 border-[#00793D] bg-transparent placeholder:text-white/50 text-white w-full py-3 md:py-0"
            />
          </div>

          <button className="bg-[#00793D] py-2 px-4 text-white font-bold rounded-md">
            {loadding ? (
              <SyncLoader color="#ffffff" size={5} />
            ) : (
              <input type="submit" value={"Update"} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
