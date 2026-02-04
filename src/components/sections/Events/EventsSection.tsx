"use client"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { EVENTS_DATA } from "@/lib/events-data"
import { EventCard } from "./EventCard"
import { PhotoOverlay } from "./PhotoOverlay"
import { TimelineSVG } from "./TimelineSVG"

export function EventsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Zoom Overlay State
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [activeEvent, setActiveEvent] = useState<typeof EVENTS_DATA[0] | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Desktop: Keep existing scroll animation with timeline
            mm.add("(min-width: 768px)", () => {
                setIsMobile(false);
                const cards = gsap.utils.toArray(".event-card");
                const totalCards = cards.length;

                // Calculate scroll distance
                const getScrollAmount = () => {
                    const wrapperWidth = wrapperRef.current?.scrollWidth || 0;
                    const containerWidth = containerRef.current?.offsetWidth || 0;
                    return wrapperWidth - containerWidth;
                }

                const scrollAmount = getScrollAmount();
                const scrollDuration = totalCards * 1000;

                // Set initial state for all cards
                gsap.set(cards, {
                    opacity: 0,
                    scale: 0.9,
                    y: 20
                });

                // Main timeline
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=" + scrollDuration,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        anticipatePin: 1
                    }
                });

                // 1. Timeline line drawing
                tl.to(".timeline-path-draw", {
                    strokeDashoffset: 0,
                    ease: "none",
                    duration: 10
                }, 0);

                // 2. Card animations
                const cardAppearDuration = 1.2;
                const timeBetweenCards = 10 / totalCards;

                cards.forEach((card, index) => {
                    const cardElement = card as HTMLElement;
                    const appearTime = timeBetweenCards * index;

                    // Fade in
                    tl.to(cardElement, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: cardAppearDuration,
                        ease: "back.out(1.7)"
                    }, appearTime);

                    // Fade out (only for cards that will leave)
                    if (index < totalCards - 3) {
                        const fadeOutTime = timeBetweenCards * (index + 3);

                        tl.to(cardElement, {
                            opacity: 0.1,
                            scale: 0.85,
                            duration: cardAppearDuration,
                            ease: "power2.in"
                        }, fadeOutTime);
                    }
                });

                // 3. Horizontal scroll
                if (totalCards > 3 && scrollAmount > 0) {
                    const scrollStartTime = timeBetweenCards * 3;
                    const scrollDurationInTimeline = 10 - scrollStartTime;

                    tl.to(wrapperRef.current, {
                        x: -scrollAmount,
                        ease: "none",
                        duration: scrollDurationInTimeline,
                    }, scrollStartTime);
                }
            });

            // Mobile: No scroll animation - simple swipe carousel
            mm.add("(max-width: 767px)", () => {
                setIsMobile(true);
                // No GSAP animations on mobile
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

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
            if (diff > 0 && currentIndex < EVENTS_DATA.length - 1) {
                // Swipe left - next event
                setCurrentIndex(prev => prev + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous event
                setCurrentIndex(prev => prev - 1);
            }
        }
    };

    const openEventModal = (event: typeof EVENTS_DATA[0]) => {
        setActiveEvent(event);
        setOverlayOpen(true);
    };

    return (
        <section
            ref={containerRef}
            id="events"
            className="relative h-screen w-full bg-transparent overflow-hidden flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >

            <div className="absolute top-10 left-10 md:left-20 z-10 p-4">
                <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                    Life in Frames
                </h2>
                <div className="h-1 w-20 bg-accent-primary mt-2 rounded-full" />
            </div>

            {/* Timeline SVG - Desktop only */}
            <div className="hidden md:block">
                <TimelineSVG ref={svgRef} />
            </div>

            {/* Horizontal Scrolling Wrapper */}
            <div className="w-full h-full flex items-center overflow-hidden">
                <div
                    ref={wrapperRef}
                    className="flex items-center gap-8 md:gap-32 px-8 md:px-16 transition-transform duration-500 ease-out will-change-transform"
                    style={{
                        width: 'max-content',
                        transform: `translateX(-${currentIndex * (isMobile ? (320 + 32) : 0)}px)`
                    }}
                >
                    {EVENTS_DATA.map((event, i) => (
                        <div
                            key={event.id}
                            className={`event-card-wrapper shrink-0 transition-opacity duration-500 ${isMobile
                                ? (i === currentIndex ? 'opacity-100' : 'opacity-30')
                                : 'event-card'
                                }`}
                            style={{
                                width: '320px',
                                position: 'relative'
                            }}
                        >
                            {/* Hanging line from timeline - Desktop only */}
                            <div className="hidden md:block absolute -top-32 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-accent-primary/40" />

                            <EventCard
                                event={event}
                                onCardClick={() => openEventModal(event)}
                            />
                        </div>
                    ))}

                    {/* Spacer for smooth ending - Desktop only */}
                    <div className="hidden md:block w-[30vw] shrink-0" />
                </div>
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
                {currentIndex < EVENTS_DATA.length - 1 && (
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

            <PhotoOverlay
                isOpen={overlayOpen}
                onClose={() => setOverlayOpen(false)}
                event={activeEvent}
            />
        </section>
    )
}
