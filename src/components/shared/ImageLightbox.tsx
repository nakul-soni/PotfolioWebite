"use client"

import { useEffect, useRef, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { gsap } from "gsap"

interface ImageLightboxProps {
    images: string[]
    initialIndex?: number
    isOpen: boolean
    onClose: () => void
    orientation?: "landscape" | "portrait"
}

export function ImageLightbox({
    images,
    initialIndex = 0,
    isOpen,
    onClose,
    orientation = "landscape"
}: ImageLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const overlayRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)

    // Touch gesture refs
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)
    const touchStartY = useRef(0)
    const touchEndY = useRef(0)

    // Reset index when initialIndex changes
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex)
            console.log('🖼️ Lightbox opened:', {
                isOpen,
                currentIndex: initialIndex,
                totalImages: images.length,
                currentImage: images[initialIndex]
            })
        }
    }, [initialIndex, isOpen, images])

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            // Save current scroll position
            const scrollY = window.scrollY

            // Lock scroll on body and html
            document.body.style.overflow = "hidden"
            document.documentElement.style.overflow = "hidden"

            // Fix position to prevent scroll on mobile
            document.body.style.position = "fixed"
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = "100%"

            // Animate in
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            )
        } else {
            // Get the scroll position before restoring
            const scrollY = document.body.style.top

            // Restore scroll
            document.body.style.overflow = ""
            document.documentElement.style.overflow = ""
            document.body.style.position = ""
            document.body.style.top = ""
            document.body.style.width = ""

            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }

        return () => {
            // Cleanup on unmount
            const scrollY = document.body.style.top
            document.body.style.overflow = ""
            document.documentElement.style.overflow = ""
            document.body.style.position = ""
            document.body.style.top = ""
            document.body.style.width = ""
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }
    }, [isOpen])

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose()
            } else if (e.key === "ArrowRight") {
                navigateImage("next")
            } else if (e.key === "ArrowLeft") {
                navigateImage("prev")
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, currentIndex])

    const handleClose = () => {
        gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: onClose
        })
    }

    const navigateImage = (direction: "next" | "prev") => {
        const nextIndex = direction === "next"
            ? (currentIndex + 1) % images.length
            : (currentIndex - 1 + images.length) % images.length

        // Animate transition
        gsap.to(imageRef.current, {
            x: direction === "next" ? -50 : 50,
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                setCurrentIndex(nextIndex)
                gsap.fromTo(imageRef.current,
                    { x: direction === "next" ? 50 : -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.2 }
                )
            }
        })
    }

    // Touch handlers for swipe gestures
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX
        touchEndY.current = e.touches[0].clientY
    }

    const handleTouchEnd = () => {
        const swipeThreshold = 50
        const diffX = touchStartX.current - touchEndX.current
        const diffY = Math.abs(touchStartY.current - touchEndY.current)

        // Only trigger if horizontal swipe is dominant
        if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
            if (diffX > 0) {
                // Swipe left - next image
                navigateImage("next")
            } else {
                // Swipe right - previous image
                navigateImage("prev")
            }
        }
    }

    if (!isOpen) return null

    const hasNext = currentIndex < images.length - 1
    const hasPrev = currentIndex > 0
    const canNavigate = images.length > 1

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleClose}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors p-2 z-50 bg-black/30 rounded-full backdrop-blur-sm"
                onClick={handleClose}
                aria-label="Close lightbox"
            >
                <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Image Counter */}
            {canNavigate && (
                <div className="absolute top-4 left-4 md:top-8 md:left-8 text-white/70 font-mono text-sm md:text-base bg-black/30 px-3 py-2 rounded-full backdrop-blur-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Previous Button */}
            {canNavigate && (
                <button
                    className={`hidden md:block absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all p-3 md:p-4 bg-black/30 rounded-full backdrop-blur-sm z-40 ${!hasPrev ? "opacity-0 pointer-events-none" : "hover:scale-110"
                        }`}
                    onClick={(e) => {
                        e.stopPropagation()
                        navigateImage("prev")
                    }}
                    disabled={!hasPrev}
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
            )}

            {/* Next Button */}
            {canNavigate && (
                <button
                    className={`hidden md:block absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all p-3 md:p-4 bg-black/30 rounded-full backdrop-blur-sm z-40 ${!hasNext ? "opacity-0 pointer-events-none" : "hover:scale-110"
                        }`}
                    onClick={(e) => {
                        e.stopPropagation()
                        navigateImage("next")
                    }}
                    disabled={!hasNext}
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
            )}

            {/* Image Container */}
            <div
                ref={imageRef}
                className={`relative shadow-2xl rounded-lg overflow-hidden border-2 border-white/20 mx-auto max-h-[80vh] md:max-h-none ${orientation === "portrait"
                    ? "max-w-sm md:max-w-md aspect-[9/16]"
                    : "max-w-5xl aspect-video"
                    } w-full bg-black/50`}
                onClick={(e) => e.stopPropagation()}
            >
                {images[currentIndex] && (
                    <Image
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1} of ${images.length}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 1200px"
                        className="object-contain"
                        priority
                        unoptimized
                    />
                )}

                {/* Mobile Swipe Hints */}
                {canNavigate && (
                    <>
                        {hasPrev && (
                            <div className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white/60 pointer-events-none">
                                <ChevronLeft className="w-5 h-5" />
                            </div>
                        )}
                        {hasNext && (
                            <div className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white/60 pointer-events-none">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
