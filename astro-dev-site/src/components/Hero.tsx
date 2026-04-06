import React, { useEffect, useRef, useState } from 'react';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const SUBTITLE_TEXT = 'Every culture that has ever existed found its way to stillness. Desert hermits counting breaths on a rope. Chan monks pouring tea until the steam matched their breathing. Quakers sitting in silence until the light moved someone to speak. A Diné singer painting dawn on a hogan floor before the world wakes. This is not new. This is the oldest thing we know.';
const ANIMATION_DURATION_MS = 10000;
const START_WIDTH = 150;
const INITIAL_DELAY_MS = 1000;

const heroStyles = `
@keyframes starDrift {
    0%   { transform: translateY(0px); }
    100% { transform: translateY(-40px); }
}
@keyframes breathe {
    0%, 100% { opacity: 0.15; }
    50%       { opacity: 0.95; }
}
@media (prefers-reduced-motion: no-preference) {
    .star-layer-1 { animation: starDrift 28s ease-in-out infinite alternate; }
    .star-layer-2 { animation: starDrift 42s ease-in-out infinite alternate-reverse; }
    .star-layer-3 { animation: starDrift 60s ease-in-out infinite alternate; }
    .breathe-overlay { animation: breathe 8s ease-in-out infinite; }
}
`;

// Slow ease-in-out: gentle start, gradual middle, soft landing
function easeInOutQuart(t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

type SettlingState = {
    settled: boolean;
    lineRefsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
};

// Max lines the subtitle could break into at narrowest width
const MAX_LINES = 30;

function useSettlingAnimation(containerRef: React.RefObject<HTMLDivElement | null>): SettlingState {
    const [settled, setSettled] = useState(true);
    const lineRefsRef = useRef<(HTMLDivElement | null)[]>([]);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const container = containerRef.current;
        if (!container) return;

        let cancelled = false;

        document.fonts.ready.then(() => {
            if (cancelled) return;

            const isDesktop = window.matchMedia('(min-width: 768px)').matches;
            const font = isDesktop
                ? '300 18px "Crimson Text"'
                : '300 16px "Crimson Text"';
            const lineHeight = isDesktop ? 27 : 24;
            const endWidth = container.clientWidth;

            if (endWidth <= START_WIDTH) return;

            let prepared: ReturnType<typeof prepareWithSegments>;
            try {
                prepared = prepareWithSegments(SUBTITLE_TEXT, font);
            } catch {
                return;
            }

            // Direct DOM update — no React reconciliation
            function renderLines(width: number) {
                const result = layoutWithLines(prepared, width, lineHeight);
                const lineEls = lineRefsRef.current;
                for (let i = 0; i < MAX_LINES; i++) {
                    const el = lineEls[i];
                    if (!el) continue;
                    if (i < result.lines.length) {
                        el.textContent = result.lines[i]!.text;
                        el.style.display = '';
                    } else {
                        el.textContent = '';
                        el.style.display = 'none';
                    }
                }
            }

            // Show initial fractured state
            renderLines(START_WIDTH);
            setSettled(false);

            const startTime = performance.now();

            function tick(now: number) {
                if (cancelled) return;

                const elapsed = now - startTime;

                if (elapsed < INITIAL_DELAY_MS) {
                    rafRef.current = requestAnimationFrame(tick);
                    return;
                }

                const animElapsed = elapsed - INITIAL_DELAY_MS;
                const t = Math.min(animElapsed / ANIMATION_DURATION_MS, 1);
                const progress = easeInOutQuart(t);
                const currentWidth = START_WIDTH + (endWidth - START_WIDTH) * progress;

                renderLines(currentWidth);

                if (t >= 1) {
                    setSettled(true);
                    return;
                }

                rafRef.current = requestAnimationFrame(tick);
            }

            rafRef.current = requestAnimationFrame(tick);
        });

        return () => {
            cancelled = true;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [containerRef]);

    return { settled, lineRefsRef };
}


export default function Hero() {
    const subtitleRef = useRef<HTMLDivElement>(null);
    const { settled, lineRefsRef } = useSettlingAnimation(subtitleRef);

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

            {/* Breathing overlay — tighter ellipse for more visible atmospheric pulse */}
            <div
                className="breathe-overlay absolute inset-0 z-[4]"
                style={{
                    background: `
                        radial-gradient(ellipse 50% 40% at 50% 50%, transparent 0%, rgba(8,14,17,0.85) 100%),
                        radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(196,163,90,0.03) 100%)
                    `,
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
                <div
                    ref={subtitleRef}
                    className="mb-12 max-w-2xl mx-auto font-serif font-light text-left"
                    role="paragraph"
                    style={{
                        color: settled ? 'var(--color-text)' : 'var(--color-text-muted)',
                        transition: settled ? 'color 1s ease-out' : 'none',
                    }}
                >
                    {/* Pre-rendered line slots — updated via direct DOM manipulation, not React re-renders */}
                    {Array.from({ length: MAX_LINES }, (_, i) => (
                        <div
                            key={i}
                            ref={el => { lineRefsRef.current[i] = el; }}
                            className="text-base md:text-lg leading-relaxed"
                            style={{ display: i === 0 ? '' : 'none' }}
                        >
                            {i === 0 ? SUBTITLE_TEXT : ''}
                        </div>
                    ))}
                </div>
                <a
                    href="/novel"
                    className="inline-block px-8 py-3 border border-accent-gold/60 bg-accent-gold/5 text-accent-gold font-sans text-sm tracking-wider uppercase hover:bg-accent-gold/15 hover:scale-105 hover:shadow-[0_0_20px_rgba(196,163,90,0.2)] transition-all duration-300"
                    style={{
                        opacity: settled ? 1 : 0,
                        transition: 'opacity 1s ease-out',
                        pointerEvents: settled ? 'auto' : 'none',
                    }}
                >
                    Begin the Journey
                </a>
            </div>
        </section>
    );
}
