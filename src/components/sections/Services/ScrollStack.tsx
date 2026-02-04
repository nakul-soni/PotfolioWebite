"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
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

    // State for mobile swipe navigation
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        const ctx = gsap.matchMedia();

        // Desktop Animation (Scroll to Stack)
        ctx.add("(min-width: 768px)", () => {
            setIsMobile(false);
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
            setIsMobile(true);
            const cards = cardsRef.current.filter(Boolean);
            gsap.set(cards, { clearProps: "all" });
            if (wrapperRef.current) gsap.set(wrapperRef.current, { clearProps: "all" });
            if (containerRef.current) gsap.set(containerRef.current, { clearProps: "all" });
        });

        return () => ctx.revert();
    }, [items]);

    // Touch swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < items.length - 1) {
                // Swipe left - next service
                setCurrentIndex(prev => prev + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous service
                setCurrentIndex(prev => prev - 1);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-auto min-h-screen md:h-screen flex items-center justify-center overflow-hidden bg-transparent"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >

            {/* 
              Responsive Wrapper:
              Desktop: Relative container for absolute cards (handled by GSAP)
              Mobile: Horizontal swipe carousel
            */}
            {/* 
              Responsive Wrapper:
              Desktop: Relative container for absolute cards (handled by GSAP)
              Mobile: Horizontal swipe carousel with translate
            */}
            <div
                ref={wrapperRef}
                className="
                    w-full max-w-2xl 
                    md:relative md:h-[90vh] md:aspect-video md:flex md:items-center md:justify-center
                    flex flex-row h-auto aspect-auto transition-transform duration-500 ease-out
                "
                style={{
                    transform: isMobile ? `translateX(-${currentIndex * 100}%)` : 'none'
                }}
            >
                {items.map((item, index) => {
                    const reverseIndex = items.length - 1 - index;

                    return (
                        <div
                            key={item.id}
                            ref={(el: any) => (cardsRef.current[index] = el)}
                            className={`
                                md:absolute md:top-0 md:left-0 md:w-full md:h-full 
                                relative w-full flex-shrink-0 h-auto
                                opacity-100 scale-100 md:opacity-100 md:scale-100
                            `}
                            style={{
                                // Initially set zIndex for Desktop logic (GSAP matchMedia will override if needed, or CSS handles it)
                                // We use style for zIndex to help the initial render
                                zIndex: reverseIndex,
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center p-4">
                                {item.children}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Swipe Indicators - Mobile Only */}
            <>
                {/* Left Arrow */}
                {currentIndex > 0 && (
                    <div className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-xs font-medium">Swipe</span>
                        </div>
                    </div>
                )}

                {/* Right Arrow */}
                {currentIndex < items.length - 1 && (
                    <div className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="flex items-center gap-2 text-muted-foreground/60">
                            <span className="text-xs font-medium">Swipe</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                )}
            </>

            <div className="absolute bottom-10 animate-bounce text-muted-foreground text-sm uppercase tracking-widest hidden md:block">
                Scroll to Explore
            </div>
        </div>
    );
};
