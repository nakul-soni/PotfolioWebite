"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PROJECTS } from "@/lib/constants"
import { ArrowRight, Github, ExternalLink } from "lucide-react"
import Image from "next/image"
import { ImageLightbox } from "@/components/shared/ImageLightbox"

export function Projects() {
    const containerRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxImages, setLightboxImages] = useState<string[]>([])
    const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0)
    const [lightboxOrientation, setLightboxOrientation] = useState<"landscape" | "portrait">("landscape")
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)

    // Main Carousel Touch Refs
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia()

            // Desktop: Horizontal scroll animation
            mm.add("(min-width: 768px)", () => {
                const sections = gsap.utils.toArray(".project-card")

                gsap.to(sections, {
                    xPercent: -100 * (sections.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        pin: true,
                        pinSpacing: true,
                        anticipatePin: 1,
                        scrub: 0.5,
                        snap: 1 / (sections.length - 1),
                        // base vertical scrolling on how many cards * width
                        end: () => "+=" + (containerRef.current?.offsetWidth || 0) * (sections.length - 1)
                    }
                })
            })

            // Mobile: Simple fade-in animation
            mm.add("(max-width: 767px)", () => {
                setIsMobile(true)
                gsap.from(".project-card", {
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                })
            })

            mm.add("(min-width: 768px)", () => {
                setIsMobile(false)
            });

        }, containerRef)

        return () => ctx.revert()
    }, [])

    // Touch swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
        const swipeThreshold = 50
        const diff = touchStartX.current - touchEndX.current

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentIndex < PROJECTS.length - 1) {
                // Swipe left - next project
                setCurrentIndex(prev => prev + 1)
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous project
                setCurrentIndex(prev => prev - 1)
            }
        }
    }

    return (
        <section
            id="projects"
            ref={containerRef}
            className="h-screen w-full bg-transparent overflow-hidden relative flex flex-row md:block"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 w-full pr-8">
                <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground opacity-50">
                    SELECTED WORKS
                </h2>
            </div>

            <div
                ref={wrapperRef}
                className="h-full w-full flex md:flex md:h-full md:w-[300%] transition-transform duration-500 ease-out will-change-transform"
                style={{
                    transform: isMobile ? `translateX(-${currentIndex * 100}%)` : 'none'
                }}
            >
                {PROJECTS.map((project, i) => (
                    <div
                        key={i}
                        className={`project-card w-full md:w-screen h-full flex-shrink-0 flex items-center justify-center p-4 pt-20 md:p-20 border-r border-border/50 bg-background/50 backdrop-blur-sm transition-opacity duration-500 md:opacity-100 md:relative ${
                            // On mobile, all cards are "visible" in the flow, but only one is in view due to overflow hidden + translate
                            // On desktop, we keep the original logic if needed, but the wrapper is what matters for mobile
                            'opacity-100 relative'
                            }`}
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-7xl w-full items-center">

                            {/* Image Card */}
                            <div className="relative group perspective-1000">
                                <div className="w-full aspect-video bg-transparent rounded-2xl overflow-visible transition-transform duration-500 border-none">
                                    {/* Collage Images */}
                                    <div className="relative w-full h-full perspective-1000 flex items-center justify-center">
                                        {project.images.map((img, idx) => {
                                            const isPortrait = (project as any).orientation === "portrait"

                                            // 3D Showcase Logic
                                            let positionClass = ""
                                            if (idx === 0) {
                                                // Left Card
                                                positionClass = `${isPortrait ? "left-[20%]" : "left-0"} z-20 scale-90 origin-left rotate-y-12 hover:rotate-0 hover:scale-100 hover:z-50`
                                            } else if (idx === 1) {
                                                // Center Card
                                                positionClass = "left-1/2 -translate-x-1/2 z-30 scale-100 hover:scale-110 hover:z-50"
                                            } else if (idx === 2) {
                                                // Right Card
                                                positionClass = `${isPortrait ? "right-[20%]" : "right-0"} z-20 scale-90 origin-right -rotate-y-12 hover:rotate-0 hover:scale-100 hover:z-50`
                                            } else if (idx === 3) {
                                                // Between Left and Center
                                                positionClass = `${isPortrait ? "left-0" : "left-[25%]"} z-[15] scale-[0.88] origin-left rotate-y-8 hover:rotate-0 hover:scale-100 hover:z-50`
                                            } else if (idx === 4) {
                                                // Between Center and Right
                                                positionClass = `${isPortrait ? "right-0" : "right-[25%]"} z-[15] scale-[0.88] origin-right -rotate-y-8 hover:rotate-0 hover:scale-100 hover:z-50`
                                            } else {
                                                // Extra cards hidden
                                                return null
                                            }

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setLightboxImages(project.images)
                                                        setLightboxInitialIndex(idx)
                                                        setLightboxOrientation(isPortrait ? "portrait" : "landscape")
                                                        setLightboxOpen(true)
                                                    }}
                                                    className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out cursor-zoom-in rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-black/50 ${positionClass} ${isPortrait ? "w-[25%] aspect-[9/16]" : "w-[80%] aspect-video"}`}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${project.title} - view ${idx + 1}`}
                                                        fill
                                                        sizes="(max-width: 768px) 25vw, 80vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                {/* Background Glow */}
                                <div className="absolute -inset-10 bg-accent-primary/20 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>

                            {/* Content */}
                            <div className="space-y-4 md:space-y-6">
                                <div className="text-accent-primary font-mono text-base md:text-xl">0{i + 1}</div>
                                <h3 className="text-3xl md:text-6xl font-bold leading-tight">{project.title}</h3>
                                <p className="text-muted-foreground text-sm md:text-lg leading-relaxed max-w-xl line-clamp-3 md:line-clamp-none">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {project.tech.map((t, idx) => (
                                        <span key={idx} className="px-3 py-1 md:px-4 md:py-2 rounded-full border border-border text-xs md:text-sm font-medium hover:bg-accent-primary/10 hover:border-accent-primary transition-colors">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 pt-2 md:pt-4">
                                    <a href={project.link} className="flex items-center gap-2 text-foreground font-bold hover:text-accent-primary transition-colors group text-sm md:text-base">
                                        View Project <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                    <a href="#" className="p-2 md:p-3 rounded-full border border-border hover:bg-foreground hover:text-background transition-colors">
                                        <Github className="w-4 h-4 md:w-5 md:h-5" />
                                    </a>
                                </div>
                            </div>

                        </div>

                    </div>
                ))}
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
                {currentIndex < PROJECTS.length - 1 && (
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

            {/* Image Lightbox */}
            <ImageLightbox
                images={lightboxImages}
                initialIndex={lightboxInitialIndex}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                orientation={lightboxOrientation}
            />

        </section>
    )
}
