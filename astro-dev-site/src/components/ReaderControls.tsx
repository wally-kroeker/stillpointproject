import React, { useState, useEffect } from 'react';
import { Settings, Type, AlignLeft, AlignCenter, AlignJustify, Moon, Sun, BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'light' | 'dark' | 'sepia';
type FontFamily = 'sans' | 'serif' | 'mono';
type Width = 'narrow' | 'normal' | 'wide';

export default function ReaderControls() {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>('dark');
    const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
    const [fontSize, setFontSize] = useState(18);
    const [width, setWidth] = useState<Width>('normal');
    const [mounted, setMounted] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('reader-theme') as Theme || 'dark';
        const savedFont = localStorage.getItem('reader-font') as FontFamily || 'serif';
        const savedSize = parseInt(localStorage.getItem('reader-size') || '18');
        const savedWidth = localStorage.getItem('reader-width') as Width || 'normal';

        setTheme(savedTheme);
        setFontFamily(savedFont);
        setFontSize(savedSize);
        setWidth(savedWidth);
        setMounted(true);

        applySettings(savedTheme, savedFont, savedSize, savedWidth);
    }, []);

    const applySettings = (t: Theme, f: FontFamily, s: number, w: Width) => {
        const root = document.documentElement;
        const content = document.getElementById('reader-content');

        // Apply Theme
        root.setAttribute('data-theme', t);

        // Apply Font
        if (content) {
            content.style.fontFamily = f === 'serif' ? 'var(--font-serif)' : f === 'mono' ? 'monospace' : 'var(--font-sans)';
            content.style.fontSize = `${s}px`;

            // Apply Width
            const maxWidth = w === 'narrow' ? '600px' : w === 'wide' ? '1000px' : '800px';
            content.style.maxWidth = maxWidth;
        }
    };

    const updateSetting = (
        key: string,
        value: any,
        setter: React.Dispatch<any>
    ) => {
        setter(value);
        localStorage.setItem(key, String(value));

        // Re-apply all current settings with the new value
        applySettings(
            key === 'reader-theme' ? value : theme,
            key === 'reader-font' ? value : fontFamily,
            key === 'reader-size' ? value : fontSize,
            key === 'reader-width' ? value : width
        );
    };

    if (!mounted) return null;

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[var(--color-bg-accent)]/80 text-[var(--color-text-muted)] border border-[var(--color-border)] shadow-md hover:bg-[var(--color-bg-accent)] hover:text-white transition-all"
                aria-label="Reader Settings"
            >
                {isOpen ? <X size={24} /> : <Settings size={24} />}
            </button>

            {/* Controls Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-80 p-6 rounded-2xl bg-glass-surface backdrop-blur-xl border border-border-glow shadow-2xl text-white"
                    >
                        <div className="space-y-6">
                            {/* Theme */}
                            <div>
                                <label className="text-xs uppercase tracking-widest text-gray-400 mb-3 block">Theme</label>
                                <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                                    {(['light', 'dark', 'sepia'] as Theme[]).map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => updateSetting('reader-theme', t, setTheme)}
                                            className={`flex-1 py-2 rounded-md text-sm capitalize transition-colors ${theme === t ? 'bg-accent-gold text-deep-space font-bold' : 'hover:bg-white/10'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Family */}
                            <div>
                                <label className="text-xs uppercase tracking-widest text-gray-400 mb-3 block">Typeface</label>
                                <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                                    <button
                                        onClick={() => updateSetting('reader-font', 'sans', setFontFamily)}
                                        className={`flex-1 py-2 rounded-md font-sans ${fontFamily === 'sans' ? 'bg-accent-gold text-deep-space' : 'hover:bg-white/10'}`}
                                    >
                                        Sans
                                    </button>
                                    <button
                                        onClick={() => updateSetting('reader-font', 'serif', setFontFamily)}
                                        className={`flex-1 py-2 rounded-md font-serif ${fontFamily === 'serif' ? 'bg-accent-gold text-deep-space' : 'hover:bg-white/10'}`}
                                    >
                                        Serif
                                    </button>
                                    <button
                                        onClick={() => updateSetting('reader-font', 'mono', setFontFamily)}
                                        className={`flex-1 py-2 rounded-md font-mono ${fontFamily === 'mono' ? 'bg-accent-gold text-deep-space' : 'hover:bg-white/10'}`}
                                    >
                                        Mono
                                    </button>
                                </div>
                            </div>

                            {/* Font Size */}
                            <div>
                                <label className="text-xs uppercase tracking-widest text-gray-400 mb-3 block">Size ({fontSize}px)</label>
                                <input
                                    type="range"
                                    min="14"
                                    max="32"
                                    value={fontSize}
                                    onChange={(e) => updateSetting('reader-size', parseInt(e.target.value), setFontSize)}
                                    className="w-full accent-accent-gold h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            {/* Width */}
                            <div>
                                <label className="text-xs uppercase tracking-widest text-gray-400 mb-3 block">Width</label>
                                <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
                                    <button
                                        onClick={() => updateSetting('reader-width', 'narrow', setWidth)}
                                        className={`flex-1 py-2 rounded-md flex justify-center ${width === 'narrow' ? 'bg-accent-gold text-deep-space' : 'hover:bg-white/10'}`}
                                    >
                                        <AlignLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateSetting('reader-width', 'normal', setWidth)}
                                        className={`flex-1 py-2 rounded-md flex justify-center ${width === 'normal' ? 'bg-accent-gold text-deep-space' : 'hover:bg-white/10'}`}
                                    >
                                        <AlignCenter size={18} />
                                    </button>
                                    <button
                                        onClick={() => updateSetting('reader-width', 'wide', setWidth)}
                                        className={`flex-1 py-2 rounded-md flex justify-center ${width === 'wide' ? 'bg-accent-gold text-deep-space' : 'hover:bg-white/10'}`}
                                    >
                                        <AlignJustify size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
