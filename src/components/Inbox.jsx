"use client"
import React, { useContext, useState } from 'react'
import InputField from './IputFiled';
import { AuthContext } from '@/provider/AuthProvider';
import { ReactTyped } from 'react-typed';

const Inbox = () => {
    const { messages } = useContext(AuthContext)
    return (
        <>
            <div className='pt-24 pb-10 w-[90%] lg:w-[70%] h-full flex flex-col justify-center items-center  mx-auto'>
                <div className="flex-1 w-full py-4 overflow-y-auto ">
                    
                    <div className='h-full flex flex-col '>
                        {/* Chat Area */}
                        <div className='w-full flex-1 overflow-y-scroll hide-scrollbar h-full'>
                            <div className='flex flex-col justify-between'>
                                {messages.map((msg, idx) =>

                                    <div key={idx} className={`flex flex-col py-0.5 ${msg.sender == true && 'items-start'} ${msg.sender == false && 'items-end'}`}>
                                        <div className=''>
                                            {
                                                msg.sender == true ?
                                                    <p className='text-lg  inline-flex px-3 py-2 relative bg-gray-50 text-black rounded-t-xl rounded-br-xl Sender mr-8 md:mr-24 lg:mr-32 text-justify'>
                                                        <ReactTyped
                                                            strings={[msg.message]}
                                                            typeSpeed={20}  
                                                            backSpeed={0}    
                                                            showCursor={ false}
                                                        />
                                                    </p>
                                                    :
                                                    <>
                                                    {
                                                        msg.message && <p className='text-lg  inline-flex px-3 py-2 relative bg-[#00793D] text-white rounded-t-xl rounded-bl-xl Reciver text-right'>{msg.message}</p>
                                                    }
                                                    </>
                                            }

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <InputField />
            </div>
        </>
    )
}

export default Inbox
