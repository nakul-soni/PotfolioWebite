"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowDown } from "lucide-react"

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        const ctx = gsap.context(() => {
            const tl = gsap.timeline()

            // Entrance Animations (Always active)
            tl.from(".hero-text-line", {
                y: 100,
                opacity: 0,
                duration: 1.5,
                stagger: 0.2,
                ease: "power4.out",
                delay: 0.5
            })
                .from(".hero-sub", {
                    y: 20,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "-=1.0")
                .from(".scroll-indicator", {
                    y: -10,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.5")

            // Continuous Bounce Animation for Scroll Indicator (Always active)
            gsap.to(".scroll-indicator", {
                y: 10,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            })

            // Rotating Role Text Animation
            const roleLines = gsap.utils.toArray<HTMLElement>(".hero-rotating-text span")
            if (roleLines.length > 0) {
                gsap.set(roleLines, { opacity: 0, y: 12, filter: "blur(6px)" })

                const roleTl = gsap.timeline({ repeat: -1 })
                roleLines.forEach((line) => {
                    roleTl
                        .to(line, {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            duration: 0.7,
                            ease: "power3.out"
                        })
                        .to(line, { duration: 1.6 })
                        .to(line, {
                            opacity: 0,
                            y: -12,
                            filter: "blur(6px)",
                            duration: 0.6,
                            ease: "power3.in"
                        }, "+=0.1")
                })
            }

        }, containerRef)

        // Parallax Scroll Effect - Desktop only
        const mm = gsap.matchMedia()
        mm.add("(min-width: 768px)", () => {
            gsap.to(contentRef.current, {
                yPercent: 50,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            })
        })

        return () => {
            ctx.revert()
            mm.revert()
        }
    }, [])

    const handleScrollClick = () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <section id="hero" ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-transparent perspective-1000">

            <div ref={contentRef} className="container mx-auto px-4 z-10 flex flex-col items-center justify-center text-center">
                <div className="overflow-hidden mb-4">
                    <h1 className="hero-text-line text-[clamp(3rem,8vw,7rem)] font-black leading-none tracking-tighter text-foreground">
                        NAKUL SONI
                    </h1>
                </div>

                <div className="overflow-hidden mb-8">
                    <p className="hero-text-line text-xl md:text-3xl text-muted-foreground font-medium tracking-wide">
                        <span className="hero-rotating-text relative inline-block h-[1.2em] min-w-[26ch] whitespace-nowrap text-center">
                            <span className="absolute inset-0">FULL STACK DEVELOPER</span>
                            <span className="absolute inset-0">APPLICATION DEVELOPER</span>
                            <span className="absolute inset-0">WEB SECURITY TESTER</span>
                            <span className="absolute inset-0">CYBER SECURITY ENGINEER</span>
                        </span>
                    </p>
                </div>

                <div className="hero-sub">
                    <p className="max-w-md mx-auto text-sm md:text-base text-muted-foreground/80">
                        Building digital experiences with modern technologies and creative design.
                    </p>
                </div>
            </div>

            <div
                onClick={handleScrollClick}
                className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hover:text-foreground transition-colors z-20 will-change-transform"
            >
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
                <ArrowDown className="w-4 h-4 text-accent-primary" />
            </div>
        </section>
    )
}
