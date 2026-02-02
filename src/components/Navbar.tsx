"use client"

import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export function Navbar() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSectionsOpen, setIsSectionsOpen] = useState(false)

    const mainNavItems = [
        { label: "Home", href: "#hero" },
        { label: "About", href: "#about" }
    ]

    const sectionItems = [
        { label: "Services", href: "#services" },
        { label: "Skills", href: "#skills" },
        { label: "Projects", href: "#projects" },
        { label: "Experience", href: "#experience" },
        { label: "Events", href: "#events" },
        { label: "Achievements", href: "#achievements" }
    ]

    const contactItem = { label: "Contact", href: "#contact" }



    const scrollToSection = (href: string) => {
        const element = document.querySelector(href)
        if (element) {
            const navHeight = 80 // Height of navbar
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
            const offsetPosition = elementPosition - navHeight

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            })
            setIsMobileMenuOpen(false)
            setIsSectionsOpen(false)
        }
    }

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-transparent"
        >
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => { e.preventDefault(); scrollToSection("#hero"); }}
                        className="text-xl md:text-2xl font-black uppercase tracking-tighter bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer"
                    >
                        Nakul Soni
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {mainNavItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-primary/10 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Sections Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsSectionsOpen(!isSectionsOpen)}
                                onMouseEnter={() => setIsSectionsOpen(true)}
                                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-primary/10 rounded-lg transition-all duration-200 flex items-center gap-1"
                            >
                                Sections
                                <ChevronDown className={`w-4 h-4 transition-transform ${isSectionsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSectionsOpen && (
                                <div
                                    className="absolute top-full left-0 mt-2 w-48 bg-background/95 backdrop-blur-lg border border-border/50 rounded-lg shadow-xl overflow-hidden"
                                    onMouseLeave={() => setIsSectionsOpen(false)}
                                >
                                    {sectionItems.map((item) => (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                                            className="block px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-primary/10 transition-all duration-200 cursor-pointer"
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        <a
                            href={contactItem.href}
                            onClick={(e) => { e.preventDefault(); scrollToSection(contactItem.href); }}
                            className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-primary/10 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                            {contactItem.label}
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-foreground hover:bg-accent-primary/10 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border/50">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {mainNavItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                                className="block px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-primary/10 rounded-lg transition-all duration-200"
                            >
                                {item.label}
                            </a>
                        ))}

                        {/* Mobile Sections */}
                        <div className="border-t border-border/30 pt-2 mt-2">
                            <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Sections
                            </div>
                            {sectionItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                                    className="block px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-primary/10 rounded-lg transition-all duration-200"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        <a
                            href={contactItem.href}
                            onClick={(e) => { e.preventDefault(); scrollToSection(contactItem.href); }}
                            className="block px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent-primary/10 rounded-lg transition-all duration-200"
                        >
                            {contactItem.label}
                        </a>
                    </div>
                </div>
            )}
        </nav>
    )
}
