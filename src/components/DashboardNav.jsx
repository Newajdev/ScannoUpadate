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
    <div className="lg:h-screen flex lg:flex-col flex-row bg-black/30 border-r-2 border-white/20 items-center justify-between text-white">
      <div className="w-[150px] h-[69px] mt-10 mb-24">
        <Image
          className="w-full h-full"
          src={"/assets/LOGO_SCANNOAI.png"}
          width={300}
          height={300}
          alt={"Scanno AI Logo"}
        />
      </div>
      <div className="flex-1">
        {DashNavLinks.map((link, idx) => {
          return (
            <div key={idx} className={`${pathName === link.pathname
                    ? "text-[#00793D]"
                    : "text-white"} py-4 `}>
              <Link href={link.pathname} className="flex gap-3 items-center">
                <h3 className="">
                  {pathName === link.pathname
                    ? link.iconactive
                    : link.iconNormal}
                </h3>
                <h3 className="font-medium lg:block hidden">{link.title}</h3>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
