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

    useEffect(() => {
        if (isOpen && event) {
            setCurrentIndex(0);
            // Animation In
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            gsap.fromTo(".overlay-content",
                { scale: 0.95, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.2)", delay: 0.1 }
            );
            // Lock body scroll
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
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
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
    };

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
            className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center backdrop-blur-md opacity-0"
            onClick={handleClose}
        >
            {/* Close Button */}
            <button onClick={handleClose} className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors p-2 z-50">
                <X className="w-8 h-8" />
            </button>

            {/* Main Content Container - Like a Post */}
            <div
                className="overlay-content relative w-[95vw] md:w-[90vw] lg:w-[70vw] max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Scrollable Container */}
                <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">

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
                    <div className="relative bg-black">
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

                        {/* Main Image */}
                        <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-black">
                            <img
                                src={photos[currentIndex]}
                                alt={`${event.title} - Photo ${currentIndex + 1}`}
                                className="overlay-image w-full h-full max-h-[70vh] object-contain"
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
