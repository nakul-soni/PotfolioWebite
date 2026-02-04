"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const followerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Hide default cursor
        // Check if device is mobile or touch
        const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768

        if (isMobile) return

        // Hide default cursor
        document.body.style.cursor = 'none'

        const cursor = cursorRef.current
        const follower = followerRef.current

        if (!cursor || !follower) return

        const pos = { x: 0, y: 0 }
        const mouse = { x: 0, y: 0 }
        const vel = { x: 0, y: 0 }

        // GSAP Setters (more performant than to())
        const xSet = gsap.quickSetter(cursor, "x", "px")
        const ySet = gsap.quickSetter(cursor, "y", "px")
        const xSetFollower = gsap.quickSetter(follower, "x", "px")
        const ySetFollower = gsap.quickSetter(follower, "y", "px")

        // Update mouse position
        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY

            // Immediate update for dot
            xSet(mouse.x)
            ySet(mouse.y)
        }

        // Animation Loop for Smooth Follower
        const loop = () => {
            // Linear interpolation for follower
            const dt = 0.15 // dampening factor
            pos.x += (mouse.x - pos.x) * dt
            pos.y += (mouse.y - pos.y) * dt

            // Calculate velocity for stretching effect
            vel.x = mouse.x - pos.x
            vel.y = mouse.y - pos.y

            // Apply position
            xSetFollower(pos.x)
            ySetFollower(pos.y)

            // Velocity based scaling (stretch in direction of movement)
            // This is a simplified "trail" effect using scale
            const velocity = Math.sqrt(vel.x * vel.x + vel.y * vel.y)
            const scale = Math.min(velocity * 0.005 + 1, 1.5) // Cap scale at 1.5
            const angle = Math.atan2(vel.y, vel.x) * 180 / Math.PI

            gsap.set(follower, {
                rotation: angle,
                scaleX: scale,
                scaleY: 1 / scale // Maintain area
            })

            requestAnimationFrame(loop)
        }

        window.addEventListener("mousemove", onMouseMove)
        const rafInfo = requestAnimationFrame(loop)

        // Global Event Delegation for Hover Effects
        // This ensures dynamic elements (like GSAP-animated content) work correctly
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if the target or its parent is clickable
            const clickable = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer');

            if (clickable) {
                gsap.to(follower, {
                    scale: 2,
                    backgroundColor: "var(--accent-primary)",
                    opacity: 0.5,
                    duration: 0.3,
                    display: "block" // Ensure it's visible
                })
            }
        }

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickable = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer');

            if (clickable) {
                gsap.to(follower, {
                    scale: 1,
                    backgroundColor: "transparent",
                    opacity: 1,
                    duration: 0.3
                })
            }
        }

        window.addEventListener('mouseover', onMouseOver)
        window.addEventListener('mouseout', onMouseOut)
        // Ensure cursor is hidden when leaving window
        document.body.addEventListener('mouseenter', () => gsap.to([cursor, follower], { opacity: 1 }))
        document.body.addEventListener('mouseleave', () => gsap.to([cursor, follower], { opacity: 0 }))

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener('mouseover', onMouseOver)
            window.removeEventListener('mouseout', onMouseOut)
            cancelAnimationFrame(rafInfo)
            document.body.style.cursor = 'auto'
        }
    }, [])

    return (
        <>
            <div
                ref={cursorRef}
                className="hidden md:block fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1.5 -translate-y-0.5 drop-shadow-md will-change-transform"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-accent-primary"
                >
                    <path
                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <div
                ref={followerRef}
                className="hidden md:block fixed top-0 left-0 w-8 h-8 border border-accent-primary/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out"
            />
        </>
    )
}
