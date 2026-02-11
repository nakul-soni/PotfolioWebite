"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PERSONAL_INFO } from "@/lib/constants"
import Image from "next/image"

export function About() {
    const containerRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)
    const photoRef = useRef<HTMLDivElement>(null)
    const isTypewriterStarted = useRef(false)
    const [displayText, setDisplayText] = useState("")

    const fullText = "I'M NAKUL SONI"
    const bioLines = PERSONAL_INFO.bio
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia()

            // Photo Parallax - Desktop only (UNCHANGED)
            mm.add("(min-width: 768px)", () => {
                gsap.to(".about-photo", {
                    y: -50,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top center",
                        end: "bottom top",
                        scrub: 1
                    }
                })
            })

            // Photo entrance - Mobile only (NEW)
            mm.add("(max-width: 767px)", () => {
                gsap.from(photoRef.current, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                })
            })

            // Stats Reveal & Counter (Always active)
            const stats = statsRef.current?.children
            if (stats) {
                gsap.from(stats, {
                    x: 100,
                    opacity: 0,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 80%",
                        toggleActions: "play none reverse none"
                    }
                })
            }

            // Typewriter Trigger (Always active)
            const textProgress = { value: 0 }
            gsap.to(textProgress, {
                value: fullText.length,
                duration: 1.5,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                },
                onUpdate: () => {
                    setDisplayText(fullText.substring(0, Math.ceil(textProgress.value)))
                }
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section id="about" ref={containerRef} className="py-24 w-full bg-transparent text-foreground overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-[25%_35%_30%] justify-center gap-6 items-center min-h-[60vh]">

                    {/* Left Column: Photo */}
                    <div ref={photoRef} className="relative group about-photo flex justify-center md:justify-start">
                        <div className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden border-2 border-border shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-accent-primary/50">
                            <Image
                                src="/projects/MyPhoto/Myphoto.jpeg"
                                alt="User Photo"
                                fill
                                sizes="(max-width: 768px) 320px, 320px"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-accent-primary/20 blur-2xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Center Column: Bio */}
                    <div className="text-center md:text-left flex flex-col justify-center h-full border-l border-r border-border/0 md:border-border/50 px-0 md:px-8">
                        <h2 className="text-sm font-mono text-accent-primary mb-4 tracking-widest">ABOUT ME</h2>
                        <div className="text-3xl md:text-4xl font-black mb-4 h-12">
                            {displayText}
                            <span className="animate-pulse">|</span>
                        </div>
                        <div className="text-muted-foreground max-w-prose mx-auto md:mx-0 border-l-2 border-accent-primary/30 pl-4 text-sm md:text-base leading-6 md:leading-relaxed space-y-3 text-balance text-left md:text-left">
                            {bioLines.map((line, idx) => (
                                <p key={idx}>
                                    {line}
                                </p>
                            ))}
                        </div>
                        <svg className="w-24 h-2 mt-4 mx-auto md:mx-0 text-accent-secondary" viewBox="0 0 100 2">
                            <line x1="0" y1="1" x2="100" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="100" strokeDashoffset="0" className="animate-draw" />
                        </svg>
                    </div>

                    {/* Right Column: Stats */}
                    <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                        {PERSONAL_INFO.stats.map((stat, idx) => (
                            <div key={idx} className="bg-card p-3 md:p-5 rounded-xl border border-border hover:border-accent-primary/50 transition-colors group min-w-0 flex flex-col justify-center">
                                <div className="text-xl md:text-2xl font-bold group-hover:text-accent-primary transition-colors whitespace-nowrap">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
