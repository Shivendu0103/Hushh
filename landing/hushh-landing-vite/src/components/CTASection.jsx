import { useState } from 'react';
import { motion } from 'framer-motion';

export function CTASection() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isLogin ? 'Login' : 'Signup', { email, password, ...(isLogin ? {} : { name }) });
    // Reset form
    setEmail('');
    setPassword('');
    setName('');
  };

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

          {/* Right Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="bg-background/50 backdrop-blur-sm border border-accent/20 rounded-xl p-8 space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Start Your Journey'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? 'Sign in to your Hushh account'
                  : 'Create your Hushh account and join the vibe'}
              </p>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="w-full text-sm text-accent hover:text-accent/80 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
