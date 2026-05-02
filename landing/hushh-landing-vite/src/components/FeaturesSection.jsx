import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Music, Wifi, Trophy } from 'lucide-react';

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Chaos Mode",
      description: "Transform your entire UI with neon gradients and physics-based interactions.",
    },
    {
      icon: Music,
      title: "Personalized Theme Songs",
      description: "Express your identity with profile-specific theme music.",
    },
    {
      icon: Wifi,
      title: "Real-Time Connection",
      description: "Instant messaging, presence tracking, and multi-provider auth.",
    },
    {
      icon: Trophy,
      title: "Matrix Gamification",
      description: "Level up, earn XP, and unlock unique achievements.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-20 md:py-32 px-6 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-accent">
              <span className="w-12 h-px bg-accent/50" />
              Features That Matter
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Powerful
            <span className="block text-primary">tools.</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl">
            Everything you need to express yourself, connect authentically, and build your
            digital presence on your terms.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group cursor-pointer"
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
