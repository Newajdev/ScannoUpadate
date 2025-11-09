import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

export default function SocialIcon({ isArabic }) {
  return (
    <div
      className={`absolute top-[8%] lg:top-1/2 translate-y-1/2 left-1/2 -translate-x-1/2  ${
        isArabic
          ? "lg:left-[80%]  lg:translate-y-1/2"
          : "lg:left-60 lg:translate-y-1/2"
      } text-white flex flex-col lg:flex-row items-center gap-3 lg:gap-6 rotate-0 lg:-rotate-90`}
    >
      <h1 className="text-md md:text-xl lg:text-2xl font-bold">Follow Us</h1>

      <div className="flex flex-row-reverse gap-2 md:gap-4">
        <Link
          target="_blank"
          href={"https://www.facebook.com/profile.php?id=61579836350585"}
          className="border rounded-full flex items-center justify-center lg:rounded-none p-2  w-10 h-10"
        >
          <Icon
            className="text-xl lg:text-2xl rotate-0 lg:rotate-90 lg:hover:text-red-700 lg:hover:p-0.5 lg:duration-300"
            icon="bi:facebook"
          />
        </Link>
        <Link
          target="_blank"
          href={"https://www.instagram.com/scannoqa"}
          className="border rounded-full flex items-center justify-center lg:rounded-none p-2  w-10 h-10"
        >
          <Icon
            className="text-xl lg:text-2xl rotate-0 lg:rotate-90 lg:hover:text-red-700 lg:hover:p-0.5 lg:duration-300"
            icon="hugeicons:instagram"
          />
        </Link>
        <Link
          target="_blank"
          href={
            "https://api.whatsapp.com/send/?phone=97466534745&text&type=phone_number&app_absent=0"
          }
          className="border rounded-full flex items-center justify-center lg:rounded-none p-2  w-10 h-10"
        >
          <Icon
            className="text-xl md:text-2xl rotate-0 lg:rotate-90 lg:hover:text-red-700 lg:hover:p-0.5 lg:duration-300"
            icon="mdi:whatsapp"
          />
        </Link>
      </div>
    </div>
  );
}
