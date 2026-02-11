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

        // Desktop Animation (Scroll to Stack) - UNCHANGED
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
                    end: `+=${totalCards * 150}%`,
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
                    xPercent: -120,
                    y: index * 4,
                    rotation: -2 + (index * 1),
                    scale: 0.85,
                    zIndex: index,
                    opacity: 1,
                    boxShadow: "-5px 5px 20px rgba(0,0,0,0.5)",
                    duration: 1,
                    ease: "power2.inOut"
                });
            });
        });

        // Mobile: Horizontal Grid with Fade & Slide Animation (NEW)
        ctx.add("(max-width: 767px)", () => {
            setIsMobile(true);
            const cards = cardsRef.current.filter(Boolean);
            gsap.set(cards, { clearProps: "all" });
            if (wrapperRef.current) gsap.set(wrapperRef.current, { clearProps: "all" });
            if (containerRef.current) gsap.set(containerRef.current, { clearProps: "all" });

            // Fade & Slide entrance animation
            gsap.from(cards, {
                opacity: 0,
                y: 30,
                scale: 0.95,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            });
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
            // Calculate how many columns to show at once (2 columns per page)
            const itemsPerPage = 2;
            const maxPage = Math.ceil(items.length / itemsPerPage) - 1;

            if (diff > 0 && currentIndex < maxPage) {
                // Swipe left - next page
                setCurrentIndex(prev => prev + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous page
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

            {/* Desktop: Stacking animation wrapper */}
            {/* Mobile: Horizontal scroll grid with 2 rows */}
            <div
                ref={wrapperRef}
                className="
                    w-full max-w-2xl 
                    md:relative md:h-[90vh] md:aspect-video md:flex md:items-center md:justify-center
                    flex flex-row flex-wrap h-auto aspect-auto transition-transform duration-500 ease-out overflow-x-auto md:overflow-visible
                    snap-x snap-mandatory md:snap-none
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
                                relative w-1/2 flex-shrink-0 h-auto snap-start
                                opacity-100 scale-100 md:opacity-100 md:scale-100
                            `}
                            style={{
                                zIndex: reverseIndex,
                            }}
                        >
                            <div className="w-full h-full flex items-center justify-center p-2 md:p-4">
                                {item.children}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Dots - Mobile Only */}
            {isMobile && (
                <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {Array.from({ length: Math.ceil(items.length / 2) }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'w-8 bg-accent-primary'
                                    : 'w-2 bg-muted-foreground/30'
                                }`}
                            aria-label={`Go to page ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Swipe Indicators - Mobile Only */}
            <>
                {/* Left Arrow */}
                {currentIndex > 0 && (
                    <div className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="flex items-center gap-1 text-muted-foreground/60">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Right Arrow */}
                {currentIndex < Math.ceil(items.length / 2) - 1 && (
                    <div className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="flex items-center gap-1 text-muted-foreground/60">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
