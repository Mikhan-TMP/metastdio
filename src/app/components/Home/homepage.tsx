'use client';

import { motion } from 'framer-motion';
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
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 to-purple-600 p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center text-white max-w-3xl w-full"
            >
                <h1 className="text-6xl mb-4 font-bold md:text-5xl">Coming Soon</h1>
                <p className="text-2xl mb-12 opacity-90">Something awesome is in the works!</p>
                
                <div className="flex justify-center gap-8 mb-12 flex-wrap">
                    <div className="bg-white/10 p-6 rounded-lg min-w-[100px] md:min-w-[80px]">
                        <span className="text-4xl font-bold">{countdown.days}</span>
                        <p className="mt-2 opacity-80">Days</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg min-w-[100px] md:min-w-[80px]">
                        <span className="text-4xl font-bold">{countdown.hours}</span>
                        <p className="mt-2 opacity-80">Hours</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg min-w-[100px] md:min-w-[80px]">
                        <span className="text-4xl font-bold">{countdown.minutes}</span>
                        <p className="mt-2 opacity-80">Minutes</p>
                    </div>
                    <div className="bg-white/10 p-6 rounded-lg min-w-[100px] md:min-w-[80px]">
                        <span className="text-4xl font-bold">{countdown.seconds}</span>
                        <p className="mt-2 opacity-80">Seconds</p>
                    </div>
                </div>

                <div className="mt-8">
                </div>
            </motion.div>
        </div>
    );
};

export default HomePage;