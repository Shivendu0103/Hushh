import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Community", href: "#community" },
    { name: "Pricing", href: "#pricing" },
  ];

  window.addEventListener('scroll', () => {
    setIsScrolled(window.scrollY > 50);
  });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold text-primary">Hushh</span>
          <span className="text-sm text-accent">⚡</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#login" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            Login
          </a>
          <button
            className="px-6 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Join Hushh
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-sm text-foreground/70 hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex gap-4 pt-4 border-t border-border">
              <button className="flex-1 px-4 py-2 border border-border rounded-full text-sm">
                Login
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
