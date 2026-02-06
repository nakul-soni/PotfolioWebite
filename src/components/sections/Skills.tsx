"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
    SiHtml5, SiCss3, SiJavascript, SiGit, SiTypescript, SiMysql,
    SiNodedotjs, SiAngular, SiGreensock, SiVercel,
    SiNextdotjs, SiTailwindcss
} from "react-icons/si"
import { FaJava } from "react-icons/fa"

gsap.registerPlugin(ScrollTrigger)

export function Skills() {
    const containerRef = useRef<HTMLDivElement>(null)
    const pyramidRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })

    // Data - Each skill with its name
    const baseSkills = [
        { Icon: SiHtml5, name: "HTML5" },
        { Icon: SiCss3, name: "CSS3" },
        { Icon: SiJavascript, name: "JavaScript" },
        { Icon: SiGit, name: "Git" },
        { Icon: SiTypescript, name: "TypeScript" },
        { Icon: SiMysql, name: "MySQL" }
    ]

    const coreSkills = [
        { Icon: SiNodedotjs, name: "Node.js" },
        { Icon: SiAngular, name: "Angular" },
        { Icon: FaJava, name: "Java" },
        { Icon: SiVercel, name: "Vercel" }
    ]

    const frameworkSkills = [
        { Icon: SiNextdotjs, name: "Next.js" },
        { Icon: SiTailwindcss, name: "Tailwind CSS" }
    ]

    const crownSkill = { Icon: SiGreensock, name: "GSAP" }

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia()

            // Desktop: Scroll-triggered pyramid animation
            mm.add("(min-width: 768px)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=500%", // Increased pin duration further for hold + exit
                        scrub: 1,
                        pin: true,
                        pinSpacing: true,
                        anticipatePin: 1
                    }
                })

                // Initial cleanup - ensure everything is hidden/displaced before animation starts logic runs
                // (GSAP fromTo handles this, but explicit ordering helps)

                // 1. Base Layer: Cards rise from bottom
                tl.fromTo(".skill-level-base .skill-card",
                    { y: 300, opacity: 0, scale: 0 },
                    { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 1.5, ease: "power2.out" }
                )

                    // 2. Core Layer: Cards drop from top
                    .fromTo(".skill-level-core .skill-card",
                        { y: -400, opacity: 0, scale: 0.5 },
                        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 1.5, ease: "bounce.out" },
                        "-=0.8"
                    )

                    // 3. Framework Layer: Cards drop from top
                    .fromTo(".skill-level-framework .skill-card",
                        { y: -400, opacity: 0, scale: 0.5 },
                        { y: 0, opacity: 1, scale: 1, stagger: 0.2, duration: 1.5, ease: "bounce.out" },
                        "-=0.8"
                    )

                    // 4. Crown: Descends
                    .fromTo(".skill-level-crown .skill-card",
                        { y: -100, opacity: 0, scale: 0 },
                        { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.3)" },
                        "-=1.4"
                    )
                    // Hold Phase: Keep the pyramid visible for a while
                    .to({}, { duration: 2 })

                    // Exit Phase: Fade out/Fly away
                    .to(pyramidRef.current, {
                        opacity: 0,
                        scale: 1.2, // Slight zoom out/fly towards camera effect
                        filter: "blur(10px)", // Add blur for smooth exit
                        duration: 1.5
                    })
            })

            // Mobile: No animations - pyramid displays as-is

            // Post-assembly breathing animation - subtle pulse on the icon itself (Always active)
            gsap.to(".skill-level-crown .skill-card", {
                filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))",
                scale: 1.1,
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                delay: 1
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    // Mobile Touch Rotation Logic
    const handleTouchMove = (e: React.TouchEvent) => {
        if (window.innerWidth < 768) return // Disable tilt on mobile for performance

        const touch = e.touches[0]
        const rotY = (touch.clientX / window.innerWidth - 0.5) * 180
        const rotX = (touch.clientY / window.innerHeight - 0.5) * 45

        gsap.to(pyramidRef.current, {
            rotationY: rotY,
            rotationX: -rotX,
            duration: 0.5,
            overwrite: true
        })
    }

    // Mouse Move Tilt
    const handleMouseMove = (e: React.MouseEvent) => {
        const rotY = (e.clientX / window.innerWidth - 0.5) * 30
        const rotX = (e.clientY / window.innerHeight - 0.5) * 30

        gsap.to(pyramidRef.current, {
            rotationY: rotY,
            rotationX: -rotX,
            duration: 1,
            overwrite: true
        })
    }

    const IconCard = ({ Icon, name, level }: { Icon: any, name: string, level: string }) => (
        <div className={`skill-card relative group w-16 h-16 md:w-24 md:h-24 flex items-center justify-center transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] cursor-pointer preserve-3d`}>
            <Icon className="w-10 h-10 md:w-16 md:h-16 text-foreground group-hover:text-accent-primary transition-colors filter drop-shadow-md" />

            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
                {name}
            </div>

            {/* No box background/reflection anymore, just the icon */}
        </div>
    )

    return (
        <section id="skills" ref={containerRef} className="relative h-screen w-full bg-transparent overflow-hidden flex flex-col items-center justify-center perspective-2000">

            {/* Section Heading */}
            <div className="absolute top-10 left-10 md:left-20 z-10 p-4">
                <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                    Skills
                </h2>
                <div className="h-1 w-20 bg-accent-primary mt-2 rounded-full" />
            </div>

            {/* 3D Pyramid Container */}
            <div
                ref={pyramidRef}
                className="relative transform-style-3d transition-transform ease-out-expo will-change-transform"
                onTouchMove={handleTouchMove}
                onMouseMove={handleMouseMove}
            >

                {/* Level 1: Crown */}
                <div className="skill-level-crown flex justify-center mb-8 transform-style-3d translate-z-20">
                    <IconCard Icon={crownSkill.Icon} name={crownSkill.name} level="Crown" />
                </div>

                {/* Level 2: Frameworks */}
                <div className="skill-level-framework flex justify-center gap-6 mb-8 transform-style-3d translate-z-10">
                    {frameworkSkills.map((skill, i) => <IconCard key={i} Icon={skill.Icon} name={skill.name} level="Framework" />)}
                </div>

                {/* Level 3: Core */}
                <div className="skill-level-core flex justify-center gap-6 mb-8 transform-style-3d">
                    {coreSkills.map((skill, i) => <IconCard key={i} Icon={skill.Icon} name={skill.name} level="Core" />)}
                </div>

                {/* Level 4: Base */}
                <div className="skill-level-base flex justify-center gap-4 flex-wrap max-w-2xl transform-style-3d translate-z-n10">
                    {baseSkills.map((skill, i) => <IconCard key={i} Icon={skill.Icon} name={skill.name} level="Base" />)}
                </div>

                {/* Floor Glow */}
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-primary/20 blur-[100px] rounded-full -rotate-x-90 -z-50" />

            </div>

        </section>
    )
}
