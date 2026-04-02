import React from 'react';

const heroStyles = `
@keyframes starDrift {
    0%   { transform: translateY(0px); }
    100% { transform: translateY(-40px); }
}
@keyframes breathe {
    0%, 100% { opacity: 0.45; }
    50%       { opacity: 0.75; }
}
@media (prefers-reduced-motion: no-preference) {
    .star-layer-1 { animation: starDrift 28s ease-in-out infinite alternate; }
    .star-layer-2 { animation: starDrift 42s ease-in-out infinite alternate-reverse; }
    .star-layer-3 { animation: starDrift 60s ease-in-out infinite alternate; }
    .breathe-overlay { animation: breathe 6s ease-in-out infinite; }
}
`;

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <style>{heroStyles}</style>

            {/* Base gradient background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a1215] via-deep-space to-deep-space" />

            {/* Star field — layer 1 (sparse large dots) */}
            <div
                className="star-layer-1 absolute inset-0 z-[1]"
                style={{
                    backgroundImage: `
                        radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.18) 0%, transparent 100%),
                        radial-gradient(1px 1px at 34% 72%, rgba(255,255,255,0.12) 0%, transparent 100%),
                        radial-gradient(2px 2px at 58% 9%,  rgba(255,255,255,0.10) 0%, transparent 100%),
                        radial-gradient(1px 1px at 77% 54%, rgba(255,255,255,0.14) 0%, transparent 100%),
                        radial-gradient(1.5px 1.5px at 91% 31%, rgba(255,255,255,0.08) 0%, transparent 100%),
                        radial-gradient(1px 1px at 46% 88%, rgba(255,255,255,0.10) 0%, transparent 100%),
                        radial-gradient(2px 2px at 6%  63%, rgba(255,255,255,0.07) 0%, transparent 100%),
                        radial-gradient(1px 1px at 69% 77%, rgba(255,255,255,0.11) 0%, transparent 100%)
                    `,
                    backgroundSize: '100% 100%',
                }}
            />

            {/* Star field — layer 2 (medium density, finer dots) */}
            <div
                className="star-layer-2 absolute inset-0 z-[2]"
                style={{
                    backgroundImage: `
                        radial-gradient(1px 1px at 22% 44%, rgba(255,255,255,0.09) 0%, transparent 100%),
                        radial-gradient(1px 1px at 49% 26%, rgba(255,255,255,0.07) 0%, transparent 100%),
                        radial-gradient(1px 1px at 73% 68%, rgba(255,255,255,0.11) 0%, transparent 100%),
                        radial-gradient(1px 1px at 85% 14%, rgba(255,255,255,0.06) 0%, transparent 100%),
                        radial-gradient(1px 1px at 38% 91%, rgba(255,255,255,0.08) 0%, transparent 100%),
                        radial-gradient(1px 1px at 15% 82%, rgba(255,255,255,0.07) 0%, transparent 100%),
                        radial-gradient(1px 1px at 62% 47%, rgba(255,255,255,0.09) 0%, transparent 100%),
                        radial-gradient(1px 1px at 94% 59%, rgba(255,255,255,0.06) 0%, transparent 100%),
                        radial-gradient(1px 1px at 5%  35%, rgba(255,255,255,0.10) 0%, transparent 100%),
                        radial-gradient(1px 1px at 29% 7%,  rgba(255,255,255,0.08) 0%, transparent 100%)
                    `,
                    backgroundSize: '100% 100%',
                }}
            />

            {/* Star field — layer 3 (faintest scatter) */}
            <div
                className="star-layer-3 absolute inset-0 z-[3]"
                style={{
                    backgroundImage: `
                        radial-gradient(1px 1px at 8%  52%, rgba(255,255,255,0.05) 0%, transparent 100%),
                        radial-gradient(1px 1px at 41% 61%, rgba(255,255,255,0.04) 0%, transparent 100%),
                        radial-gradient(1px 1px at 55% 38%, rgba(255,255,255,0.05) 0%, transparent 100%),
                        radial-gradient(1px 1px at 79% 83%, rgba(255,255,255,0.04) 0%, transparent 100%),
                        radial-gradient(1px 1px at 19% 29%, rgba(255,255,255,0.05) 0%, transparent 100%),
                        radial-gradient(1px 1px at 66% 21%, rgba(255,255,255,0.04) 0%, transparent 100%),
                        radial-gradient(1px 1px at 88% 45%, rgba(255,255,255,0.05) 0%, transparent 100%),
                        radial-gradient(1px 1px at 32% 95%, rgba(255,255,255,0.03) 0%, transparent 100%)
                    `,
                    backgroundSize: '100% 100%',
                }}
            />

            {/* Breathing radial gradient overlay — atmospheric depth */}
            <div
                className="breathe-overlay absolute inset-0 z-[4]"
                style={{
                    background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(8,14,17,0.55) 100%)',
                }}
            />

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
                <h1
                    className="text-5xl md:text-7xl font-serif font-light text-[var(--color-heading)] mb-8 leading-tight tracking-tight"
                    style={{ textShadow: '0 0 40px rgba(196,163,90,0.15)' }}
                >
                    The StillPoint
                </h1>
                <p className="text-lg md:text-xl text-text-primary mb-12 max-w-2xl mx-auto font-serif font-light leading-relaxed">
                    Beneath the noise, something older is waiting.
                </p>
                <a
                    href="/novel"
                    className="inline-block px-8 py-3 border border-accent-gold/60 bg-accent-gold/5 text-accent-gold font-sans text-sm tracking-wider uppercase hover:bg-accent-gold/15 hover:scale-105 hover:shadow-[0_0_20px_rgba(196,163,90,0.2)] transition-all duration-300"
                >
                    Begin the Journey
                </a>
            </div>
        </section>
    );
}
