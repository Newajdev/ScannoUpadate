"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import InputField from "./IputFiled";
import { AuthContext } from "@/provider/AuthProvider";
import { ReactTyped } from "react-typed";
import Image from "next/image";
import { Icon } from "@iconify/react";

const Inbox = () => {
  const { messages } = useContext(AuthContext);
  const bottomRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ⭐ COPY BUTTON
  const handleCopy = (data, index) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ⭐ UNIQUE HASH FOR ONE-TIME ANIMATION
  const createHash = (str) =>
    btoa(unescape(encodeURIComponent(str))).slice(0, 12);

  // ⭐ JSON Animated Renderer (ONE-TIME animation)
  const AnimatedJSON = ({ json, id }) => {
    const key = `json_anim_${id}`;
    const lines = JSON.stringify(json, null, 2).split("\n");

    const alreadyPlayed =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;

    const [typedLines, setTypedLines] = useState(alreadyPlayed ? lines : []);
    const [currentLine, setCurrentLine] = useState(0);

    useEffect(() => {
      if (alreadyPlayed) return;

      const line = lines[currentLine];
      let index = 0;

      const interval = setInterval(() => {
        setTypedLines((prev) => {
          const arr = [...prev];
          arr[currentLine] = (arr[currentLine] || "") + line[index];
          return arr;
        });

        index++;

        if (index === line.length) {
          clearInterval(interval);

          if (currentLine + 1 < lines.length) {
            setTimeout(() => setCurrentLine(currentLine + 1), 50);
          } else {
            localStorage.setItem(key, "true");
          }
        }
      }, 8);

      return () => clearInterval(interval);
    }, [currentLine]);

    return (
      <div className="text-sm font-mono whitespace-pre-wrap text-black mt-1">
        {typedLines.map((l, i) => (
          <div key={i} className="whitespace-pre">
            {l}
          </div>
        ))}
      </div>
    );
  };

  // ⭐ CHATGPT STYLE LOADING ANIMATION
  const LoadingDots = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    }, []);

    return <>Analyzing{dots}</>;
  };

  // ⭐ TEXT ANIMATION FIXED FOR ONE-TIME ONLY
  const AnimatedText = ({ msg, loading }) => {
    if (loading) return <LoadingDots />;

    const hash = createHash(msg);
    const key = "text_animated_" + hash;
    const animatedBefore =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;

    useEffect(() => {
      if (!animatedBefore) {
        localStorage.setItem(key, "true");
      }
    }, []);

    if (animatedBefore === "true") return <>{msg}</>;

    return <ReactTyped strings={[msg]} typeSpeed={20} showCursor={false} />;
  };

  return (
    <>
      <div className="pt-24 pb-10 w-[90%] lg:w-[70%] h-full flex flex-col justify-center items-center mx-auto">
        <div className="flex-1 w-full py-2 overflow-y-auto hide-scrollbar">
          {messages.map((msg, idx) => {
            const jsonData = msg.structured_data || null;
            const animId = createHash(JSON.stringify(jsonData || msg.message));

            return (
              <div
                key={idx}
                className={`flex flex-col py-0.5 w-full ${
                  msg.sender ? "items-start" : "items-end"
                }`}
              >
                <div>
                  {/* ⭐ AI MESSAGES */}
                  {msg.sender ? (
                    <div className="flex flex-col items-start mr-8 md:mr-24 lg:mr-32">
                      {/* 🌟 SHOW LOADING WHEN API PROCESSING */}
                      {msg.loading && (
                        <p className="bg-white text-lg inline-flex px-3 py-2 text-black rounded-t-xl rounded-br-xl">
                          <LoadingDots />
                        </p>
                      )}

                      {/* 🌟 NORMAL TEXT (ANIMATED ONCE) */}
                      {!msg.loading && msg.message && !jsonData && (
                        <p className="bg-white text-lg inline-flex px-3 py-2 text-black rounded-t-xl rounded-br-xl Sender text-justify">
                          <AnimatedText msg={msg.message} loading={false} />
                        </p>
                      )}

                      {/* 🌟 STRUCTURED JSON BLOCK */}
                      {jsonData && (
                        <div className="text-black p-3 rounded-xl mb-2 bg-white/80 mt-2 relative">
                          {/* COPY BUTTON */}
                          <div className="sticky top-0 pb-2 z-10 flex justify-end">
                            <button
                              onClick={() => handleCopy(jsonData, idx)}
                              className="text-sm bg-gray-300 px-2 py-1 rounded hover:bg-gray-400 transition flex items-center gap-1"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Icon
                                    icon="mdi:check-bold"
                                    className="text-green-600 text-lg"
                                  />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Icon
                                    icon="mdi:content-copy"
                                    className="text-black text-lg"
                                  />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>

                          {/* JSON ANIMATED */}
                          <AnimatedJSON json={jsonData} id={animId} />
                        </div>
                      )}
                    </div>
                  ) : (
                    // ⭐ USER MESSAGES
                    <div>
                      {/* USER IMAGES */}
                      <div className="flex gap-1 flex-wrap justify-end">
                        {msg.images?.map((url, i) => (
                          <div key={i}>
                            <div className="p-1 bg-[#00793D] rounded-2xl h-32 mb-1 flex justify-end">
                              <Image
                                src={url.url}
                                alt={url.url}
                                width={200}
                                height={200}
                                className="rounded-xl"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* USER PDFS */}
                      <div className="flex gap-1 flex-wrap justify-end">
                        {msg.pdfs?.map((pdf, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 bg-[#00793D] rounded-2xl text-white mb-1"
                          >
                            <Icon
                              icon="mdi:file-pdf-box"
                              className="text-white text-3xl"
                            />
                            <span>{pdf.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* USER TEXT */}
                      {msg.message && (
                        <p className="text-lg inline-flex px-3 py-2 bg-[#00793D] text-white rounded-t-xl rounded-bl-xl">
                          {msg.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>

        <InputField />
      </div>
    </>
  );
};

export default Inbox;
