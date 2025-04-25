'use client';
import { Inter, Dancing_Script } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from "next/navigation";
import { Plus, ArrowUp } from 'lucide-react';

// Fonts
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [borderRadius, setBorderRadius] = useState('200px');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isContentVisible2, setIsContentVisible2] = useState(false);
    const [isContentVisible3, setIsContentVisible3] = useState(false);
    const [isContentVisible4, setIsContentVisible4] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
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

        const handleScrollVisibility = () => {
            if (window.pageYOffset > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScrollVisibility);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScrollVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="relative scroll-smooth">
            <nav className="sticky top-0 z-99 w-full bg-white shadow-lg">
                <div className="max-w-[] mx-auto px-6 py-4 flex justify-between items-center">
                    <img src="http://www.meta-town.io/Metacity/assets/Flexor/assets/img/metatown.png" className="h-8 w-auto pe-10" />
                    <div className="flex gap-6 items-center">
                        <a href="#home" className=" bg-white hover:bg-[#9B25A7] hover:text-white transition duration-300 rounded-md px-4 py-2">
                            Home
                        </a>
                        <a href="#features" className="bg-white hover:bg-[#9B25A7] hover:text-white transition duration-300 rounded-md px-4 py-2">
                            Features
                        </a>
                        <a href="#how-it-works" className="bg-white hover:bg-[#9B25A7] hover:text-white transition duration-300 rounded-md px-4 py-2">
                            How it Works
                        </a>
                        <a href="#about" className="bg-white hover:bg-[#9B25A7] hover:text-white transition duration-300 rounded-md px-4 py-2">
                            About
                        </a>
                        {typeof window !== 'undefined' && localStorage.getItem('userName') && localStorage.getItem('token') ? (
                            <button className="cursor-pointer px-4 py-2 rounded-md bg-[#9B25A7] text-white" onClick={() => router.push('/Dashboard')}>
                                {localStorage.getItem('userName')}
                            </button>
                        ) : (
                            <>
                                <button className="px-4 py-2 rounded-md border border-[#9B25A7] text-black hover:bg-[#9B25A7] hover:text-white cursor-pointer" onClick={() => router.push('/Auth')}>
                                    Login
                                </button>
                                <button className="px-4 py-2 rounded-md bg-[#9B25A7] text-white hover:bg-[#7A1C86] cursor-pointer" onClick={() => router.push('/Auth')}>
                                    Signup
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            {/* FIRST SECTION */}
            <div id="home" ref={firstSectionRef} className={`relative top-0 h-screen w-full bg-gradient-to-br from-[#5DD6EC] via-[#A29BED] via-[#B491EC] via-[#C585EE] to-[#DF5DEC]  ${inter.className}`}>
                <img src="/landingpage/landingpage_bg.svg" className="absolute top-0 left-0 w-full h-full object-cover z-0 animate-float" />
                <div className="relative z-20 flex flex-col items-center justify-center h-full text-white  overflow-hidden ">
                    <h1 className="text-5xl font-semibold mb-4 text-[#444444] w-[625px] select-none">
                        Your AI-Powered
                        <div className="dropping-texts mt-[.5rem] mb-[.2rem] text-[#9B25A7] font-bold ml-2 pointer-events-none select-none shadow-text">
                            <div>Avatar Design</div>
                            <div>Voice Creation</div>
                            <div>Story Building</div>
                            <div>Video Editing</div>
                        </div>
                        <br />Studio Starts <span className={`${dancingScript.className} text-white text-7xl`}>here.</span>
                    </h1>
                    <p className="text-lg mb-2 w-[625px] text-[#FFFFFFFF] shadow-text text-justify select-none ">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus explicabo eligendi ut rem itaque debitis dolorem adipisci repudiandae eveniet in excepturi amet doloremque facere natus, ex ipsa odit ipsam cumque?
                    </p>
                    <div className="w-[625px]">
                        <a href="/login" className="bg-[#BB30C9] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#802688FF] transition w-[200px] flex items-center justify-between select-none">
                            Get Started <span className="ml-2">&#8594;</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* SECOND SECTION */}
            <div
                id='features'
                ref={secondSectionRef}
                className="relative w-full bg-white min-h-screen  z-10 mt-[-140px] overflow-hidden"
                style={{
                    transition: 'transform 0.1s ease-out, border-radius 0.1s ease-out',
                    borderTopLeftRadius: isClient ? borderRadius : '200px',
                    borderTopRightRadius: isClient ? borderRadius : '200px'
                }}
            >
                <div className="pt-20 px-40 flex flex-col items-center">
                    <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-6xl">
                        <span className={`${dancingScript.className} text-[#9B25A7] text-8xl`}>f</span>eatures
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
                            <motion.div
                                style={{ x: textX, opacity }}
                                className={`desc-holder flex items-${i % 2 === 0 ? 'end' : 'start'} flex-col w-full -z-1 ${i % 2 === 0 ? 'pl-[100px]' : 'pr-[100px]'
                                    }`}
                            >
                                <h2 className="text-right text-4xl font-semibold mb-4">{title}</h2>
                                <div className={`description1 ${i % 2 === 0 ? 'bg-[#A9DFFF]' : 'bg-[#9B25A7]'
                                    } rounded-xl shadow-lg p-10 w-[75%] h-[300px] flex items-center justify-center`}>
                                    <p className={`text-xl ${i % 2 === 0 ? 'text-[#444444] pl-[100px]' : 'text-[#FFFFFFFF] pr-[100px]'
                                        } text-justify`}>{text || ''}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            {/* THIRD SECTION */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-auto bottom-[60px] relative z-21"
                id='how-it-works'
            >
                <div className="w-full flex flex-col items-end">
                    {/* Gradient triangle with same background as the box */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex pr-[100px]"
                    >
                        <div
                            className="w-[100px] h-[86.6px]"
                            style={{
                                backgroundImage: `linear-gradient(to bottom right, 
                                #DF5DEC 0%, 
                                #C585EE 25%, 
                                #B491EC 50%, 
                                #A29BED 74%, 
                                #5DD6EC 100%)`,
                                clipPath: 'polygon(50% 0%, 0% 108%, 100% 108%)'
                            }}
                        ></div>
                    </motion.div>

                    {/* Gradient box with matching background */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="triangle-box w-full min-h-screen pb-20 rounded-[50px] flex flex-col gap-5"
                        style={{
                            backgroundImage: `linear-gradient(to bottom right, 
                                #DF5DEC 0%, 
                                #C585EE 25%, 
                                #B491EC 50%, 
                                #A29BED 74%, 
                                #5DD6EC 100%)`
                        }}
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="text-[#444444] text-6xl font-bold text-center mt-[150px] mb-[50px] "
                        >
                            How it <span className={`${dancingScript.className} text-[#FFFFFF] text-8xl`}>works</span>
                        </motion.h1>
                        <div className="contents text-white flex justify-between px-15 items-center">
                            <p className="text-6xl">01 <span>Create Avatars</span></p>
                            <div
                                className="rounded-full bg-transparent border-[3px] border-white p-2 flex items-center justify-center cursor-pointer transition-transform duration-300"
                                onClick={() => setIsContentVisible(!isContentVisible)}
                                style={{ transform: isContentVisible ? 'rotate(45deg)' : 'rotate(0deg)' }}
                            >
                                <Plus className="text-6xl text-white" />
                            </div>
                        </div>

                        <motion.div
                            initial={false}
                            animate={{
                                height: isContentVisible ? "auto" : 0,
                                opacity: isContentVisible ? 1 : 0
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            className="overflow-hidden"
                        >
                            <div className="more-content flex justify-between items-center px-15 mt-3">
                                <img src="/landingpage/emotions2.svg" className='pl-10' alt="Create Avatars" />
                                <p className="text-2xl text-[#444444] text-center mt-3 text-justify w-[70%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt interdum dolor, sed tempor tortor consectetur ac. Phasellus quam urna, pharetra id imperdiet quis, lobortis quis est. Maecenas et molestie.</p>
                            </div>
                        </motion.div>
                        <div className="divider px-15 mt-3">
                            <hr className='w-full border-white border-[1.5px]' />
                        </div>

                        {/* 02 Generate voiceovers */}
                        <div className="contents text-white flex justify-between px-15 items-center mt-8">
                            <p className="text-6xl">02 <span>Generate voiceovers</span></p>
                            <div
                                className="rounded-full bg-transparent border-[3px] border-white p-2 flex items-center justify-center cursor-pointer transition-transform duration-300"
                                onClick={() => setIsContentVisible2(!isContentVisible2)}
                                style={{ transform: isContentVisible2 ? 'rotate(45deg)' : 'rotate(0deg)' }}
                            >
                                <Plus className="text-6xl text-white" />
                            </div>
                        </div>

                        <motion.div
                            initial={false}
                            animate={{
                                height: isContentVisible2 ? "auto" : 0,
                                opacity: isContentVisible2 ? 1 : 0
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            className="overflow-hidden"
                        >
                            <div className="more-content flex justify-between items-center px-15 mt-3">
                                <img src="/landingpage/voice.svg" className='pl-10' alt="Generate voiceovers" />
                                <p className="text-2xl text-[#444444] text-center mt-3 text-justify w-[70%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt interdum dolor, sed tempor tortor consectetur ac. Phasellus quam urna, pharetra id imperdiet quis, lobortis quis est.</p>
                            </div>
                        </motion.div>
                        <div className="divider px-15 mt-3">
                            <hr className='w-full border-white border-[1.5px]' />
                        </div>

                        {/* 03 Choose Background */}
                        <div className="contents text-white flex justify-between px-15 items-center mt-8">
                            <p className="text-6xl">03 <span>Choose Background</span></p>
                            <div
                                className="rounded-full bg-transparent border-[3px] border-white p-2 flex items-center justify-center cursor-pointer transition-transform duration-300"
                                onClick={() => setIsContentVisible3(!isContentVisible3)}
                                style={{ transform: isContentVisible3 ? 'rotate(45deg)' : 'rotate(0deg)' }}
                            >
                                <Plus className="text-6xl text-white" />
                            </div>
                        </div>

                        <motion.div
                            initial={false}
                            animate={{
                                height: isContentVisible3 ? "auto" : 0,
                                opacity: isContentVisible3 ? 1 : 0
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            className="overflow-hidden"
                        >
                            <div className="more-content flex justify-between items-center px-15 mt-3">
                                <img src="/landingpage/background.svg" className='pl-10' alt="Choose Background" />
                                <p className="text-2xl text-[#444444] text-center mt-3 text-justify w-[70%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt interdum dolor, sed tempor tortor consectetur ac. Phasellus quam urna, pharetra id imperdiet quis, lobortis quis est.</p>
                            </div>
                        </motion.div>
                        <div className="divider px-15 mt-3">
                            <hr className='w-full border-white border-[1.5px]' />
                        </div>

                        {/* 04 Edit Your Video */}
                        <div className="contents text-white flex justify-between px-15 items-center mt-8">
                            <p className="text-6xl">04 <span>Edit Your Video</span></p>
                            <div
                                className="rounded-full bg-transparent border-[3px] border-white p-2 flex items-center justify-center cursor-pointer transition-transform duration-300"
                                onClick={() => setIsContentVisible4(!isContentVisible4)}
                                style={{ transform: isContentVisible4 ? 'rotate(45deg)' : 'rotate(0deg)' }}
                            >
                                <Plus className="text-6xl text-white" />
                            </div>
                        </div>

                        <motion.div
                            initial={false}
                            animate={{
                                height: isContentVisible4 ? "auto" : 0,
                                opacity: isContentVisible4 ? 1 : 0
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                            className="overflow-hidden"
                        >
                            <div className="more-content flex justify-between items-center px-15 mt-3">
                                <img src="/landingpage/vid.svg" className='pl-10' alt="Edit Your Video" />
                                <p className="text-2xl text-[#444444] text-center mt-3 text-justify w-[70%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tincidunt interdum dolor, sed tempor tortor consectetur ac. Phasellus quam urna, pharetra id imperdiet quis, lobortis quis est.</p>
                            </div>
                        </motion.div>
                        <div className="divider px-15 mt-3">
                            <hr className='w-full border-white border-[1.5px]' />
                        </div>
                    </motion.div>
                </div>

            </motion.div>
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-3 rounded-full bg-[#9B25A7] text-white shadow-lg hover:bg-[#7A1C86] transition-all duration-300 z-50 ease-in-out hover:scale-110 cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={24} />
                </motion.button>
            )}
        </div>
    );
};

export default LandingPage;
