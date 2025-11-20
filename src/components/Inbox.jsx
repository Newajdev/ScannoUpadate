"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import IputField from "./IputFiled";
import { AuthContext } from "@/provider/AuthProvider";
import Image from "next/image";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown";

const Inbox = () => {
  const { messages } = useContext(AuthContext);
  const bottomRef = useRef(null);

  // Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- Loading Dots ---------------- */
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

  /* ---------------- Latest-only Animation ---------------- */
  const AnimatedText = ({ msg, isLatest }) => {
    const [text, setText] = useState("");

    const normalized = msg?.replace(/\r\n/g, "\n") ?? "";

    useEffect(() => {
      // ❗ পুরোনো message → কোনো animation হবে না
      if (!isLatest) {
        setText(normalized);
        return;
      }

      // Latest message → typing effect
      let i = 0;
      setText("");

      const interval = setInterval(() => {
        setText(normalized.slice(0, i + 1));
        i++;

        // Auto scroll during typing
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

        if (i >= normalized.length) {
          clearInterval(interval);
        }
      }, 12);

      return () => clearInterval(interval);
    }, [normalized, isLatest]);

    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="m-0 p-0 whitespace-pre-wrap leading-[1.35]">
              {children}
            </p>
          ),
          li: ({ children }) => (
            <li className="m-0 p-0 whitespace-pre-wrap leading-[1.35]">
              {children}
            </li>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <>
      <div className="pt-24 pb-10 w-[90%] lg:w-[70%] h-full flex flex-col justify-center items-center mx-auto">

        <div className="flex-1 w-full py-2 overflow-y-auto hide-scrollbar">

          {messages.map((msg, idx) => {
            const finalMessage =
              msg?.message ?? msg?.report?.human_summary ?? "";

            const isLatestAI =
              msg.sender === true && idx === messages.length - 1;

            return (
              <div
                key={idx}
                className={`flex flex-col py-1 w-full ${
                  msg.sender ? "items-start" : "items-end"
                }`}
              >

                {/* AI MESSAGE */}
                {msg.sender ? (
                  <div className="flex flex-col items-start max-w-[95%]">
                    {msg.loading && (
                      <div className="bg-white text-lg px-3 py-2 text-black rounded-t-xl rounded-br-xl shadow">
                        <LoadingDots />
                      </div>
                    )}

                    {!msg.loading && finalMessage && (
                      <div className="bg-white text-lg px-3 py-2 text-black rounded-t-xl rounded-br-xl shadow leading-[1.35]">
                        <AnimatedText
                          msg={finalMessage}
                          isLatest={isLatestAI}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  /* USER MESSAGE */
                  <div className="max-w-[80%]">

                    {/* IMAGES */}
                    <div className="flex gap-1 flex-wrap justify-end">
                      {msg.images?.map((img, i) => (
                        <div key={i} className="bg-[#00793D] p-1 rounded-2xl mb-1">
                          <Image
                            src={img.url}
                            alt="img"
                            width={200}
                            height={200}
                            className="rounded-xl object-cover w-full h-[200]"
                          />
                        </div>
                      ))}
                    </div>

                    {/* PDF FILES */}
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

                    {finalMessage && (
                      <div className="text-lg inline-flex px-3 py-2 bg-[#00793D] text-white rounded-t-xl rounded-bl-xl shadow leading-[1.35] whitespace-pre-wrap">
                        <ReactMarkdown>{finalMessage}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>

        <IputField />
      </div>
    </>
  );
};

export default Inbox;
