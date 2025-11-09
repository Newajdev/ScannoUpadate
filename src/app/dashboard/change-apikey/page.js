"use client";
import { AuthContext } from "@/provider/AuthProvider";
import useAxiosPublic from "@/utils/useAxiosPublic";
import React, { useContext, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function page() {
  const [apikey, setApikey] = useState();
  const AxiosPublic = useAxiosPublic();
  const { loadding, setLoading } = useContext(AuthContext);

  useEffect(() => {
    // const res =  AxiosPublic.get("/admin/apikey", {
    //   headers: {
    //     token: `Bearer ${localStorage.getItem("Acces-Token")}`,
    //   },
    // });
    // setApikey(res);
  }, []);

  const hendleLogin = (e) => {
    e.preventDefault();

    const newAPI = e.target?.apikey?.value;

    setLoading(true);

    AxiosPublic.post("/admin/apikey", newAPI, {
      headers: {
        token: `Bearer ${localStorage.getItem("Acces-Token")}`,
      },
    })
      .then((res) => {
        if (res.data.access_token) {
          localStorage.setItem("Acces-Token", res.data.access_token);
        }
        if (res.status === 200) {
          toast.success("API key updated Succesfully", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setTimeout(() => {
            Navigate.push("/dashboard");
            setLoading(false);
          }, 1000);
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.error("Somthing wrong", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  };

  return (
    <div className="text-white w-full flex items-center justify-center flex-col">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold text-center mb-4">Hendle Your API keys</h2>

        <p className="text-2xl my-6">
          Current APIKey:{" "}
          <span className="text-[#00793D] font-medium">{apikey}</span>
        </p>

        <form
          onSubmit={hendleLogin}
          className="flex items-center gap-4"
        >
          <div className="flex w-full items-center gap-x-4">
            <label htmlFor="apikey" className="text-white text-xl mb-1">
              Update API key
            </label>
            <input
              id="apikey"
              name="apikey"
              type="text"
              placeholder="Paste Api Key"
              className="flex-1 input border-2 border-[#00793D] bg-transparent placeholder:text-white/50 text-white w-full"
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
