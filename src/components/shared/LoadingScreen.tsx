"use client"

import { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"

export function LoadingScreen() {
    const [percent, setPercent] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLHeadingElement>(null)
    const barRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Simulate loading
        const interval = setInterval(() => {
            setPercent(p => {
                if (p >= 100) {
                    clearInterval(interval)
                    return 100
                }
                // Random increment for realistic feel
                return p + Math.floor(Math.random() * 5) + 1
            })
        }, 50)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (percent >= 100) {
            // Exit Animation
            const tl = gsap.timeline()

            tl.to(barRef.current, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.5,
                ease: "power2.inOut"
            })
                .to(textRef.current, {
                    y: -50,
                    opacity: 0,
                    duration: 0.5
                }, "-=0.2")
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "expo.inOut",
                    onComplete: () => {
                        // Allow scroll
                        document.body.style.overflow = 'auto'
                        if (containerRef.current) containerRef.current.style.display = 'none'
                    }
                })
        }
    }, [percent])

    useEffect(() => {
        // Lock scroll initially
        if (percent < 100) {
            document.body.style.overflow = 'hidden'
        }
    }, [percent])

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background text-foreground"
        >
            <div className="relative overflow-hidden">
                <h1 ref={textRef} className="text-6xl md:text-9xl font-black tracking-tighter mix-blend-difference text-transparent bg-clip-text bg-foreground stroke-foreground" style={{ WebkitTextStroke: "1px var(--text-primary)" }}>
                    NAKUL SONI
                </h1>
                {/* Fill effect overlay */}
                <div
                    className="absolute top-0 left-0 h-full bg-accent-primary mix-blend-screen transition-all duration-75 ease-linear"
                    style={{ width: `${percent}%`, opacity: 0.5 }}
                />
            </div>

            <div className="mt-8 w-64 h-1 bg-secondary overflow-hidden rounded-full">
                <div
                    ref={barRef}
                    className="h-full bg-accent-primary transition-all duration-75 ease-linear"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="mt-2 font-mono text-sm text-muted-foreground">
                {Math.min(percent, 100)}%
            </div>
        </div>
    )
}
