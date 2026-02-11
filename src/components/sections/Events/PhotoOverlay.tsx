"use client"
import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { gsap } from "gsap";
import { Event } from "@/lib/events-data";

interface PhotoOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
}

export function PhotoOverlay({ isOpen, onClose, event }: PhotoOverlayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const overlayRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);

    // Touch gesture refs for swipe navigation
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)
    const touchStartY = useRef(0)
    const touchEndY = useRef(0)
    const dragStartY = useRef(0)
    const isDragging = useRef(false)

    useEffect(() => {
        if (isOpen && event) {
            setCurrentIndex(0);

            // Save current scroll position
            const scrollY = window.scrollY

            // Animation In
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );

            // Bottom sheet slide up animation
            gsap.fromTo(sheetRef.current,
                { y: '100%' },
                { y: '0%', duration: 0.4, ease: "power2.out" }
            );

            // Lock body scroll
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";

            // Fix position to prevent scroll on mobile
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
        } else {
            // Get the scroll position before restoring
            const scrollY = document.body.style.top

            // Restore scroll
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";

            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }
    }, [isOpen, event]);

    const changePhoto = (direction: 'next' | 'prev') => {
        if (!event) return;
        const photos = [event.heroPhoto, ...event.gallery];
        const nextIndex = direction === 'next'
            ? (currentIndex + 1) % photos.length
            : (currentIndex - 1 + photos.length) % photos.length;

        // Quick fade transition
        gsap.to(".overlay-image", {
            x: direction === 'next' ? -50 : 50,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                setCurrentIndex(nextIndex);
                gsap.fromTo(".overlay-image",
                    { x: direction === 'next' ? 50 : -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.2 }
                );
            }
        });
    };

    const handleClose = () => {
        // Slide down animation
        gsap.to(sheetRef.current, {
            y: '100%',
            duration: 0.3,
            ease: "power2.in"
        });
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: onClose
        });
    };

    // Touch handlers for photo swipe gestures
    const handlePhotoTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }

    const handlePhotoTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX
        touchEndY.current = e.touches[0].clientY
    }

    const handlePhotoTouchEnd = () => {
        const swipeThreshold = 50
        const diffX = touchStartX.current - touchEndX.current
        const diffY = Math.abs(touchStartY.current - touchEndY.current)

        // Only trigger if horizontal swipe is dominant
        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
            if (diffX > 0) {
                // Swipe left - next photo
                changePhoto('next')
            } else {
                // Swipe right - previous photo
                changePhoto('prev')
            }
        }
    }

    // Touch handlers for sheet drag to dismiss
    const handleSheetTouchStart = (e: React.TouchEvent) => {
        dragStartY.current = e.touches[0].clientY
        isDragging.current = true
    }

    const handleSheetTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return
        const currentY = e.touches[0].clientY
        const diff = currentY - dragStartY.current

        // Only allow dragging down
        if (diff > 0 && sheetRef.current) {
            sheetRef.current.style.transform = `translateY(${diff}px)`
        }
    }

    const handleSheetTouchEnd = (e: React.TouchEvent) => {
        if (!isDragging.current) return
        isDragging.current = false

        const currentY = e.changedTouches[0].clientY
        const diff = currentY - dragStartY.current

        // If dragged down more than 100px, close the sheet
        if (diff > 100) {
            handleClose()
        } else {
            // Snap back to position
            if (sheetRef.current) {
                gsap.to(sheetRef.current, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                })
            }
        }
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") handleClose();
            if (e.key === "ArrowRight") changePhoto('next');
            if (e.key === "ArrowLeft") changePhoto('prev');
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentIndex, event]);

    if (!isOpen || !event) return null;

    const photos = [event.heroPhoto, ...event.gallery];

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[999999] bg-black/95 flex items-end md:items-center justify-center backdrop-blur-md opacity-0"
            onClick={handleClose}
        >
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 transition-colors text-white border border-white/10 group"
            >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Bottom Sheet - Mobile / Modal - Desktop */}
            <div
                ref={sheetRef}
                className="relative w-full md:w-[90vw] lg:w-[70vw] h-[85vh] md:h-auto md:max-h-[90vh] bg-card rounded-t-3xl md:rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleSheetTouchStart}
                onTouchMove={handleSheetTouchMove}
                onTouchEnd={handleSheetTouchEnd}
            >
                {/* Drag Handle - Mobile Only */}
                <div className="md:hidden sticky top-0 z-10 bg-card/95 backdrop-blur-sm py-3 flex justify-center">
                    <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
                </div>

                {/* Scrollable Container */}
                <div className="overflow-y-auto h-full custom-scrollbar">

                    {/* Event Header */}
                    <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border p-4 md:p-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{event.title}</h2>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-accent-primary" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-accent-primary" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery Section */}
                    <div
                        className="relative bg-black"
                        onTouchStart={handlePhotoTouchStart}
                        onTouchMove={handlePhotoTouchMove}
                        onTouchEnd={handlePhotoTouchEnd}
                    >
                        {/* Photo Counter */}
                        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-mono">
                            {currentIndex + 1} / {photos.length}
                        </div>

                        {/* Navigation Arrows */}
                        {photos.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); changePhoto('prev'); }}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:scale-110 transition-all z-20 bg-black/30 rounded-full"
                                >
                                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); changePhoto('next'); }}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white hover:scale-110 transition-all z-20 bg-black/30 rounded-full"
                                >
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                                </button>
                            </>
                        )}

                        {/* Pagination Dots */}
                        {photos.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                {photos.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                                ? 'w-8 bg-accent-primary'
                                                : 'w-2 bg-white/30'
                                            }`}
                                        aria-label={`Go to photo ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center bg-black">
                            <img
                                src={photos[currentIndex]}
                                alt={`${event.title} - Photo ${currentIndex + 1}`}
                                className="overlay-image w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="p-6 md:p-8 bg-card">
                        <h3 className="text-xl font-bold text-foreground mb-4">About this Event</h3>
                        <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                            {event.description}
                        </p>
                    </div>

                </div>
            </div>

        </div>
    )
}
