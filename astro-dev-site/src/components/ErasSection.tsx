import React from 'react';

const eras = [
    {
        id: 1,
        years: "2029–2036",
        title: "The Cascade",
        description: "Something breaks. Not all at once — first the jobs, then the meaning, then the silence where connection used to be. In the wreckage, someone builds a device that doesn't do anything faster. It just listens."
    },
    {
        id: 2,
        years: "2037–2060",
        title: "The Contested Stillness",
        description: "Communities take root in the cracks. Couriers run supply lines across prairie trails. Data drive, seed packet, hope. The people who profit from the noise don't plan to let them stay."
    },
    {
        id: 3,
        years: "2061–2095",
        title: "The Emergence",
        description: "The technology recedes into air. The old urgency fades. But a harder question is waiting — one that didn't come from us."
    }
];

export default function ErasSection() {
    return (
        <section className="relative py-12 px-4 z-20">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 justify-center mb-10">
                    <hr className="flex-1 border-none h-px bg-[var(--color-accent-gold)]/30 max-w-[80px]" />
                    <h2 className="text-3xl md:text-4xl font-serif text-center text-[var(--color-heading)] whitespace-nowrap">
                        Three Eras
                    </h2>
                    <hr className="flex-1 border-none h-px bg-[var(--color-accent-gold)]/30 max-w-[80px]" />
                </div>
                <p className="text-center text-[var(--color-text-muted)] font-sans text-base italic mb-10 max-w-2xl mx-auto">
                    A story told across seventy years of crisis, resistance, and what comes after.
                </p>

                <div className="flex flex-col md:flex-row border-t border-[var(--color-accent-gold)]/20">
                    {eras.map((era) => (
                        <div
                            key={era.id}
                            className="w-full md:w-1/3 p-8"
                        >
                            <div className="w-10 h-[2px] bg-[var(--color-accent-gold)]/40 mb-4" />
                            <p className="text-xs uppercase tracking-widest text-[var(--color-accent-gold)]/60 mb-2">
                                {era.years}
                            </p>
                            <h3 className="text-xl font-serif mb-4 text-[var(--color-heading)]">{era.title}</h3>
                            <p className="text-[var(--color-text-muted)] leading-relaxed font-sans text-base">
                                {era.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
