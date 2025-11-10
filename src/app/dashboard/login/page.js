"use client";
import { AuthContext } from "@/provider/AuthProvider";
import useAxiosPublic from "@/utils/useAxiosPublic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { SyncLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

export default function page() {
  const { loadding, setLoading } = useContext(AuthContext);
  const Navigate = useRouter();
  const AxiosPublic = useAxiosPublic();

  const hendleLogin = (e) => {
    e.preventDefault();

    const email = e.target?.email?.value;
    const password = e.target?.password?.value;
    const data = { email, password };

    if (!email) {
      toast.error("Please File up the Email field", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (!password) {
      toast.error("Please File up the password field", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      setLoading(true);
    }

    AxiosPublic.post("/admin/login", data)
      .then((res) => {
        if (res.data.access_token) {
          localStorage.setItem("Acces-Token", res.data.access_token);
        }
        if (res.status === 200) {
          toast.success("Welcome Back!", {
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
          toast.error("one or more creadetion are wrong", {
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
            setLoading(false);
          }, 1000);
        }
      });
  };


  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <ToastContainer />
      <div className="w-[200px] h-[89px] md:w-[250px] md:h-[111px]">
        <Link href={"/"}>
          <Image
            className="w-full h-full"
            src={"/assets/LOGO_SCANNOAI.png"}
            width={300}
            height={300}
            alt={"Scanno AI Logo"}
          />
        </Link>
      </div>

      <div className="flex flex-col justify-center items-center w-[80%] md:w-[60%] lg:w-[30%] py-10 gap-6">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Login</h2>
        <form onSubmit={hendleLogin} className="flex flex-col w-full gap-4">
          <div>
            <label htmlFor="email" className="text-white text-xl mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="example@gmail.com"
              className="input border-2 border-[#00793D] bg-transparent placeholder:text-white/50 text-white w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-white text-xl mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password"
              className="input border-2 border-[#00793D] bg-transparent placeholder:text-white/50 text-white w-full"
            />
          </div>

          <button className="bg-[#00793D] py-4 mt-4 text-white font-bold rounded-md">
            {loadding ? (
              <SyncLoader color="#ffffff" size={10} />
            ) : (
              <input type="submit" value={"Login"} />
            )}
          </button>
        </form>
        <p className="text-sm text-white flex gap-x-2">
          Don't Have and Account?{" "}
          <Link href={"/dashboard/registration"}>
            <span className="text-md font-bold text-[#00793D]">
              Registration
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
