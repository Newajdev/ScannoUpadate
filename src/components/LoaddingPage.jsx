"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LanddingPage from "./LanddingPage";

export default function LoaddingPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div style={{
                backgroundImage: "url('/assets/background.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
                className="w-screen h-screen flex justify-center items-center "
            >
                <div className="w-[20%] h-[20%] animate-pulse">
                    <Image
                    className="w-full h-full"
                    src={"/assets/LOGO_SCANNOAI.png"}
                    width={300}
                    height={300}
                    alt={"Scanno AI Logo"}
                />
                </div>

            </div>
        );
    }


    return (
        <LanddingPage />
    );
}
