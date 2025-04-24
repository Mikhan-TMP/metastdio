'use client';
import { Inter, Dancing_Script } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from "next/navigation";

// Fonts
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [borderRadius, setBorderRadius] = useState('200px');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    // Refs for the sections
    const firstSectionRef = useRef<HTMLDivElement>(null);
    const secondSectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll();

    // Create transform values for localized scroll
    const imageX = useTransform(scrollYProgress, [0, 0.1, 0.2], [-200, -100, 0]);
    const textX = useTransform(scrollYProgress, [0, 0.1, 0.2], [200, 100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 0.5, 1]);

    const imageX2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [200, 100, 0]);
    const textX2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [-200, -100, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.4], [0, 0.5, 1]);

    const imageX3 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [-200, -100, 0]);
    const textX3 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [200, 100, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 0.5, 1]);

    const imageX4 = useTransform(scrollYProgress, [0.6, 0.7, 0.8], [200, 100, 0]);
    const textX4 = useTransform(scrollYProgress, [0.6, 0.7, 0.8], [-200, -100, 0]);
    const opacity4 = useTransform(scrollYProgress, [0.6, 0.7, 0.8], [0, 0.5, 1]);

    useEffect(() => {
        setIsClient(true);

        const handleScroll = () => {
            const firstSectionHeight = firstSectionRef.current?.getBoundingClientRect().height || 0;
            const secondSectionHeight = secondSectionRef.current?.getBoundingClientRect().height || 0;
            const totalHeight = firstSectionHeight + secondSectionHeight;

            const newScrollY = window.scrollY;

            // Calculate scroll progress between the first and second section
            const progress = Math.min(1, Math.max(0, (newScrollY - firstSectionHeight) / secondSectionHeight));

            setScrollProgress(progress);

            const maxScroll = window.innerHeight;
            const scrollProgressValue = Math.min(1, newScrollY / maxScroll);
            const radius = 200 * (1 - scrollProgressValue);
            setBorderRadius(`${radius}px`);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);



    return (
        <div className="relative ">
                <nav className="sticky top-0 z-99 w-full bg-white/10 backdrop-blur-sm shadow-lg">
                    <div className="max-w-[] mx-auto px-6 py-4 flex justify-between items-center">
                        <img src="http://www.meta-town.io/Metacity/assets/Flexor/assets/img/metatown.png" className="h-8 w-auto pe-10" />
                        <div className="flex gap-6 items-center">
                            <a href="#" className="text-[#444444] hover:text-[#FEFEFEFF] transition">Home</a>
                            <a href="#" className="text-[#444444] hover:text-[#FEFEFEFF] transition">Features</a>
                            <a href="#" className="text-[#444444] hover:text-[#FEFEFEFF] transition">How it Works</a>
                            <a href="#" className="text-[#444444] hover:text-[#FEFEFEFF] transition">About</a>
                            {typeof window !== 'undefined' && localStorage.getItem('userName') && localStorage.getItem('token') ? (
                                <button className="cursor-pointer px-4 py-2 rounded-md bg-[#9B25A7] text-white" onClick={() => router.push('/Dashboard')}>
                                    {localStorage.getItem('userName')}
                                </button>
                            ) : (
                                <>
                                    <button className="px-4 py-2 rounded-md border border-[#9B25A7] text-black hover:bg-[#9B25A7] hover:text-white" onClick={() => router.push('/Auth')}>
                                        Login
                                    </button>
                                    <button className="px-4 py-2 rounded-md bg-[#9B25A7] text-white hover:bg-[#7A1C86]" onClick={() => router.push('/Auth')}>
                                        Signup
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            {/* FIRST SECTION */}
            <div ref={firstSectionRef} className={`relative top-0 h-screen w-full bg-gradient-to-br from-[#5DD6EC] via-[#A29BED] via-[#B491EC] via-[#C585EE] to-[#DF5DEC]  ${inter.className}`}>
                <img src="/landingpage/landingpage_bg.svg" className="absolute top-0 left-0 w-full h-full object-cover z-0 animate-float" />
                <div className="relative z-20 flex flex-col items-center justify-center h-full text-white  overflow-hidden ">
                    <h1 className="text-5xl font-semibold mb-4 text-[#444444] w-[625px]">
                        Your AI-Powered
                        <div className="dropping-texts mt-[.5rem] mb-[.2rem] text-[#9B25A7] font-bold ml-2 pointer-events-none select-none shadow-text">
                            <div>Avatar Design</div>
                            <div>Voice Creation</div>
                            <div>Story Building</div>
                            <div>Video Editing</div>
                        </div>
                        <br />Studio Starts <span className={`${dancingScript.className} text-white text-7xl`}>here.</span>
                    </h1>
                    <p className="text-lg mb-2 w-[625px] text-[#FFFFFFFF] shadow-text text-justify">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus explicabo eligendi ut rem itaque debitis dolorem adipisci repudiandae eveniet in excepturi amet doloremque facere natus, ex ipsa odit ipsam cumque?
                    </p>
                    <div className="w-[625px]">
                        <a href="/login" className="bg-[#BB30C9] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#802688FF] transition w-[200px] flex items-center justify-between">
                            Get Started <span className="ml-2">&#8594;</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* SECOND SECTION */}
            <div
                ref={secondSectionRef}
                className="relative w-full bg-white min-h-screen shadow-lg z-10 mt-[-140px] overflow-hidden"
                style={{
                    transition: 'transform 0.1s ease-out, border-radius 0.1s ease-out',
                    borderTopLeftRadius: isClient ? borderRadius : '200px',
                    borderTopRightRadius: isClient ? borderRadius : '200px'
                }}
            >
                <div className="pt-20 px-40 flex flex-col items-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl mb-4">
                        <span className={`${dancingScript.className} text-[#9B25A7] text-7xl`}>F</span>eatures
                    </motion.h1>

                    {/* Features with animated scroll */}
                    {[{
                        imageX, textX, opacity,
                        title: "Generate AI Avatars",
                        image: "/landingpage/male1.svg",
                        text: "  Create personalized AI-generated avatars in seconds using cutting-edge generative technology. Whether you’re building a digital identity, designing game characters, or enhancing your virtual presence, our platform lets you craft unique, high-quality avatars tailored to your style and needs. Customize facial features, hairstyles, outfits, and expressions with ease — no design skills required."
                    }, {
                        imageX: imageX2, textX: textX2, opacity: opacity2,
                        title: "Generate AI Voice",
                        image: "/landingpage/female1.svg",
                        text: "Bring your characters and content to life with realistic AI-generated voiceovers. Our advanced voice synthesis technology lets you create natural, expressive speech in multiple languages and tones. Perfect for animations, games, presentations, and more — choose from a range of voices or clone your own for a personalized touch. No recording equipment or voice talent needed"

                    }, {
                        imageX: imageX3, textX: textX3, opacity: opacity3,
                        title: "Generate AI Studio",
                        image: "/landingpage/male2.svg",
                        text: "Build your own fully interactive AI-powered virtual studio in moments. Whether you're creating content, hosting digital events, or collaborating in a virtual space, our platform gives you the tools to design and control immersive environments. Easily customize scenes, lighting, backgrounds, and camera angles — no technical expertise needed. Bring your ideas to life with studio-grade precision"

                    }, {
                        imageX: imageX4, textX: textX4, opacity: opacity4,
                        title: "Video Editor",
                        image: "/landingpage/video.svg",
                        text: " Edit videos effortlessly using the power of AI. Our intuitive video editor lets you cut, trim, add effects, and generate content automatically with smart scene detection and voice-to-subtitle capabilities. Ideal for creators, educators, and marketers, the platform offers seamless integration of avatars, voiceovers, and assets — all without needing professional editing skills."

                    }].map(({ imageX, textX, opacity, title, image, text }, i) => (
                        <div key={i} className="w-full min-h-[500px] flex items-end relative my-10">
                            <motion.img style={{ x: imageX, opacity }} src={image} className={`absolute ${i % 2 === 0 ? '' : 'right-0'}`} />
                            <motion.div style={{ x: textX, opacity }} className={`desc-holder flex items-${i % 2 === 0 ? 'end' : 'start'} flex-col w-full -z-1`}>
                                <h2 className="text-right text-4xl font-semibold mb-4">{title}</h2>
                                <div className="description1 bg-[#A9DFFF] rounded-xl shadow-lg p-10 w-[75%] h-[300px] flex items-center justify-center">
                                    <p className="text-xl text-[#444444] text-justify">{text}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            {/* THIRD SECTION */}
            <div className="h-screen">

            </div>
        </div>
    );
};

export default LandingPage;
