import { Inter, Dancing_Script } from 'next/font/google';
import { useEffect, useState } from 'react';

// Initialize fonts
const dancingScript = Dancing_Script({
    subsets: ['latin'],
    weight: '400',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '700'],
});

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [borderRadius, setBorderRadius] = useState('200px');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Marks that we're on the client now

        const handleScroll = () => {
            const newScrollY = window.scrollY;
            setScrollY(newScrollY);

            const maxScroll = window.innerHeight;
            const scrollProgress = Math.min(1, newScrollY / maxScroll);
            const radius = 200 * (1 - scrollProgress);
            setBorderRadius(`${radius}px`);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Set initial border radius

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative">
            {/* FIRST SECTION */}
            <div className={`sticky top-0 h-screen w-full bg-gradient-to-br from-[#5DD6EC] via-[#A29BED] via-[#B491EC] via-[#C585EE] to-[#DF5DEC] overflow-hidden ${inter.className}`}>
                {/* Background SVG Image */}
                <img 
                    src="/landingpage/landingpage_bg.svg" 
                    alt="Decorative background" 
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 animate-float" 
                />

                {/* Sticky Navigation */}
                <nav className="sticky top-0 z-20 w-full bg-white/10 backdrop-blur-sm shadow-lg">
                    <div className="max-w-[] mx-auto px-6 py-4 flex justify-between items-center">
                        <img src="http://www.meta-town.io/Metacity/assets/Flexor/assets/img/metatown.png" alt="MetaTown Logo" className="h-8 w-auto pe-10"/>
                        <div className="flex gap-6 items-center">
                            <a href="#" className="text-[#444444] hover:text-[#FEFEFEFF] transition">Home</a>
                            <a href="#" className="text-[#444444] hover:text-[#FEFEFEFF] transition">Features</a>
                            <a href="#" className="text-[#444444] hover:text-[#FEFEFEFF]  transition">How it Works</a>
                            <a href="#" className="text-[#444444] hover:text-[#FEFEFEFF] transition">About</a>
                            <a href="#" className="px-4 py-2 rounded-md bg-[#FEFEFEFF] hover:bg-[#9B25A7] hover:text-[#FEFEFEFF] text-black transition w-[100px] flex justify-center rounded-xl border border-[#9B25A7]">Login</a>
                            <a href="#" className="px-4 py-2 rounded-md bg-[#9B25A7] hover:bg-[#7A1C86]  text-white transition w-[100px] flex justify-center rounded-xl">Signup</a>
                        </div>
                    </div>
                </nav>

                {/* Content on top */}
                <div className="relative z-20 flex flex-col items-center justify-center h-full text-white">
                    <h1 className="text-5xl font-semibold mb-4 text-[#444444] w-[625px]">
                        Your AI-Powered 
                        <div className="dropping-texts mt-[.5rem] mb-[.2rem] text-[#9B25A7] font-bold ml-2 pointer-events-none select-none shadow-text">
                            <div>Avatar Design</div>
                            <div>Voice Creation</div>
                            <div>Story Building</div>
                            <div>Video Editing</div>
                        </div>

                        <br />Studio Starts 
                        <span className={`${dancingScript.className} text-white text-7xl font-italic`}> here.</span>
                    </h1>
                    <p className="text-lg mb-2 w-[625px] text-[#FFFFFFFF] shadow-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet ultricies libero eu eleifend. Quisque ultricies tortor sit amet quam accumsan gravida. Praesent tincidunt in tortor in iaculis. In tempus lorem at mi luctus rutrum.
                    </p>
                    <div className="w-[625px]">
                        <a href="/login" className="bg-[#BB30C9] text-white px-6 py-3 rounded-xl shadow-lg hover:bg-[#802688FF] transition duration-300 w-[200px] flex items-center justify-between" role="button">
                                Get Started
                            <span className="ml-2" aria-hidden="true">&#8594;</span>
                        </a>
                        

                    </div>
                </div>
            </div>

            {/* SECOND SECTION */}
            <div className="relative w-full bg-white h-screen shadow-lg z-10 mt-[-80px]" style={{ transition: 'transform 0.1s ease-out, border-radius 0.1s ease-out',borderTopLeftRadius: isClient ? borderRadius : '200px',borderTopRightRadius: isClient ? borderRadius : '200px'}}>
                <div className="pt-20 px-40 flex flex-col items-center h-full">
                    <h1 className="text-4xl mb-4"><span className={`${dancingScript.className} text-[#9B25A7] text-7xl font-italic`}>F</span>eatures</h1>
                    <div className="w-full h-[500px] flex items-end">
                        <img src="/landingpage/male1.svg" alt="Male waving" className="absolute" />
                        <div className="desc-holder flex  items-end flex-col w-full ">
                            <h2 className="text-right text-4xl font-semibold">Generate AI Avatars</h2>
                            <div className="description1 bg-[#A9DFFF] rounded-xl shadow-lg p-10 min-w-[80%] h-[300px]">
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
