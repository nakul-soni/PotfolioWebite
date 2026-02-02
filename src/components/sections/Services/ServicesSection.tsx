"use client"

import { useRef, useState } from "react"
import { SERVICES_DATA } from "@/lib/services-data"
import { ServiceCard } from "./ServiceCard"
import { QuoteModal } from "./QuoteModal"
import { ScrollStack } from "./ScrollStack"

export function ServicesSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState("");

    const openQuote = (title: string) => {
        setSelectedService(title);
        setModalOpen(true);
    };

    return (
        <section ref={containerRef} id="services" className="relative w-full bg-transparent overflow-visible py-20 flex flex-col items-center justify-center">

            <div className="absolute top-10 w-full text-center z-10 px-4">
                <h2 className="text-[clamp(1.5rem,4vw,3rem)] font-black uppercase tracking-tighter mb-2">
                    Services
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Comprehensive technical solutions for scaling your business.
                </p>
            </div>

            <div className="w-full max-w-6xl px-4 md:px-8 pt-32 pb-8">
                <ScrollStack
                    offset={120}
                    items={SERVICES_DATA.map(service => ({
                        id: service.id,
                        children: (
                            <div className="w-full">
                                <ServiceCard service={service} onQuote={openQuote} />
                            </div>
                        )
                    }))}
                />
            </div>

            <QuoteModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                serviceTitle={selectedService}
            />

        </section>
    )
}
