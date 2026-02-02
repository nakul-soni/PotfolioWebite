"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { gsap } from "gsap"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark"
        setTheme(newTheme)

        // GSAP Animation
        if (buttonRef.current) {
            gsap.to(buttonRef.current, {
                rotation: "+=180",
                duration: 0.4,
                ease: "power2.out"
            })
        }
    }

    if (!mounted) {
        return null // or a placeholder to avoid hydration mismatch
    }

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            className="fixed top-4 left-4 md:top-6 md:right-8 md:left-auto z-50 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-surface/80 backdrop-blur-md border border-border shadow-lg hover:shadow-glow transition-all duration-300"
            aria-label="Toggle Theme"
        >
            <div className="relative">
                {theme === 'dark' ? (
                    <Moon className="w-4 h-4 md:w-5 md:h-5 text-accent-primary" />
                ) : (
                    <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                )}
            </div>
        </button>
    )
}
