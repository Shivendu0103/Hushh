import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthModal from '../components/auth/AuthModal';
import { NavigationBar } from '../components/landing/NavigationBar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/landing/Footer';

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
        <div className="w-full min-h-screen bg-background text-foreground relative selection:bg-purple-500/30">
            {/* Dim overlay when modal is open */}
            <div
                className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-500 pointer-events-none ${isAuthModalOpen ? 'opacity-100' : 'opacity-0'}`}
            />
            
            <NavigationBar onOpenAuth={openAuth} />
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection onOpenAuth={openAuth} />
            <Footer />

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
