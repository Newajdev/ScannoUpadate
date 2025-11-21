"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import IputFiled from "./IputFiled";
import { AuthContext } from "@/provider/AuthProvider";
import Image from "next/image";
import { Icon } from "@iconify/react";
import ReactMarkdown from "react-markdown";

const Inbox = () => {
  const { messages } = useContext(AuthContext);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const AnimatedText = ({ msg, isLatest }) => {
    const [text, setText] = useState("");

    // REMOVE ALL DOUBLE LINE SPACING
    const normalized = (msg?.replace(/\r\n/g, "\n") ?? "").replace(
      /\n\s*\n/g,
      "\n"
    );

    useEffect(() => {
      if (!isLatest) {
        setText(normalized);
        return;
      }

      let i = 0;
      setText("");

      const interval = setInterval(() => {
        setText(normalized.slice(0, i + 1));
        i++;

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
            <p className="m-0 p-0 whitespace-pre-line leading-[1.2]">
              {children}
            </p>
          ),
          li: ({ children }) => (
            <li className="m-0 p-0 whitespace-pre-line leading-[1.2]">
              {children}
            </li>
          ),
          ul: ({ children }) => (
            <ul className="m-0 p-0 whitespace-pre-line leading-[1.2]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="m-0 p-0 whitespace-pre-line leading-[1.2]">
              {children}
            </ol>
          ),
          h1: ({ children }) => (
            <h1 className="m-0 p-0 whitespace-pre-line leading-[1.2] font-bold">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="m-0 p-0 whitespace-pre-line leading-[1.2] font-bold">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="m-0 p-0 whitespace-pre-line leading-[1.2] font-bold">
              {children}
            </h3>
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
                {msg.sender ? (
                  <div className="flex flex-col items-start max-w-[95%]">
                    {msg.loading && (
                      <div className="bg-white text-lg px-3 py-2 text-black rounded-t-xl rounded-br-xl shadow">
                        <LoadingDots />
                      </div>
                    )}

                    {!msg.loading && finalMessage && (
                      <div className="bg-white text-lg px-3 py-2 text-black rounded-t-xl rounded-br-xl shadow leading-[1.2]">
                        <AnimatedText
                          msg={finalMessage}
                          isLatest={isLatestAI}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="max-w-[80%]">
                    <div className="flex gap-1 flex-wrap justify-end">
                      {msg.images?.map((img, i) => (
                        <div
                          key={i}
                          className="bg-[#00793D] p-1 rounded-2xl mb-1"
                        >
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
                      <div className="text-lg inline-flex px-3 py-2 bg-[#00793D] text-white rounded-t-xl rounded-bl-xl shadow leading-[1.2] whitespace-pre-line">
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

        <IputFiled />
      </div>
    </>
  );
};

export default Inbox;
