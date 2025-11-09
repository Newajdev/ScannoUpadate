"use client"
import DashboardNav from "@/components/DashboardNav";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathName = usePathname();

  return (
    <div>
      {pathName === "/dashboard/login" || "/dashboard/registration" ? (
        <>{ children }</>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row">
            <div className="w-screen  lg:w-[15%] lg:h-screen">
                <DashboardNav/>
            </div>
            <div className="w-screen lg:w-[85%] lg:h-screen flex justify-center items-center h-screen">{children}</div>
          </div>
        </>
      )}
    </div>
  );
}
