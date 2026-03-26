import React from 'react';

export default function Hero() {
    return (
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a1215] via-deep-space to-deep-space" />

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-serif font-light text-[var(--color-heading)] mb-8 leading-tight tracking-tight">
                    The StillPoint
                </h1>
                <p className="text-lg md:text-xl text-text-primary mb-12 max-w-2xl mx-auto font-serif font-light leading-relaxed">
                    A story exploring presence in an age of acceleration.
                </p>
                <a
                    href="/novel"
                    className="inline-block px-8 py-3 border border-accent-gold/60 bg-accent-gold/5 text-accent-gold font-sans text-sm tracking-wider uppercase hover:bg-accent-gold/15 transition-colors duration-300"
                >
                    Begin the Journey
                </a>
            </div>
        </section>
    );
}
