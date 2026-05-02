import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthModal from '../components/auth/AuthModal';
import { Navigation } from '../components/landing/Navigation';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CtaSection } from '../components/landing/CtaSection';
import { FooterSection } from '../components/landing/FooterSection';

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const location = useLocation();

    // Force dark mode for components
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const openAuth = (mode) => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    return (
        <div className="w-full min-h-screen bg-background text-foreground relative selection:bg-purple-500/30 overflow-x-hidden">
            {/* Dim overlay when modal is open */}
            <div
                className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-500 pointer-events-none ${isAuthModalOpen ? 'opacity-100' : 'opacity-0'}`}
            />
            
            <Navigation onOpenAuth={openAuth} />
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CtaSection onOpenAuth={openAuth} />
            <FooterSection />

            <div className="pointer-events-auto relative z-[70]">
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                    initialMode={authMode}
                />
            </div>
        </div>
    );
};

export default LandingPage;
