"use client";
import DashboardNav from "@/components/DashboardNav";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const pathName = usePathname();
  const [token, setToken] = useState();
  const router = useRouter();


  useEffect(() => {
    const storedToken = localStorage.getItem("Acces-Token");

    if (!storedToken) {
      router.push("/dashboard/login");
    } else {
      setToken(storedToken);
    }
  }, []);

  return (
    <div>
      {pathName === "/dashboard/login" ||
      pathName === "/dashboard/registration" ? (
        <>{children}</>
      ) : (
        <>
          <div className="flex flex-col md:flex-row h-screen">
            <div className="w-screen  md:w-[25%] lg:w-[15%] md:h-screen ">
              <DashboardNav />
            </div>
            <div className="w-screen md:w-[80%] lg:w-[85%] h-screen md:h-screen flex justify-center items-center p-6">
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
