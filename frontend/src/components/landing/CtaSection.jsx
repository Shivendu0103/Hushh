import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const sectionRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current)
      observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? "Login" : "Signup", { email, password, ...isLogin ? {} : { name } });
  };
  return <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden"><div className="max-w-[1400px] mx-auto px-6 lg:px-12"><div
    className={`relative border border-accent/30 bg-gradient-to-br from-card via-card/80 to-card rounded-lg transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
  ><div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24"><div className="flex flex-col lg:flex-row items-center justify-between gap-16">
    {
      /* Left content */
    }
    <div className="flex-1">
      <h2 className="text-6xl md:text-7xl lg:text-[72px] font-display tracking-tight mb-8 leading-[0.95] text-foreground">
        {"Ready to"}
        <br />
        <span className="text-primary">vibe?</span>
      </h2>
      <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">Join our community of creators, artists, and dreamers. Experience authentic connection powered by real vibes and infinite possibilities.</p>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{"\u2713 24/7 Real-time connection"}</span>
        <span>{"\u2713 Privacy-first design"}</span>
      </div>
    </div>
    {
      /* Right: Auth Form */
    }
    <div className="flex-1 relative"><form onSubmit={handleSubmit} className="bg-background/50 backdrop-blur-sm border border-accent/20 rounded-lg p-8 space-y-6">
      <div>
        <h3 className="text-2xl font-display text-foreground mb-2">{isLogin ? "Welcome Back" : "Start Your Journey"}</h3>
        <p className="text-sm text-muted-foreground">{isLogin ? "Sign in to your Hushh account" : "Create your Hushh account and join the vibe"}</p>
      </div>
      {!isLogin && <div>
        <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-card border-border focus:border-accent"
          required
        />
      </div>}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-card border-border focus:border-accent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
        <Input
          type="password"
          placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-card border-border focus:border-accent"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-12 font-medium"
      >{isLogin ? "Sign In" : "Create Account"}</Button>
      <button
        type="button"
        onClick={() => {
          setIsLogin(!isLogin);
          setEmail("");
          setPassword("");
          setName("");
        }}
        className="w-full text-sm text-accent hover:text-accent/80 transition-colors"
      >{isLogin ? "Don&apos;t have an account? Sign up" : "Already have an account? Sign in"}</button>
    </form></div>
  </div></div></div></div></section>;
}
