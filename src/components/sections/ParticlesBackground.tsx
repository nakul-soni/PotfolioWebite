"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { theme } = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx =
            canvas.getContext("2d", { alpha: true, desynchronized: true }) ||
            canvas.getContext("2d")
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight
        let animationFrameId: number
        let lastTime = 0
        let isRunning = true

        // Star properties
        const stars: Star[] = []
        // Optimize star count: 400 for desktop, 100 for mobile
        const starCount = width < 768 ? 100 : 400
        const speed = 0.5

        let mouseX = 0
        let mouseY = 0

        class Star {
            x: number
            y: number
            z: number
            size: number
            color: string

            constructor() {
                this.x = (Math.random() - 0.5) * width * 2
                this.y = (Math.random() - 0.5) * height * 2
                this.z = Math.random() * width
                this.size = 1.5
                this.color = theme === 'contact' ? '0,0,0' : '255, 255, 255' // Simplification, updated in draw
            }

            update() {
                // Move towards viewer (decrease Z)
                this.z -= speed * 2

                // Reset if passed viewer
                if (this.z <= 0) {
                    this.z = width
                    this.x = (Math.random() - 0.5) * width * 2
                    this.y = (Math.random() - 0.5) * height * 2
                }
            }

            draw() {
                if (!ctx) return

                // Perspective projection
                // x2d = x * (focal_length / z)
                // We centre it by adding half width/height
                const x2d = (this.x / this.z) * (width / 2) + width / 2 + (mouseX - width / 2) * 0.02
                const y2d = (this.y / this.z) * (height / 2) + height / 2 + (mouseY - height / 2) * 0.02

                // Size scales with proximity
                const size = (1 - this.z / width) * 2.5
                // Opacity scales with proximity
                const alpha = (1 - this.z / width)

                // Color based on theme
                const color = theme === "dark"
                    ? `rgba(147, 197, 253, ${alpha})` // Blue-ish white for dark mode
                    : `rgba(30, 58, 138, ${alpha})`   // Dark Blue for light mode

                ctx.fillStyle = color
                ctx.beginPath()
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const init = () => {
            canvas.width = width
            canvas.height = height
            stars.length = 0
            for (let i = 0; i < starCount; i++) {
                stars.push(new Star())
            }
        }

        const animate = (time: number) => {
            if (!isRunning) return

            const delta = time - lastTime
            if (delta < 1000 / 60) {
                animationFrameId = requestAnimationFrame(animate)
                return
            }
            lastTime = time

            // Trail effect
            ctx.fillStyle = theme === "dark" ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'
            ctx.fillRect(0, 0, width, height)

            stars.forEach(star => {
                star.update()
                star.draw()
            })
            animationFrameId = requestAnimationFrame(animate)
        }

        init()
        animationFrameId = requestAnimationFrame(animate)

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            init()
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                isRunning = false
                cancelAnimationFrame(animationFrameId)
            } else {
                if (!isRunning) {
                    isRunning = true
                    lastTime = performance.now()
                    animationFrameId = requestAnimationFrame(animate)
                }
            }
        }

        window.addEventListener("resize", handleResize, { passive: true })
        window.addEventListener("mousemove", handleMouseMove, { passive: true })
        document.addEventListener("visibilitychange", handleVisibilityChange)

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("visibilitychange", handleVisibilityChange)
            cancelAnimationFrame(animationFrameId)
        }
    }, [theme])

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: 'transparent' }} />
}
