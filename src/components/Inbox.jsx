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

  const cleanObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj
        .map((item) => cleanObject(item))
        .filter((item) => item && Object.keys(item).length > 0);
    }

    if (typeof obj === "object" && obj !== null) {
      const cleaned = {};

      Object.entries(obj).forEach(([key, value]) => {
        const v = cleanObject(value);

        if (
          v !== "" &&
          v !== null &&
          v !== undefined &&
          !(typeof v === "object" && Object.keys(v).length === 0)
        ) {
          cleaned[key] = v;
        }
      });

      return Object.keys(cleaned).length === 0 ? null : cleaned;
    }

    return obj;
  };

  const handleCopy = (data, index) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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

  return (
    <>
      <div className="pt-24 pb-10 w-[90%] lg:w-[70%] h-full flex flex-col justify-center items-center mx-auto">
        <div className="flex-1 w-full py-2 overflow-y-auto hide-scrollbar">
          {messages.map((msg, idx) => {
            const cleanedJSON = msg.structured_data
              ? cleanObject(msg.structured_data)
              : null;

            const animId = btoa(
              JSON.stringify(cleanedJSON || msg.message)
            ).slice(0, 10);

            return (
              <div
                key={idx}
                className={`flex flex-col py-0.5 w-full ${
                  msg.sender ? "items-start" : "items-end"
                }`}
              >
                <div>
                  {msg.sender ? (
                    <div className="flex flex-col items-start mr-8 md:mr-24 lg:mr-32">
                      {msg.message && !msg.structured_data && (
                        <p className="bg-white text-lg inline-flex px-3 py-2 text-black rounded-t-xl rounded-br-xl">
                          <ReactTyped
                            strings={[msg.message]}
                            typeSpeed={20}
                            showCursor={false}
                          />
                        </p>
                      )}

                      {cleanedJSON && (
                        <div className="text-black p-3 rounded-xl mb-2 bg-white/80 mt-2 relative">
                          <div className="sticky top-0 pb-2 flex justify-end z-10">
                            <button
                              onClick={() => handleCopy(cleanedJSON, idx)}
                              className="text-sm bg-gray-300 px-2 py-1 rounded flex items-center gap-1"
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

                          <AnimatedJSON json={cleanedJSON} id={animId} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
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
