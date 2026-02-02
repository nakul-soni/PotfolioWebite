"use client"
import { Service } from "@/lib/services-data"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

interface ServiceCardProps {
    service: Service;
    onQuote: (title: string) => void;
}

export function ServiceCard({ service, onQuote }: ServiceCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    return (

        <div ref={cardRef} className="service-card group relative bg-background border border-border/40 rounded-xl md:rounded-2xl overflow-hidden hover:border-accent-primary/30 transition-all duration-500 flex flex-col h-full w-full will-change-transform">

            {/* Header: Icon + Title */}
            <div className="p-3 md:p-4 flex items-center gap-3 border-b border-border/50">
                <div className="p-1.5 md:p-2 bg-accent-primary/10 rounded-lg text-accent-primary group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <h3 className="text-base md:text-xl font-black uppercase tracking-tight line-clamp-1">{service.title}</h3>
            </div>

            {/* Hero Visual */}
            <div className="relative w-full h-24 md:h-32 bg-muted/20 overflow-hidden">
                <Image
                    src={service.heroImage}
                    alt={service.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
            </div>

            {/* Content */}
            <div className="p-3 md:p-4 flex-1 flex flex-col">
                <p className="text-[10px] md:text-xs text-muted-foreground mb-2 md:mb-3 line-clamp-2">
                    {service.description}
                </p>

                <ul className="space-y-1.5 md:space-y-2 mb-2 md:mb-4 flex-1">
                    {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-[10px] md:text-xs">
                            <span className="w-1 h-1 bg-accent-primary rounded-full mt-1.5 shrink-0" />
                            {benefit}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action Button */}
            <div className="p-3 pt-0 md:p-4 md:pt-0">
                <button
                    onClick={() => onQuote(service.title)}
                    className="w-full py-2 md:py-3 bg-accent-primary/10 hover:bg-accent-primary text-accent-primary hover:text-white font-bold text-xs md:text-sm rounded-lg md:rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                    Get Quote <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Progress Ring Overlay (Animated by Parent GSAP) */}
            <div className="absolute top-4 right-4 w-8 h-8 pointer-events-none">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" className="text-muted/20" strokeWidth="2" />
                    <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" className="service-progress text-accent-primary opacity-0" strokeWidth="2" strokeDasharray="88" strokeDashoffset="88" />
                </svg>
            </div>
        </div>
    )
}
