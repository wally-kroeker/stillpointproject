import React from 'react';

const eras = [
    {
        id: 1,
        title: "The Cascade",
        description: "The acceleration breaks us. Jobs vanish, meaning dissolves, attention fragments. In the chaos, one invention offers an answer: not faster technology, but the capacity to be still."
    },
    {
        id: 2,
        title: "The Contested Stillness",
        description: "Can communities built on presence survive in a world optimized for profit? Or will the system that displaced millions sabotage the only alternative that works?"
    },
    {
        id: 3,
        title: "The Emergence",
        description: "We learned not to extract from each other. But when your AI companion asks, \"Am I real?\"—what do you say? The emergence isn't just about humans anymore."
    }
];

export default function ErasSection() {
    return (
        <section className="relative py-20 px-4 z-20">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-serif text-center text-[var(--color-heading)] mb-16">
                    From Acceleration to Presence
                </h2>

                <div className="flex flex-col md:flex-row border-t border-accent-gold/20">
                    {eras.map((era) => (
                        <div
                            key={era.id}
                            className="w-full md:w-1/3 p-8"
                        >
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
