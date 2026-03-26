import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const navLinks = [
    { name: 'Novel', href: '/novel' },
    { name: 'Stories', href: '/stories' },
    { name: 'World', href: '/lore' },
    { name: 'About', href: '/about' },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-deep-space/95 backdrop-blur-sm border-b border-border-glow">
            <div className="px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
                <div className="flex items-center">
                    <a href="/" className={`text-2xl font-serif font-bold tracking-wider ${
                        currentPath === '/' ? 'text-accent-gold' : 'text-[var(--color-heading)]'
                    }`}>
                        The StillPoint Project
                    </a>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-sans transition-colors uppercase tracking-wider ${
                                currentPath.startsWith(link.href)
                                    ? 'text-accent-gold border-b border-accent-gold pb-1'
                                    : 'text-[var(--color-text-muted)] hover:text-text-primary'
                            }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-text-primary p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden px-6 py-4 max-w-5xl mx-auto border-t border-border-glow">
                    <div className="flex flex-col space-y-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-sm font-sans transition-colors uppercase tracking-wider py-3 min-h-[44px] flex items-center ${
                                    currentPath.startsWith(link.href)
                                        ? 'text-accent-gold'
                                        : 'text-[var(--color-text-muted)] hover:text-text-primary'
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
