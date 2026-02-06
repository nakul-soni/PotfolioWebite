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
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
            aria-label="Toggle Theme"
        >
            <div className="relative">
                {theme === 'dark' ? (
                    <Moon className="w-5 h-5 md:w-6 md:h-6 text-accent-primary" />
                ) : (
                    <Sun className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                )}
            </div>
        </button>
    )
}
