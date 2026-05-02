export function Footer() {
  const footerLinks = {
    Features: [
      { name: 'Chaos Mode', href: '#' },
      { name: 'Theme Songs', href: '#' },
      { name: 'Gamification', href: '#' },
      { name: 'Stories', href: '#' },
    ],
    Community: [
      { name: 'Discover Vibers', href: '#' },
      { name: 'Trending', href: '#' },
      { name: 'Events', href: '#' },
      { name: 'Support', href: '#' },
    ],
    Company: [
      { name: 'About Hushh', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Join Us', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Code of Conduct', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'TikTok', href: '#' },
  ];

  return (
    <footer className="relative py-16 md:py-20 px-6 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <a href="#" className="inline-flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold text-primary">Hushh</span>
              <span className="text-sm text-accent">⚡</span>
            </a>
            <p className="text-muted-foreground leading-relaxed max-w-xs text-sm">
              Where energy, vibes, and real-time connection come together. Express yourself
              authentically.
            </p>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Hushh. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
