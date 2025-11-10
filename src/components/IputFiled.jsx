"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/provider/AuthProvider";
import useAxiosPublic from "@/utils/useAxiosPublic";


export default function InputField() {
  const axiosPublic = useAxiosPublic();
  const navigate = useRouter();
  const pathName = usePathname();
  const { isArabic, setMessages } = useContext(AuthContext);

  const [showFileOption, setShowFileOption] = useState(false);
  const fileMenuRef = useRef(null);

  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);

  // ✅ Preview + Keep File object
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...mapped]);
    setShowFileOption(false);
  };

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    setPdfs((prev) => [...prev, ...mapped]);
    setShowFileOption(false);
  };

  // ✅ Hide menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target)) {
        setShowFileOption(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Submit Handler
  const handleSendMessage =  (e) => {
    e.preventDefault();

    const msg = e.target.message.value;

    if (!msg && images.length === 0 && pdfs.length === 0) return;

    // ✅ Add user message to UI
    const newMessage = {
      id: Date.now(),
      sender: false,
      message: msg,
      images,
      pdfs,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // ✅ Build FormData for backend
    const formData = new FormData();
    formData.append("session_id", "session-12345");
    formData.append("message", msg);

    images.forEach((img) => formData.append("images", img.file));
    pdfs.forEach((pdf) => formData.append("pdfs", pdf.file));

    try {
      const res =  axiosPublic.post("/chat/guest/unified", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const aiResponse = res.data?.report?.response || "No response found!";

      // ✅ Add AI response to UI
      setMessages((prev) => [
        ...prev,
        {
          sender: true,
          message: aiResponse,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);

      setMessages((prev) => [
        ...prev,
        { sender: true, message: "Server error. Please try again later." },
      ]);
    }

    // ✅ Clear everything
    setImages([]);
    setPdfs([]);
    e.target.reset();

    navigate.push("/inbox");
  };

  return (
    <>
      {/* File Previews */}
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

      {/* Input Box */}
      <div
        className={`${
          pathName === "/inbox" ? "w-full" : "w-[80%] md:w-[70%] lg:w-[50%]"
        } flex border-2 border-[#00793D] px-4 py-2 rounded-full mt-4 shadow-sm`}
      >
        <form
          onSubmit={handleSendMessage}
          className="w-full flex items-center gap-4"
        >
          {/* File option icon */}
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

          {/* Text Input */}
          <input
            type="text"
            name="message"
            placeholder={
              isArabic
                ? "اسألني عن أي شيء يخص سيارتك…"
                : "Ask me Anything about your car..."
            }
            className="flex-1 bg-transparent text-white placeholder:text-white outline-none"
          />

          {/* Send Button */}
          <button type="submit">
            <Icon
              icon="ri:send-plane-fill"
              className="text-[#00793D]"
              width={24}
              height={24}
            />
          </button>
        </form>
      </div>
    </>
  );
}

// "use client";
// import { AuthContext } from "@/provider/AuthProvider";
// import { Icon } from "@iconify/react";
// import { usePathname, useRouter } from "next/navigation";
// import React, { useContext, useEffect, useRef, useState } from "react";

// export default function InputField() {
//   const { isArabic, setMessages } = useContext(AuthContext);
//   const [showFileOption, setShowFileOption] = useState(false);
//   const clickRef = useRef(null);
//   const [images, setImages] = useState([]);
//   const [pdfs, setPdfs] = useState([]);
//   const pathName = usePathname();
//   const navigate = useRouter();

//   const handleSendMessage = (e) => {
//     e.preventDefault();

//     console.log(e);

//     const formData = new FormData(e.target);
//     const Message = formData.get("message");

//     console.log(formData);

//     const newMessage = {
//       id: Date.now(),
//       message: Message || "",
//       pdfs: pdfs,
//       images: images,
//       time: new Date().toLocaleTimeString(),
//       sender: false,
//     };

//     const Messages = [
//       { sender: false, message: "Do you able to inspate my car report" },
//       {
//         sender: true,
//         message:
//           "Yes, I can inspect your car report based on your PDF or image. If you send me your file, I will check it carefully and provide you with a detailed inspection report along with the best suggestions. Do you agree to send me your file?",
//       },
//     ];

//     setMessages(Messages);
//     setMessages((prev) => [...prev, newMessage]);

//     setImages([]);
//     setPdfs([]);
//     e.target.reset();
//     navigate.push("/inbox");
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newPreviews = files.map((file) => ({
//       name: file.name,
//       url: URL.createObjectURL(file),
//     }));

//     setImages((prev) => [...prev, ...newPreviews]);
//     setShowFileOption(false);
//   };
//   const handlePdfChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newPdfs = files.map((file) => ({
//       name: file.name,
//       url: URL.createObjectURL(file),
//     }));

//     setPdfs((prev) => [...prev, ...newPdfs]);
//     setShowFileOption(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (clickRef.current && !clickRef.current.contains(event.target)) {
//         setShowFileOption(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <>
//       <div
//         className={`${
//           pathName === "/inbox" ? "w-full" : "w-full md:w-[70%] lg:w-[60%]"
//         } mt-3 flex flex-wrap gap-3 justify-start items-start`}
//       >
//         {images.map((img, idx) => (
//           <div key={idx} className="relative">
//             <img
//               src={img.url}
//               alt={img.name}
//               className="h-20 bg-white p-1 object-cover rounded-md border"
//             />
//             <button
//               onClick={() =>
//                 setImages((prev) => prev.filter((_, i) => i !== idx))
//               }
//               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//             >
//               <Icon icon="gridicons:cross" width="24" height="24" />
//             </button>
//           </div>
//         ))}

//         {pdfs.map((pdf, idx) => (
//           <div
//             key={idx}
//             className="flex justify-start items-start bg-gray-200 px-3 py-1 rounded-md relative"
//           >
//             <Icon icon="mdi:file-pdf-box" className="text-2xl" />
//             <span className="text-sm ml-2">{pdf.name}</span>
//             <button
//               onClick={() =>
//                 setPdfs((prev) => prev.filter((_, i) => i !== idx))
//               }
//               className="absolute -top-2 -right-2 bg-red-500 p-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//             >
//               <Icon icon="gridicons:cross" width="24" height="24" />
//             </button>
//           </div>
//         ))}
//       </div>

//       <div
//         className={`${
//           pathName === "/inbox" ? "w-full" : "w-[80%] md:w-[70%] lg:w-[50%]"
//         } flex border-2 border-[#00793D] px-4 py-2 rounded-full mt-4 shadow-sm`}
//       >
//         <form
//           onSubmit={handleSendMessage}
//           className="flex justify-between items-center w-full gap-4"
//         >
//           <div className="relative">
//             <Icon
//               onClick={() => setShowFileOption(!showFileOption)}
//               icon="si:attachment-duotone"
//               className="text-[#00793D] font-bold cursor-pointer"
//               width={24}
//               height={24}
//             />

//             {showFileOption && (
//               <div
//                 ref={clickRef}
//                 className={`bg-white shadow w-[180px] px-6 py-3 rounded-xl absolute bottom-10 transition-all duration-300 ${
//                   showFileOption ? "opacity-100 visible" : "opacity-0 invisible"
//                 }`}
//               >
//                 <label
//                   htmlFor="pdf"
//                   className="flex w-full items-center mb-6 gap-2 cursor-pointer"
//                 >
//                   <Icon
//                     icon="lsicon:file-pdf-filled"
//                     className="text-2xl text-red-600"
//                   />{" "}
//                   Upload PDF
//                 </label>
//                 <input
//                   onChange={handlePdfChange}
//                   accept=".pdf"
//                   type="file"
//                   name="pdf"
//                   id="pdf"
//                   multiple
//                   className="hidden"
//                 />

//                 <label
//                   htmlFor="image"
//                   className="flex w-full items-center gap-2 cursor-pointer"
//                 >
//                   <Icon
//                     icon="akar-icons:image"
//                     className="text-2xl text-blue-500"
//                   />{" "}
//                   Upload Images
//                 </label>
//                 <input
//                   onChange={handleImageChange}
//                   accept=".jpg, .png, .jpeg"
//                   name="image"
//                   type="file"
//                   id="image"
//                   multiple
//                   className="hidden"
//                 />
//               </div>
//             )}
//           </div>

//           <input
//             type="text"
//             placeholder={
//               isArabic
//                 ? "اسألني عن أي شيء يخص سيارتك…"
//                 : "Ask me Anything about you car..."
//             }
//             className="flex-1 focus:outline-none bg-transparent text-white placeholder:text-white"
//             name="message"
//           />

//           <button type="submit">
//             <Icon
//               icon="ri:send-plane-fill"
//               className={`text-[#00793D] font-bold`}
//               width={24}
//               height={24}
//             />
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }
