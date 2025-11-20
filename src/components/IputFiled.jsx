"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/provider/AuthProvider";
import useAxiosPublic from "@/utils/useAxiosPublic";
import { HashLoader } from "react-spinners";

export default function InputField() {
  const axiosPublic = useAxiosPublic();
  const pathName = usePathname();
  const { isArabic, setMessages, setLoading, loadding } =
    useContext(AuthContext);

  const [showFileOption, setShowFileOption] = useState(false);
  const fileMenuRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);

  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...files]);
    setShowFileOption(false);
  };

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    setPdfs((prev) => [...prev, ...files]);
    setShowFileOption(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target)) {
        setShowFileOption(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;
    const ta = textareaRef.current;

    const lineHeight = 20;
    const maxHeight = lineHeight * 5;

    ta.style.height = "0px";

    const newHeight = ta.scrollHeight;
    ta.style.height = Math.min(newHeight, maxHeight) + "px";

    ta.style.overflowY = newHeight > maxHeight ? "auto" : "hidden";
  }, [message]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const msg = message;

    if (!msg && images.length === 0 && pdfs.length === 0) return;

    setLoading(true);
    setMessage("");

    const userMessage = {
      sender: false,
      message: msg,
      images,
      pdfs,
    };
    setMessages((prev) => [...prev, userMessage]);

    setImages([]);
    setPdfs([]);

    const loadingMsg = {
      sender: true,
      loading: true,
      message: "Analyzing...",
    };
    setMessages((prev) => [...prev, loadingMsg]);

    const formData = new FormData();
    formData.append("session_id", sessionId || "");

    formData.append("message", msg);

    images.forEach((img) => formData.append("files", img.file));
    pdfs.forEach((pdf) => formData.append("files", pdf.file));

    try {
      const res = await axiosPublic.post("/chat/guest/unified", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const report = res.data?.report;
      const returnedSession = res.data?.session_id;

      if (returnedSession && !sessionId) {
        setSessionId(returnedSession);
        console.log("SESSION STORED:", returnedSession);
      }

      setMessages((prev) => prev.filter((m) => !m.loading));

      if (report?.human_summary) {
        setMessages((prev) => [
          ...prev,
          {
            sender: true,
            message: report.human_summary,
            report,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: true,
          message: "No summary received.",
          report,
        },
      ]);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;

        if (status === 413) {
          showNotification("The file is too large to process");
        } else if ([502, 503, 504].includes(status)) {
          showNotification("AI is busy. Try again in a minute.");
        } else {
          showNotification("An unexpected error occurred.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`${
          pathName === "/inbox" ? "w-full" : "w-full md:w-[70%] lg:w-[60%]"
        } mt-3 flex flex-wrap gap-3`}
      >
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img.url}
              alt={img.name}
              className="h-20 bg-white p-1 object-cover rounded-md border"
            />
            <button
              onClick={() =>
                setImages((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              <Icon icon="gridicons:cross" />
            </button>
          </div>
        ))}

        {pdfs.map((pdf, i) => (
          <div
            key={i}
            className="bg-gray-200 px-3 py-1 rounded-md flex items-center relative"
          >
            <Icon icon="mdi:file-pdf-box" className="text-2xl text-red-600" />
            <span className="ml-2 text-sm">{pdf.name}</span>
            <button
              onClick={() =>
                setPdfs((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              <Icon icon="gridicons:cross" />
            </button>
          </div>
        ))}
      </div>

      <div
        className={`${
          pathName === "/inbox" ? "w-full" : "w-[80%] md:w-[70%] lg:w-[50%]"
        } flex border-2 border-[#00793D] px-4 py-2 rounded-full mt-4 shadow-sm`}
      >
        <form
          onSubmit={handleSendMessage}
          className="w-full flex items-center gap-4"
        >
          <div className="relative">
            <Icon
              icon="si:attachment-duotone"
              className="text-[#00793D] cursor-pointer"
              width={24}
              height={24}
              onClick={() => setShowFileOption(!showFileOption)}
            />

            {showFileOption && (
              <div
                ref={fileMenuRef}
                className="absolute bottom-10 left-0 bg-white p-3 rounded-lg shadow-md w-[180px]"
              >
                <label
                  htmlFor="pdf"
                  className="flex items-center gap-2 cursor-pointer mb-4"
                >
                  <Icon
                    icon="lsicon:file-pdf-filled"
                    className="text-red-600 text-2xl"
                  />
                  Upload PDF
                </label>
                <input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  multiple
                  className="hidden"
                  onChange={handlePdfChange}
                />

                <label
                  htmlFor="image"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Icon
                    icon="akar-icons:image"
                    className="text-blue-500 text-2xl"
                  />
                  Upload Images
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          <textarea
            ref={textareaRef}
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.target.form.requestSubmit();
              }
            }}
            rows={1}
            placeholder={
              isArabic
                ? "اسألني عن أي شيء يخص سيارتك…"
                : "Ask me Anything about your car..."
            }
            className="flex-1 bg-transparent text-white placeholder:text-white outline-none resize-none overflow-y-auto hide-scrollbar"
          />

          {loadding ? (
            <HashLoader color="#ffffff" size={25} />
          ) : (
            <button type="submit">
              <Icon
                icon="ri:send-plane-fill"
                className="text-[#00793D]"
                width={24}
                height={24}
              />
            </button>
          )}
        </form>
      </div>
    </>
  );
}
