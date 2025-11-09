"use client";

import { AuthContext } from "@/provider/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export default function Navbar() {
  const { isArabic, setIsArabic } = useContext(AuthContext);
  const pathName = usePathname();

  return (
    <>
      {pathName.startsWith("/dashboard") ? (
        ""
      ) : (
        <nav className="fixed top-0 w-full bg-black/25 pt-4 pb-1 px-3 md:px-10 lg:px-20 flex justify-between items-center border border-b-gray-50/20 ">
          <div className="w-[90px] h-10 md:w-[120px] md:h-[53px] lg:w-[150px] lg:h-[67px]">
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
          {!(pathName === "/inbox") && (
            <div
              onClick={() => setIsArabic(!isArabic)}
              className="relative flex items-center w-16 h-8 md:w-20 md:h-10 lg:w-24 lg:h-12 bg-green-700 rounded-full cursor-pointer transition-all duration-300"
            >
              <div
                className={`absolute w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center font-bold text-green-700 transition-all duration-300 text-sm md:text-md lg:text-xl ${
                  isArabic ? "translate-x-8 md:translate-x-11 lg:translate-x-[52px]" : "translate-x-1"
                }`}
              >
                {isArabic ? "AR" : "EN"}
              </div>
              <div className="flex justify-between w-full px-2 md:px-2.5 lg:px-4 text-white font-bold text-sm md:text-lg lg:text-xl">
                <h3>EN</h3>
                <h3>AR</h3>
              </div>
            </div>
          )}
        </nav>
      )}
    </>
  );
}
