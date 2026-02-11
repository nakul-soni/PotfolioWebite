"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BadgeCheck, Github, X } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export function Certifications() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    const items = [
        {
            title: "Deloitte Cybersecurity Job Simulation",
            issuer: "Deloitte",
            type: "cert",
            image: "/projects/Certificates/DeloitteCyber.png"
        },
        {
            title: "Android Application Development using Java and Kotlin",
            issuer: "Udemy",
            type: "cert",
            image: "/projects/Certificates/UdemyCert.png"
        }
    ]

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial state
            gsap.set(".cert-item", {
                opacity: 0,
                y: 50
            });

            // Animate on scroll
            gsap.to(".cert-item", {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none"
                }
            });
        }, containerRef);
        return () => ctx.revert();
    }, [])

    return (
        <>
            <section id="achievements" ref={containerRef} className="py-20 w-full overflow-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12 text-center">Achievements</h2>

                    <div className="
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 
                        px-4 md:px-0
                    ">
                        {items.map((item, i) => (
                            <div key={i} className="
                                cert-item group relative overflow-hidden
                                bg-background/50 backdrop-blur-sm border border-border/30 rounded-xl
                                hover:border-accent-primary/40 hover:bg-background/70 transition-all duration-500
                                flex flex-col
                            ">

                                {/* Certificate Thumbnail */}
                                <div
                                    className="relative w-full aspect-[16/9] bg-muted/20 overflow-hidden cursor-pointer"
                                    onClick={() => setSelectedImage(item.image)}
                                >
                                    {/* Certificate image */}
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
                                            View Certificate
                                        </span>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="p-4 flex gap-3 items-start">
                                    <div className="p-2 bg-accent-primary/10 rounded-lg shrink-0 text-accent-primary">
                                        {item.type === 'stats' ? <Github className="w-4 h-4" /> : <BadgeCheck className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm leading-tight mb-1 truncate group-hover:text-accent-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <div className="text-xs text-muted-foreground">{item.issuer}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    <div className="relative max-w-5xl w-full aspect-[4/3] max-h-[85vh] bg-gradient-to-br from-gray-800 to-black rounded-lg overflow-hidden">
                        {/* Certificate Image */}
                        <img
                            src={selectedImage}
                            alt="Certificate"
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    )
}
