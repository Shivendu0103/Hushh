import { useEffect, useRef, useState } from "react";
const features = [
  {
    number: "01",
    title: "Chaos Mode",
    description: "Transform your entire UI with neon gradients and physics-based interactions. Turn up the energy and experience a high-octane visual transformation.",
    stats: { value: "\u221E", label: "creative vibes" }
  },
  {
    number: "02",
    title: "Personalized Theme Songs",
    description: "Express your identity with profile-specific theme music. Let your aura shine through the soundtrack of your digital presence.",
    stats: { value: "\u{1F3B5}", label: "self-expression" }
  },
  {
    number: "03",
    title: "Real-Time Connection",
    description: "Instant messaging, presence tracking, and multi-provider auth. Connect with Vibers using Google, GitHub, or Email seamlessly.",
    stats: { value: "24/7", label: "live connection" }
  },
  {
    number: "04",
    title: "Matrix Gamification",
    description: "Level up your profile, earn XP, and unlock unique achievements. Your vibe count grows with every interaction and moment shared.",
    stats: { value: "\u{1F4C8}", label: "level up fast" }
  }
];
function ParticleVisualization() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas)
      return;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      };
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    const COUNT = 70;
    const particles = Array.from({ length: COUNT }, (_, i) => {
      const seed = i * 1.618;
      return {
        bx: seed * 127.1 % 1,
        by: seed * 311.7 % 1,
        phase: seed * Math.PI * 2,
        speed: 0.4 + seed % 0.4,
        radius: 1.2 + seed % 2.2
      };
    });
    let time = 0;
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      particles.forEach((p) => {
        const flowX = Math.sin(time * p.speed * 0.4 + p.phase) * 38;
        const flowY = Math.cos(time * p.speed * 0.3 + p.phase * 0.7) * 24;
        const bx = p.bx * w;
        const by = p.by * h;
        const dx = p.bx - mx;
        const dy = p.by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist * 2.8);
        const x = bx + flowX + influence * Math.cos(time + p.phase) * 36;
        const y = by + flowY + influence * Math.sin(time + p.phase) * 36;
        const pulse = Math.sin(time * p.speed + p.phase) * 0.5 + 0.5;
        const alpha = 0.08 + pulse * 0.18 + influence * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, p.radius + pulse * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });
      time += 0.016;
      frameRef.current = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);
  return <canvas
    ref={canvasRef}
    className="absolute inset-0 pointer-events-auto"
    style={{ width: "100%", height: "100%" }}
  />;
}
export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current)
      observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return <section
    id="features"
    ref={sectionRef}
    className="relative py-24 lg:py-32 overflow-hidden"
  ><div className="max-w-[1400px] mx-auto px-6 lg:px-12">
    {
      /* Header - Full width with diagonal layout */
    }
    <div className="relative mb-24 lg:mb-32"><div className="grid lg:grid-cols-12 gap-8 items-end">
      <div className="lg:col-span-7">
        <span className="inline-flex items-center gap-3 text-sm font-mono text-accent mb-6">
          <span className="w-12 h-px bg-accent/50" />
          {"Features That Matter"}
        </span>
        <h2
          className={`text-6xl md:text-7xl lg:text-[128px] font-display tracking-tight leading-[0.9] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {"Powerful"}
          <br />
          <span className="text-primary">tools.</span>
        </h2>
      </div>
      <div className="lg:col-span-5 lg:pb-4"><p className={`text-xl text-muted-foreground leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>Everything you need to express yourself, connect authentically, and build your digital presence on your terms.</p></div>
    </div></div>
    {
      /* Bento Grid Layout */
    }
    <div className="grid lg:grid-cols-12 gap-4 lg:gap-6">
      {
        /* Large feature card */
      }
      <div
        className={`lg:col-span-12 relative bg-card border border-border min-h-[500px] overflow-hidden group transition-all duration-700 flex rounded-lg ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
        onMouseEnter={() => setActiveFeature(0)}
      >
        {
          /* Left: text content */
        }
        <div className="relative flex-1 p-8 lg:p-12 bg-gradient-to-br from-card via-card to-card/80">
          <ParticleVisualization />
          <div className="relative z-10">
            <span className="font-mono text-sm text-accent">{features[0].number}</span>
            <h3 className="text-3xl lg:text-4xl font-display mt-4 mb-6 group-hover:translate-x-2 transition-transform duration-500 text-foreground">{features[0].title}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-8">{features[0].description}</p>
            <div>
              <span className="text-5xl lg:text-6xl font-display text-primary">{features[0].stats.value}</span>
              <span className="block text-sm text-muted-foreground font-mono mt-2">{features[0].stats.label}</span>
            </div>
          </div>
        </div>
        {
          /* Right: decorative gradient */
        }
        <div className="hidden lg:block relative w-[42%] shrink-0 overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20"><div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/20" /></div>
      </div>
    </div>
  </div></section>;
}
