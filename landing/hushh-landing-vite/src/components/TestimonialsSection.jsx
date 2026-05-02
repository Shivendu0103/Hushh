import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function TestimonialsSection() {
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

  const testimonials = [
    {
      quote:
        "Hushh completely changed how I connect with people. The vibe is unmatched. Chaos Mode turned my feed into pure energy.",
      author: "Alex Rivera",
      role: "Content Creator",
      metric: "100K Vibers reached",
    },
    {
      quote:
        "The theme songs feature is genius. I finally feel like my profile reflects who I am. This is social media done right.",
      author: "Jordan Patel",
      role: "Musician",
      metric: "Creative freedom",
    },
    {
      quote:
        "I love the gamification system. Leveling up feels rewarding and the real-time connection keeps me coming back.",
      author: "Sam Chen",
      role: "Gamer",
      metric: "24/7 Always vibing",
    },
    {
      quote:
        "Finally a platform where authentic connection is everything. No algorithms pushing engagement, just real vibes and real people.",
      author: "Morgan Taylor",
      role: "Digital Nomad",
      metric: "Infinite possibilities",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 px-6 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.span variants={itemVariants} className="inline-flex items-center gap-3 text-sm font-mono text-accent mb-6">
            <span className="w-12 h-px bg-accent/50" />
            Loved by creators worldwide
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            What people say
          </motion.h2>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <p className="text-lg mb-6 text-foreground">"{testimonial.quote}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-semibold">{testimonial.metric}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
