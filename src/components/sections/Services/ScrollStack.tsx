"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollStackProps {
    items: { id: string | number; children: ReactNode }[];
    offset?: number;
    scaleFactor?: number;
}

export const ScrollStack = ({
    items,
    scaleFactor = 0.05
}: ScrollStackProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.matchMedia();

        // Desktop Animation (Scroll to Stack)
        ctx.add("(min-width: 768px)", () => {
            if (!containerRef.current || !wrapperRef.current) return;

            const totalCards = items.length;
            const cards = cardsRef.current.filter(Boolean);

            // Initial setup for Desktop: Absolute positioning
            gsap.set(cards, {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                xPercent: 0,
                y: 0,
                rotation: 0,
                scale: 1
            });

            // Create a timeline that pins the container
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${totalCards * 150}%`, // Scroll distance
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // Buffer
            tl.to({}, { duration: 0.5 });

            // Animate each card to the left stack
            cards.forEach((card, index) => {
                tl.to(card, {
                    xPercent: -120, // Slide completely to left
                    y: index * 4,   // Compact vertical stack
                    rotation: -2 + (index * 1), // Very subtle rotation
                    scale: 0.85,     // Shrink
                    zIndex: index,   // Reorder z-index visually if needed
                    opacity: 1,      // Keep fully visible
                    boxShadow: "-5px 5px 20px rgba(0,0,0,0.5)",
                    duration: 1,
                    ease: "power2.inOut"
                });
            });
        });

        // Mobile Cleanup (Reset styles)
        ctx.add("(max-width: 767px)", () => {
            const cards = cardsRef.current.filter(Boolean);
            gsap.set(cards, { clearProps: "all" });
            if (wrapperRef.current) gsap.set(wrapperRef.current, { clearProps: "all" });
            if (containerRef.current) gsap.set(containerRef.current, { clearProps: "all" });
        });

        return () => ctx.revert();
    }, [items]);

    return (
        <div ref={containerRef} className="relative w-full h-auto min-h-screen md:h-screen flex items-center justify-center overflow-hidden bg-transparent">

            {/* 
              Responsive Wrapper:
              Desktop: Relative container for absolute cards (handled by GSAP)
              Mobile: Horizontal scroll container (Flex + Snap)
            */}
            <div
                ref={wrapperRef}
                className="
                    w-full max-w-2xl 
                    md:relative md:h-[90vh] md:aspect-video md:flex md:items-center md:justify-center
                    flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 px-4 py-8
                    h-auto aspect-auto
                "
            >
                {items.map((item, index) => {
                    const reverseIndex = items.length - 1 - index;

                    return (
                        <div
                            key={item.id}
                            ref={(el: any) => (cardsRef.current[index] = el)}
                            className="
                                md:absolute md:top-0 md:left-0 md:w-full md:h-full 
                                relative w-[85vw] flex-shrink-0 h-[70vh] snap-center
                            "
                            style={{
                                // Initially set zIndex for Desktop logic (GSAP matchMedia will override if needed, or CSS handles it)
                                // We use style for zIndex to help the initial render
                                zIndex: reverseIndex,
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                {item.children}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-10 animate-bounce text-muted-foreground text-sm uppercase tracking-widest hidden md:block">
                Scroll to Explore
            </div>
            <div className="absolute bottom-10 animate-pulse text-muted-foreground text-sm uppercase tracking-widest md:hidden">
                Swipe &rarr;
            </div>
        </div>
    );
};
