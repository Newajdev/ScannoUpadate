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

  const handleCopy = (data, index) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const createHash = (str) =>
    btoa(unescape(encodeURIComponent(str))).slice(0, 12);

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
          const copy = [...prev];
          copy[currentLine] = (copy[currentLine] || "") + line[index];
          return copy;
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
      <pre className="text-sm font-mono whitespace-pre-wrap break-words text-black leading-5">
        {typedLines.join("\n")}
      </pre>
    );
  };

  const LoadingDots = () => {
    const [dots, setDots] = useState("");
    useEffect(() => {
      const interval = setInterval(
        () => setDots((p) => (p.length < 3 ? p + "." : "")),
        500
      );
      return () => clearInterval(interval);
    }, []);
    return <>Analyzing{dots}</>;
  };

  const AnimatedText = ({ msg, loading }) => {
    if (loading) return <LoadingDots />;
    const hash = createHash(msg);
    const key = "text_animated_" + hash;
    const animatedBefore =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;

    useEffect(() => {
      if (!animatedBefore) localStorage.setItem(key, "true");
    }, []);

    if (animatedBefore === "true") return <>{msg}</>;

    return <ReactTyped strings={[msg]} typeSpeed={20} showCursor={false} />;
  };

  return (
    <>
      <div className="pt-24 pb-10 w-[90%] lg:w-[70%] h-full flex flex-col justify-center items-center mx-auto">
        <div className="flex-1 w-full py-2 overflow-y-auto hide-scrollbar">
          {messages.map((msg, idx) => {
            let jsonData = msg.structured_data || msg.raw_report || null;

            if (jsonData && jsonData.human_summary) {
              jsonData = { ...jsonData };
              delete jsonData.human_summary;
            }

            const animId = createHash(JSON.stringify(jsonData || msg.message));

            return (
              <div
                key={idx}
                className={`flex flex-col py-1 w-full ${
                  msg.sender ? "items-start" : "items-end"
                }`}
              >
                {msg.sender ? (
                  <div className="flex flex-col items-start max-w-[95%]">
                    {msg.loading && (
                      <p className="bg-white text-lg px-3 py-2 text-black rounded-t-xl rounded-br-xl shadow">
                        <LoadingDots />
                      </p>
                    )}

                    {!msg.loading && msg.message && !jsonData && (
                      <p className="bg-white text-lg px-3 py-2 text-black rounded-t-xl rounded-br-xl Sender text-justify shadow">
                        <AnimatedText msg={msg.message} loading={false} />
                      </p>
                    )}

                    {jsonData && (
                      <>
                        {msg.message && (
                          <p className="bg-white text-lg px-3 py-2 text-black rounded-t-xl rounded-br-xl Sender text-justify shadow w-full">
                            <AnimatedText msg={msg.message} loading={false} />
                          </p>
                        )}

                        <div className="text-black p-3 rounded-xl bg-white/95 mt-2 shadow w-full">
                          <div className="flex justify-end mb-2">
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

                          <AnimatedJSON json={jsonData} id={animId} />
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="max-w-[80%]">
                    <div className="flex gap-1 flex-wrap justify-end">
                      {msg.images?.map((url, i) => (
                        <div
                          key={i}
                          className="bg-[#00793D] p-1 rounded-2xl mb-1"
                        >
                          <Image
                            src={url.url}
                            alt="img"
                            width={200}
                            height={200}
                            className="rounded-xl object-cover h-[200]"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-1 flex-wrap justify-end">
                      {msg.pdfs?.map((pdf, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 bg-[#00793D] rounded-2xl text-white mb-1"
                        >
                          <Icon icon="mdi:file-pdf-box" className="text-3xl" />
                          <span>{pdf.name}</span>
                        </div>
                      ))}
                    </div>

                    {msg.message && (
                      <p className="text-lg inline-flex px-3 py-2 bg-[#00793D] text-white rounded-t-xl rounded-bl-xl shadow">
                        {msg.message}
                      </p>
                    )}
                  </div>
                )}
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
