'use client';

import { motion } from 'framer-motion';
import { Plus , Search, EllipsisVertical  } from 'lucide-react';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const targetDate = new Date('2025-12-31');

        const updateCountdown = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            setCountdown({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            });
        };

        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-screen flex w-full flex-col bg-gray-100 gap-5 pb-10">
            {/* FIRST SECTION */}
            <div className="flex justify-center flex-col w-full h-75 bg-gradient-to-r from-[#DF5DEC] rounded-4xl to-[#64C8DAFF]">
                <h1 className="font-bold text-5xl text-center text-white mt-20">
                    What would you like to start with? <br />
                </h1>
                <div className="icons flex flex-row gap-5 justify-center mt-10 mb-10">
                    <motion.div
                        className="icon cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <img src="/images/VideoButton.svg" alt="Video" className="w-20 h-20" />
                    </motion.div>
                    <motion.div
                        className="icon cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <img src="/images/AvatarButton.svg" alt="Avatar" className="w-20 h-20" />
                    </motion.div>
                    <motion.div
                        className="icon cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <img src="/images/AIVoice.svg" alt="AI Voice" className="w-20 h-20" />
                    </motion.div>

                    <motion.div
                        className="icon cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <img src="/images/AIStudioButton.svg" alt="AI Studio" className="w-20 h-20" />
                    </motion.div>

                    <motion.div
                        className="icon cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <img src="/images/AIScriptButton.svg" alt="AI Script" className="w-20 h-20" />
                    </motion.div>
                </div>
            </div>
            {/* SECOND SECTION */}
            <div className="flex flex-col w-full bg-white rounded-4xl bg-white h-screen px-10 pb-10 ">
                {/* HEADER */}
                <div className="top-cont flex w-full h-15 flex-row justify-between items-center pt-5">
                    <h1 className="font-bold text-3xl text-left text-[#9B25A7] mt-3">
                        Your Projects
                    </h1>
                    <div  className="flex flex-row gap-5 items-center">
                        <button className='flex w-40 items-center gap-2 justify-center h-10 p-3 bg-[#BB30C9] text-[#FFFFFF] rounded-xl cursor-pointer hover:bg-[#941C9FFF] ease transition-all'>
                            <Plus className="w-3 h-3 text-[#FFFFFF]" />
                            New Project
                        </button>
                        <div className="search flex">
                            <input
                                type="text"
                                placeholder="Search for projects..."
                                className="h-10 p-3 bg-[#F5F5F5] rounded-l-xl border border-[#9B25A7] focus:border-[#9B25A7] focus:outline-none"
                            />

                            <Search className="w-10 h-10 p-2 bg-[#9B25A7] text-white rounded-r-xl" />
                        </div>
                    </div>
                </div>
                {/* DIVIDER */}
                <div className="divider w-full h-0.5 bg-[#9B25A7] mt-5 mb-5"></div>
                {/* CARDS */}
                <div className="cards flex flex-row flex-wrap gap-10 justify-start h-full overflow-y-auto ">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="group border border-[#9B25A7] cursor-pointer w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-end gap-2 text-center rounded-2xl overflow-hidden shadow-lg"
                            >
                            {/* Top Half Background */}
                            <div
                                className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-center bg-no-repeat"
                                style={{
                                backgroundImage: `url('/bg.jpg')`,
                                }}
                            />

                            {/* Bottom Half Content */}
                            <div className="z-10 p-4">

                            </div>
                            <div 
                                className="bg-[#F7CFCFFF] w-28 h-28 mt-8 rounded-full border-4 border-slate-50 z-10 group-hover:scale-125 ease transition-all"
                                style={{ 
                                    backgroundImage: `url('/landingpage/female1.svg')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                            </div>
                            <div className="z-10  duration-500 bg-cover bg-cente text-left p-3 w-full flex flex-row justify-between">
                                <div className="left">
                                    <span className="text-xl font-semibold ">{`Video Title ${i+1}`}</span>
                                    <p className="text-sm">{new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())}</p>
                                </div>
                                <EllipsisVertical  className="w-6 h-6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default HomePage;