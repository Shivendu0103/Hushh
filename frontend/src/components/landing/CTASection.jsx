import { motion } from 'framer-motion';

export function CTASection({ onOpenAuth }) {
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
    <section className="relative py-20 md:py-32 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-2 gap-16 items-center bg-card border border-border rounded-2xl p-8 md:p-12"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ready to
              <span className="block text-primary">vibe?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of creators, artists, and dreamers. Experience authentic
              connection powered by real vibes and infinite possibilities.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <span className="text-primary">✓</span>
                24/7 Real-time connection
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground">
                <span className="text-primary">✓</span>
                Privacy-first design
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            variants={itemVariants}
            className="bg-background/50 backdrop-blur-sm border border-accent/20 rounded-xl p-8 space-y-6 flex flex-col justify-center items-center text-center"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Start Your Journey
              </h3>
              <p className="text-sm text-muted-foreground">
                Create your Hushh account and join the vibe
              </p>
            </div>
            
            <div className="w-full flex flex-col gap-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full py-3 px-4 bg-transparent border border-border text-foreground rounded-lg font-semibold hover:bg-white/5 transition-colors"
              >
                Already have an account? Sign in
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
