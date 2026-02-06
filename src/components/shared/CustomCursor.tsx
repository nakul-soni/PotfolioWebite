"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const followerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cursor = cursorRef.current
        const follower = followerRef.current

        const updateCursor = () => {
            const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
            document.body.style.cursor = isMobile ? 'auto' : 'none'

            // Hide follower circle completely
            if (cursor && follower) {
                const display = isMobile ? 'none' : 'block'
                cursor.style.display = display
                follower.style.display = 'none' // Always hide the follower circle
            }
        }

        updateCursor()
        window.addEventListener('resize', updateCursor)

        if (!cursor) return

        const pos = { x: 0, y: 0 }
        const mouse = { x: 0, y: 0 }

        // GSAP Setters (more performant than to())
        const xSet = gsap.quickSetter(cursor, "x", "px")
        const ySet = gsap.quickSetter(cursor, "y", "px")

        // Update mouse position
        const onMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY

            // Immediate update for cursor
            xSet(mouse.x)
            ySet(mouse.y)
        }

        window.addEventListener("mousemove", onMouseMove)

        // Global Event Delegation for Hover Effects
        // Show pointer cursor on clickable elements
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if the target or its parent is clickable
            const clickable = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer');

            if (clickable) {
                // Show pointer cursor instead of custom cursor
                document.body.style.cursor = 'pointer'
                if (cursor) {
                    gsap.to(cursor, {
                        opacity: 0,
                        duration: 0.2
                    })
                }
            }
        }

        const onMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const clickable = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer');

            if (clickable) {
                // Restore custom cursor
                document.body.style.cursor = 'none'
                if (cursor) {
                    gsap.to(cursor, {
                        opacity: 1,
                        duration: 0.2
                    })
                }
            }
        }

        window.addEventListener('mouseover', onMouseOver)
        window.addEventListener('mouseout', onMouseOut)

        // Ensure cursor is hidden when leaving window
        document.body.addEventListener('mouseenter', () => {
            if (cursor) gsap.to(cursor, { opacity: 1 })
        })
        document.body.addEventListener('mouseleave', () => {
            if (cursor) gsap.to(cursor, { opacity: 0 })
        })

        return () => {
            window.removeEventListener('resize', updateCursor)
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener('mouseover', onMouseOver)
            window.removeEventListener('mouseout', onMouseOut)
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
