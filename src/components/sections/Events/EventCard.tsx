"use client"
import { Event } from "@/lib/events-data"
import { Camera, MapPin } from "lucide-react"

interface EventCardProps {
    event: Event;
    onCardClick: () => void;
}

export function EventCard({ event, onCardClick }: EventCardProps) {
    return (
        <div
            className="event-card relative group bg-card w-full rounded-xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-500 hover:-translate-y-2 border border-border cursor-pointer"
            onClick={onCardClick}
        >

            {/* Date Header */}
            <div className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold text-lg drop-shadow-md">{event.title}</h3>
                    <p className="text-accent-primary text-xs font-mono">{event.date}</p>
                </div>
            </div>

            {/* Hero Photo (16:9) */}
            <div className="relative w-full aspect-video bg-muted overflow-hidden">
                {/* Using div placeholder for image interactions */}
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    style={{ backgroundImage: `url(${event.heroPhoto})` }}
                />

                {/* Hover Reveal: Photo Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Camera className="w-3 h-3 text-accent-primary" />
                    <span>{15 + (event.title.length % 7) * 3}+ photos</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 bg-card relative z-10">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                </div>
                <p className="text-sm text-foreground/80 line-clamp-2">
                    {event.description}
                </p>
            </div>

        </div>
    )
}
