import { useEffect, useState, useRef } from "react";
const words = ["SHIVENDU"];
function BlurWord({ word, trigger }) {
  const letters = word.split("");
  const STAGGER = 45;
  const DURATION = 500;
  const GRADIENT_HOLD = STAGGER * letters.length + DURATION + 200;
  const [letterStates, setLetterStates] = useState(
    letters.map(() => ({ opacity: 0, blur: 20 }))
  );
  const [showGradient, setShowGradient] = useState(true);
  const framesRef = useRef([]);
  const timersRef = useRef([]);
  useEffect(() => {
    framesRef.current.forEach(cancelAnimationFrame);
    timersRef.current.forEach(clearTimeout);
    framesRef.current = [];
    timersRef.current = [];
    setLetterStates(letters.map(() => ({ opacity: 0, blur: 20 })));
    setShowGradient(true);
    letters.forEach((_, i) => {
      const t = setTimeout(() => {
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setLetterStates((prev) => {
            const next = [...prev];
            next[i] = { opacity: eased, blur: 20 * (1 - eased) };
            return next;
          });
          if (progress < 1) {
            const id2 = requestAnimationFrame(tick);
            framesRef.current.push(id2);
          }
        };
        const id = requestAnimationFrame(tick);
        framesRef.current.push(id);
      }, i * STAGGER);
      timersRef.current.push(t);
    });
    const gt = setTimeout(() => setShowGradient(false), GRADIENT_HOLD);
    timersRef.current.push(gt);
    return () => {
      framesRef.current.forEach(cancelAnimationFrame);
      timersRef.current.forEach(clearTimeout);
    };
  }, [trigger]);
  const gradientColors = ["#eca8d6", "#a78bfa", "#67e8f9", "#fbbf24", "#eca8d6"];
  return <>{letters.map((char, i) => {
    const colorIndex = i / Math.max(letters.length - 1, 1) * (gradientColors.length - 1);
    const lower = Math.floor(colorIndex);
    const upper = Math.min(lower + 1, gradientColors.length - 1);
    const t = colorIndex - lower;
    const hex2rgb = (hex) => {
      const r3 = parseInt(hex.slice(1, 3), 16);
      const g3 = parseInt(hex.slice(3, 5), 16);
      const b3 = parseInt(hex.slice(5, 7), 16);
      return [r3, g3, b3];
    };
    const [r1, g1, b1] = hex2rgb(gradientColors[lower]);
    const [r2, g2, b2] = hex2rgb(gradientColors[upper]);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return <span
      key={i}
      style={{
        display: "inline-block",
        opacity: letterStates[i]?.opacity ?? 0,
        filter: `blur(${letterStates[i]?.blur ?? 20}px)`,
        color: showGradient ? `rgb(${r},${g},${b})` : "white",
        transition: "color 0.4s ease"
      }}
    >{char}</span>;
  })}</>;
}
export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  useEffect(() => {
    // No cycling needed for a single name
  }, []);
  return <section className="relative min-h-screen flex flex-col justify-center items-start overflow-hidden bg-black">
    {
      /* Background video with pink tree and falling leaves */
    }
    <div className="absolute inset-0 z-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        className="w-full h-full object-cover object-center opacity-80"
      ><source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4" type="video/mp4" /></video>
      {
        /* Subtle overlay to ensure text readability on the left */
      }
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
    </div>
    {
      /* Subtle grid lines */
    }
    <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none opacity-20">
      {[...Array(8)].map((_, i) => <div
        key={`h-${i}`}
        className="absolute h-px bg-white/10"
        style={{
          top: `${12.5 * (i + 1)}%`,
          left: 0,
          right: 0
        }}
      />)}
      {[...Array(12)].map((_, i) => <div
        key={`v-${i}`}
        className="absolute w-px bg-white/10"
        style={{
          left: `${8.33 * (i + 1)}%`,
          top: 0,
          bottom: 0
        }}
      />)}
    </div>
    <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40"><div className="lg:max-w-[55%]">
      {
        /* Eyebrow */
      }
      <div
        className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      ><span className="inline-flex items-center gap-3 text-sm font-mono text-white/60">
        <span className="w-8 h-px bg-white/30" />
        {"HELLO,"}
      </span></div>
      {
        /* Main headline */
      }
      <div className="mb-12"><h1
        className={`text-left text-[clamp(2rem,6vw,7rem)] font-display leading-[0.92] tracking-tight text-white transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <span className="block whitespace-nowrap">I AM</span>
        <span className="block whitespace-nowrap"><span className="relative inline-block"><BlurWord word={words[0]} trigger={isVisible} /></span></span>
      </h1>
      <p
        className={`mt-6 text-lg lg:text-xl text-white/60 max-w-xl transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        Building scalable web applications and AI-powered systems for real-world impact
      </p>
      </div></div></div>
    {
      /* Stats — 3 metrics static, no auto-scroll */
    }
    <div
      className={`absolute bottom-12 left-0 right-0 px-6 lg:px-12 transition-all duration-700 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    ><div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono tracking-[0.2em] text-white/40 uppercase">
        <span>FULL-STACK</span>
        <span className="text-white/20">\</span>
        <span>REAL-TIME SYSTEMS</span>
        <span className="text-white/20">\</span>
        <span>AI</span>
        <span className="text-white/20">\</span>
        <span>CLOUD</span>
      </div>
      <div className="text-xs font-mono text-white/40 animate-bounce flex items-center gap-2">
        Scroll to explore <span className="text-lg">↓</span>
      </div>
    </div></div>
    {
      /* Scroll indicator */
    }
  </section>;
}
