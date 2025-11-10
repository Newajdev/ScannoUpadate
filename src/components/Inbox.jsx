"use client";

import React, { useContext, useEffect, useRef } from "react";
import InputField from "./IputFiled";
import { AuthContext } from "@/provider/AuthProvider";
import { ReactTyped } from "react-typed";
import Image from "next/image";
import { Icon } from "@iconify/react";

const Inbox = () => {
  const { messages, loading } = useContext(AuthContext);
  const bottomRef = useRef(null);


 

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <div className="pt-24 pb-10 w-[90%] lg:w-[70%] h-full flex flex-col justify-center items-center mx-auto">
        <div className="flex-1 w-full py-4 overflow-y-auto ">
            <div className="h-full flex flex-col">
              <div className="w-full flex-1 overflow-y-scroll hide-scrollbar h-full">
                <div className="flex flex-col justify-between">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col py-0.5 w-full ${
                        msg.sender ? "items-start" : "items-end"
                      }`}
                    >
                      <div>
                        {msg.sender ? (
                          <p className="text-lg inline-flex px-3 py-2 relative bg-gray-50 text-black rounded-t-xl rounded-br-xl Sender mr-8 md:mr-24 lg:mr-32 text-justify">
                            <ReactTyped
                              strings={[msg.message]}
                              typeSpeed={20}
                              showCursor={false}
                            />
                          </p>
                        ) : (
                          <div>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {msg.images?.map((url, idx) => (
                                <div>
                                  <div
                                    key={idx}
                                    className="p-1 bg-[#00793D]  rounded-2xl mb-1 h-32 w-fit flex justify-end "
                                  >
                                    <Image
                                      src={url.url}
                                      alt={url.url}
                                      width={200}
                                      height={200}
                                      className=" rounded-xl"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {msg.pdfs?.map((pdf, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 bg-[#00793D] rounded-2xl mb-1 text-white"
                                >
                                  <Icon
                                    icon="mdi:file-pdf-box"
                                    className="text-white text-3xl"
                                  />
                                  <span className="text-sm">{pdf.name}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {msg.message && (
                                <p className="text-lg inline-flex px-3 py-2 relative bg-[#00793D] text-white rounded-t-xl rounded-bl-xl Reciver text-right">
                                  {msg.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="text-white px-3 py-2 italic">
                      <span className="animate-pulse">
                        I am analyzing your car...
                      </span>
                    </div>
                  )}

                  <div ref={bottomRef}></div>
                </div>
              </div>
            </div>
          </div>
        <InputField />
      </div>
    </>
  );
};

export default Inbox;
