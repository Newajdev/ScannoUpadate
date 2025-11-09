"use client";
import { useContext, useEffect, useRef, useState } from "react";

import IputFiled from "./IputFiled";
import SocialIcon from "./SocialIcon";
import Container from "./Container";
import { AuthContext } from "@/provider/AuthProvider";



export default function LanddingPage() {
  const { isArabic } = useContext(AuthContext)

  return (
    <Container>

      <section className={`flex-1 w-[95%] md:w-[90%] lg:w-[80%] mx-auto flex flex-col justify-center items-center`}>

        <div className=" text-center text-white">
          <h3 className="text-white text-xl md:text-3xl lg:text-5xl font-black text-center animRight">{isArabic ? <span>سكانّو – فحص السيارة الذكي</span> : "SCANNO - Smart Car Inspection"}</h3>
          <p className="text-sm md:text-lg lg:text-xl font-medium text-center mt-10 mb-3">{isArabic ? "أنا سكانّو – خبير فحص السيارات الذكي عندك في قطر" : "I’m Scanno - your smart car inspection expert in Qatar"}</p>
          <p className="text-sm md:text-lg lg:text-xl text-center mb-10">{isArabic ? "حمّل تقريرك أو اسألني عن حالة موترك." : "Upload your report or ask me about your car’s condition"}</p>
        </div>

        <IputFiled/>
      </section>

      <SocialIcon isArabic={isArabic} />
    </Container>
  );
};
