import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { 
  Lock, GlassWater, Sparkles, Volume2, VolumeX, Menu, X, ArrowDown, ChevronDown, 
  Tv, Compass, HelpCircle, Layers, ShieldCheck, HeartPulse
} from 'lucide-react';

import InteractiveRecipes from './components/InteractiveRecipes';
import CollageCanvas from './components/CollageCanvas';
import FlavorGenerator from './components/FlavorGenerator';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [headerScrolled, setHeaderScrolled] = useState<boolean>(false);

  // Monitor master scroll metrics
  const { scrollY } = useScroll();

  // Scroll tracker specifically targetting Section 2 ("showcase")
  const { scrollYProgress } = useScroll({
    target: showcaseRef,
    offset: ["start end", "start start"]
  });

  // Smooth landing formulas for the strawberry cup
  const rawStrawberryOpacity = useTransform(scrollYProgress, [0.15, 0.8], [0, 1]);
  const rawStrawberryY = useTransform(scrollYProgress, [0, 1], [-350, 0]);
  const rawStrawberryScale = useTransform(scrollYProgress, [0, 1], [0.75, 1.12]);
  const rawStrawberryRotation = useTransform(scrollYProgress, [0, 1], [18, -6]);

  const strawberryOpacity = useSpring(rawStrawberryOpacity, { stiffness: 90, damping: 20 });
  const strawberryY = useSpring(rawStrawberryY, { stiffness: 60, damping: 18 });
  const strawberryScale = useSpring(rawStrawberryScale, { stiffness: 70, damping: 18 });
  const strawberryRotation = useSpring(rawStrawberryRotation, { stiffness: 70, damping: 18 });

  // Orange cup (Right) and Chocolate cup (Left) slide in from the sides in Section 2, driven by scroll progress with smooth springs
  const rawLeftCupX = useTransform(scrollYProgress, [0.1, 0.95], [-120, 0]);
  const rawLeftCupOpacity = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);
  const rawLeftCupScale = useTransform(scrollYProgress, [0.1, 0.95], [0.85, 1.05]);
  
  const leftCupX = useSpring(rawLeftCupX, { stiffness: 60, damping: 18 });
  const leftCupOpacity = useSpring(rawLeftCupOpacity, { stiffness: 90, damping: 20 });
  const leftCupScale = useSpring(rawLeftCupScale, { stiffness: 70, damping: 18 });

  const rawRightCupX = useTransform(scrollYProgress, [0.1, 0.95], [120, 0]);
  const rawRightCupOpacity = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);
  const rawRightCupScale = useTransform(scrollYProgress, [0.1, 0.95], [0.85, 1.05]);

  const rightCupX = useSpring(rawRightCupX, { stiffness: 60, damping: 18 });
  const rightCupOpacity = useSpring(rawRightCupOpacity, { stiffness: 90, damping: 20 });
  const rightCupScale = useSpring(rawRightCupScale, { stiffness: 70, damping: 18 });

  // General opacity fade-out for hero title layers as we scroll down
  const heroTextOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 300], [0, -40]);

  // Trigger blurred header background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    setMuted(!muted);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-luxury-black text-white selection:bg-gold-500 selection:text-luxury-black">
      
      {/* Premium Ambient Floating Navbar */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 py-5 ${
        headerScrolled ? 'bg-luxury-black/95 border-b border-gold-800/15 backdrop-blur-md shadow-lg shadow-black/80' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Brand heading */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full border border-gold-400 flex items-center justify-center bg-gold-950/20 shadow-md shadow-gold-400/10 group-hover:scale-105 transition-transform">
              <span className="font-display font-black text-xs text-gold-300">W</span>
            </div>
            <span className="font-display font-black tracking-[0.2em] text-lg text-white group-hover:text-gold-300 transition-colors uppercase">
              wealth <span className="text-gold-400 font-serif italic font-normal lowercase">Cock</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8 text-xs font-display tracking-widest uppercase text-zinc-300">
            <a href="#showcase" className="hover:text-gold-200 transition-colors">Showcase</a>
            <a href="#recipes" className="hover:text-gold-200 transition-colors">Recipes</a>
            <a href="#studio" className="hover:text-gold-200 transition-colors">Collage Studio</a>
            <a href="#profile" className="hover:text-gold-200 transition-colors">Tasting Profile</a>
          </div>

          {/* Utilities (Sound controller + virtual CTA) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleSound}
              className="w-10 h-10 rounded-full border border-zinc-700/60 bg-zinc-950/30 text-gold-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Toggle Audio Feedback"
            >
              {muted ? <VolumeX className="w-4" /> : <Volume2 className="w-4" />}
            </button>
            <a
              href="#studio"
              className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-650 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-display font-medium text-[10px] tracking-widest uppercase rounded-full shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3" /> Draft Canvas
            </a>
          </div>

          {/* Mobile menu and sound button togglers */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleSound}
              className="w-8 h-8 rounded-full border border-zinc-750 text-gold-400 flex items-center justify-center bg-zinc-950/20"
            >
              {muted ? <VolumeX className="w-3.5" /> : <Volume2 className="w-3.5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-white hover:text-gold-400 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6" /> : <Menu className="w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-45 bg-[#0e0e0d] border-b border-gold-800/20 p-6 md:hidden flex flex-col gap-6 font-display tracking-widest uppercase text-center"
          >
            <a 
              href="#showcase" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-gold-400 text-sm py-2"
            >
              Showcase
            </a>
            <a 
              href="#recipes" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-gold-400 text-sm py-2"
            >
              Recipes
            </a>
            <a 
              href="#studio" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-gold-400 text-sm py-2"
            >
              Collage Studio
            </a>
            <a 
              href="#profile" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-200 hover:text-gold-400 text-sm py-2"
            >
              Tasting Profile
            </a>
            <a
              href="#studio"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-gradient-to-r from-gold-500 to-gold-600 text-luxury-black font-display font-bold py-3 text-xs tracking-wider rounded-xl uppercase flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4" /> COMPOSITION STUDIO
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Beautiful Animated video */}
      <header className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden">
        
        {/* Background video loop */}
        <div className="absolute inset-0 z-0 bg-black">
          <video
            autoPlay
            loop
            muted={muted}
            playsInline
            src="https://www.image2url.com/r2/default/videos/1780039434112-c3fc575b-42f5-433f-a667-20c19088afd2.mp4"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/40 via-luxury-black/60 to-luxury-black pointer-events-none" />
        </div>

        {/* Hero Copy (Stretched/Spacious layout) */}
        <motion.div 
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8 mt-12"
        >
          <span className="text-gold-400 font-display text-[10px] tracking-[0.3em] uppercase block font-medium">A GENTLEMAN & LADY'S LIQUID GASTRONOMY</span>

          <h1 className="text-5xl md:text-8xl font-display font-black uppercase text-white tracking-[0.2em] leading-none">
            wealth <br />
            <span className="gold-gradient-text font-serif italic tracking-[0.1em] lowercase py-2 block">Cock</span>
          </h1>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto" />

          <p className="text-zinc-300 text-sm md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            Welcome to a world of liquid luxury. Indulge in our trilogy of signature flavors, blend your custom recipe canvas, and discover your personal sensory state.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a
              href="#showcase"
              className="px-8 py-4 bg-transparent border-2 border-gold-400 text-gold-300 hover:text-white hover:border-white rounded-xl text-xs md:text-sm font-display tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              Meet the Show <ArrowDown className="w-4 animate-bounce" />
            </a>
            <a
              href="#profile"
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-650 text-luxury-black font-display font-medium rounded-xl text-xs md:text-sm tracking-widest uppercase transition-transform hover:scale-102 cursor-pointer shadow-lg shadow-gold-500/10 flex items-center gap-1.5"
            >
              Find Your Flavor <Sparkles className="w-4" />
            </a>
          </div>
        </motion.div>

        {/* Ambient indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[10px] text-zinc-500 tracking-[0.2em] uppercase">
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-pulse text-gold-400" />
        </div>
      </header>

      {/* Section 2: Immersive Parallax Cup Showcase */}
      {/* Here we have Orange Cup on the Right, Chocolate Cup on the Left, and Strawberry Cup smoothly landing into Center */}
      <section ref={showcaseRef} className="relative min-h-[100vh] py-32 bg-[#050505] overflow-visible flex flex-col justify-center border-t border-white/5" id="showcase">
        
        {/* Ambient backlighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gold-950/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
          
          <div className="text-center mb-24">
            <span className="text-gold-300 font-display text-sm tracking-[0.25em] block mb-3 uppercase">Crafted Alchemy</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white">
              The Signature <span className="gold-gradient-text font-serif italic">Trilogy</span>
            </h2>
            <p className="text-zinc-400 font-light max-w-xl mx-auto text-sm md:text-base mt-2">
              Our master trilogy of premium blends. Squeeze, blend, and tune the elements to your signature state of mind.
            </p>
          </div>

          {/* Three Cup showcase layout */}
          {/* Note: The Strawberry Cup resides physically inside the middle column, but transitions on scroll! */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pb-12 relative overflow-visible">
            
            {/* Left Column: CHOCOLATE (Sliding in from Left) */}
            <motion.div 
              style={{ x: leftCupX, opacity: leftCupOpacity, scale: leftCupScale }}
              className="bg-[#120e0a] border border-stone-800/40 rounded-3xl p-8 flex flex-col items-center justify-between text-center select-none shadow-2xl relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-500 bento-glow min-h-[500px]"
            >
              <div className="w-full relative flex items-center justify-center h-64 select-none">
                <div className="absolute inset-0 bg-radial-[circle] from-yellow-800/5 to-transparent blur-xl group-hover:from-yellow-700/10 transition-colors pointer-events-none" />
                <img
                  src="https://www.image2url.com/r2/default/images/1780037152057-c2077f10-55ce-4411-bc9d-d3dc93e68dab.png"
                  alt="Seductive Cocoa Mint Cup"
                  className="max-h-56 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter brightness-105 group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3 max-w-xs mt-auto">
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">01 / BARREL EXTRA</span>
                <h3 className="text-lg md:text-xl font-display text-white tracking-wide">Cocoa Seduction</h3>
                <p className="text-zinc-400 text-xs font-light px-2.5 leading-relaxed">
                  Hand-roasted Venezuelan cocoa shell extracts washed in oak cognac and fresh icy mint.
                </p>
                <div className="inline-block mt-2">
                  <span className="text-[10px] bg-amber-950/45 text-amber-200 font-mono border border-amber-600/20 px-2.5 py-1 rounded-full uppercase">
                    Rich Decadence
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Middle Column: STRAWBERRY / Smoothly landing here on scroll */}
            <div className="bg-[#1a0a0c]/60 border border-rose-950/40 rounded-3xl p-8 flex flex-col items-center justify-between text-center select-none relative bento-glow min-h-[500px] overflow-visible">
              
              <div className="w-full relative flex items-center justify-center h-64 select-none overflow-visible">
                <div className="absolute inset-0 bg-radial-[circle] from-rose-900/5 to-transparent blur-xl pointer-events-none" />
                <motion.img
                  style={{ y: strawberryY, opacity: strawberryOpacity, scale: strawberryScale, rotate: strawberryRotation }}
                  src="https://www.image2url.com/r2/default/images/1780037248537-196d07e7-7b48-4cbd-b950-7d012976b445.png"
                  alt="Wealth Velvet Berry Core Cup"
                  className="max-h-56 object-contain drop-shadow-[0_20px_40px_rgba(244,63,94,0.18)] z-10 select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3 max-w-xs mt-auto">
                <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block">02 / ROYAL SPARK</span>
                <h3 className="text-lg md:text-xl font-display text-white tracking-wide">Velvet Crimson Royale</h3>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  Prismatic forest strawberries clarified and topped with a high-attitude crisp Brut Champagne.
                </p>
                <div className="inline-block mt-2">
                  <span className="text-[10px] bg-rose-950/45 text-rose-200 font-mono border border-rose-600/20 px-2.5 py-1 rounded-full uppercase">
                    Sweet Berry Sparkle
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: ORANGE (Sliding in from Right) */}
            <motion.div 
              style={{ x: rightCupX, opacity: rightCupOpacity, scale: rightCupScale }}
              className="bg-[#1c120a] border border-orange-950/40 rounded-3xl p-8 flex flex-col items-center justify-between text-center select-none shadow-2xl relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-500 bento-glow min-h-[500px]"
            >
              <div className="w-full relative flex items-center justify-center h-64 select-none">
                <div className="absolute inset-0 bg-radial-[circle] from-orange-400/5 to-transparent blur-xl group-hover:from-orange-400/10 transition-colors pointer-events-none" />
                <img
                  src="https://www.image2url.com/r2/default/images/1780037140284-15cae61c-3317-4482-9c00-8f7965105e84.png"
                  alt="Amber Orange Sovereign Cup"
                  className="max-h-56 object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter brightness-105 group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3 max-w-xs mt-auto">
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">03 / LIQUID GOLD</span>
                <h3 className="text-lg md:text-xl font-display text-white tracking-wide">Amber Sovereign</h3>
                <p className="text-zinc-400 text-xs font-light px-2.5 leading-relaxed">
                  Smoked tangerine skins and orange bitters layered with high-clist gold flakes and rum.
                </p>
                <div className="inline-block mt-2">
                  <span className="text-[10px] bg-orange-950/45 text-orange-200 font-mono border border-orange-600/20 px-2.5 py-1 rounded-full uppercase">
                    Zesty Citrus Core
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Dynamic Recipes Component */}
      <InteractiveRecipes />

      {/* Immersive Drag & Drop Collage Creator Canvas */}
      <CollageCanvas />

      {/* Dynamic Tasting Deck Profile Generator */}
      <FlavorGenerator />

      {/* Premium Luxury Footer */}
      <footer className="bg-luxury-black text-zinc-500 py-16 px-6 md:px-12 border-t border-gold-800/15 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="space-y-3">
            <h4 className="font-display font-medium text-white tracking-[0.25em] text-sm uppercase">wealth <span className="text-gold-400 font-serif italic lowercase">Cock</span></h4>
            <div className="text-xs space-y-1">
              <p>© {new Date().getFullYear()} Wealth Cocktails Inc. Reserved for absolute luxury.</p>
              <p className="font-mono text-[10px] text-zinc-650">Coordinates: PARIS • TOKYO • NEW YORK • MILAN</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 max-w-xs">
            <div className="flex items-center gap-1.5 text-xs text-gold-300">
              <ShieldCheck className="w-4" /> Quality Guarantee & Responsibility
            </div>
            <p className="text-[10px] text-zinc-650 leading-relaxed text-center md:text-right italic">
              Please savor Wealth Cocktails with careful appreciation. Our formulations feature carefully selected natural botanicals. Images are pure premium compositions crafted lovingly for inspiration.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
