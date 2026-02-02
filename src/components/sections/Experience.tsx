"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { EXPERIENCE } from "@/lib/constants"

export function Experience() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Desktop Vertical Line Draw
            gsap.fromTo(".timeline-line",
                { height: "0%" },
                {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".timeline-container",
                        start: "top 60%",
                        end: "bottom 80%",
                        scrub: 1
                    }
                }
            )

            // Items Stagger
            const items = gsap.utils.toArray(".timeline-item")
            items.forEach((item: any) => {
                gsap.from(item, {
                    opacity: 0,
                    x: -50,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: item,
                        start: "top 80%",
                        toggleActions: "play none reverse none" // Reversible
                    }
                })
            })

        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="experience" ref={containerRef} className="py-24 bg-transparent w-full overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-16 text-center">Journey</h2>

                {/* Vertical Timeline (Responsive for Mobile & Desktop) */}
                <div className="flex flex-col timeline-container relative max-w-4xl mx-auto pl-6 md:pl-10 border-l-2 border-primary/10">

                    {/* Animated Scalable Line with Glow */}
                    <div className="timeline-line absolute left-0 top-0 w-[2px] bg-gradient-to-b from-accent-primary/20 via-accent-primary to-accent-primary shadow-[0_0_15px_rgba(59,130,246,0.6)] -translate-x-[2px] z-10">
                        {/* Glowing Tip/Tracer */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-accent-primary rounded-full blur-[8px]" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                    </div>

                    {EXPERIENCE.map((exp, i) => (
                        <div key={i} className="timeline-item mb-12 md:mb-16 relative pl-6 md:pl-10">
                            {/* Dot Indicator */}
                            <div className="absolute left-[-5px] top-2 w-4 h-4 rounded-full bg-accent-primary border-4 border-background shadow-glow" />

                            <div className="bg-card border border-border p-5 md:p-6 rounded-xl hover:border-accent-primary transition-colors hover:shadow-lg">
                                <span className="text-accent-primary font-mono text-xs md:text-sm">{exp.year}</span>
                                <h3 className="text-lg md:text-xl font-bold mt-1 leading-tight">{exp.role}</h3>
                                <div className="text-sm text-muted-foreground mb-3 md:mb-4">{exp.company}</div>
                                <p className="text-sm leading-relaxed opacity-80 line-clamp-4 md:line-clamp-none">
                                    {exp.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
