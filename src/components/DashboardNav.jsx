"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashboardNav() {
  const pathName = usePathname();
  const DashNavLinks = [
    {
      iconNormal: (
        <Icon
          icon="material-symbols-light:dashboard-outline-rounded"
          width="32"
          height="32"
        />
      ),
      iconactive: (
        <Icon
          icon="material-symbols-light:dashboard-rounded"
          width="32"
          height="32"
        />
      ),
      pathname: "/dashboard",
      title: "Dashboard",
    },
    {
      iconNormal: <Icon icon="mynaui:api" width="32" height="32" />,
      iconactive: <Icon icon="mynaui:api-solid" width="32" height="32" />,
      pathname: "/dashboard/change-apikey",
      title: "Change Key",
    },
    {
      iconNormal: <Icon icon="ph:users-three-light" width="32" height="32" />,
      iconactive: <Icon icon="ph:users-three-fill" width="32" height="32" />,
      pathname: "/dashboard/user-list",
      title: "User List",
    },
  ];
  return (
    <div className="md:h-screen flex md:flex-col flex-row bg-black/30 border-r-2 border-white/20 items-center justify-between text-white px-3 md:px-o">
      <div className="w-24 h-[43px] md:w-28 md:h-[50px] lg:w-[150px] lg:h-[67px] mt-3 mb-3  md:mt-10 md:mb-24">
        <Image
          className="w-full h-full"
          src={"/assets/LOGO_SCANNOAI.png"}
          width={300}
          height={300}
          alt={"Scanno AI Logo"}
        />
      </div>
      <div className="md:flex-1 flex flex-row gap-6 md:gap-0 md:flex-col">
        {DashNavLinks.map((link, idx) => {
          return (
            <div
              key={idx}
              className={`${
                pathName === link.pathname ? "text-[#00793D]" : "text-white"
              } py-4 `}
            >
              <Link href={link.pathname} className="flex gap-3 items-center">
                <h3 className="">
                  {pathName === link.pathname
                    ? link.iconactive
                    : link.iconNormal}
                </h3>
                <h3 className="font-medium md:block hidden">{link.title}</h3>
              </Link>
            </div>
          );
        })}
      </div>
      <div>
        <button
          onClick={() => localStorage.removeItem("Acces-Token")}
          className="md:pb-10"
        >
          <Link href={"/"} className="flex gap-3 font-bold text-red-500">
            <Icon icon="heroicons-outline:logout" width="24" height="24" />{" "}
            <span className="font-medium md:block hidden">Logout</span>
          </Link>
        </button>
      </div>
    </div>
  );
}
