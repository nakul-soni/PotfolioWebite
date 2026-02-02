"use client"
import { useEffect, useState } from "react"
import { X, Send } from "lucide-react"
import { gsap } from "gsap"

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceTitle: string;
}

export function QuoteModal({ isOpen, onClose, serviceTitle }: QuoteModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            gsap.fromTo(".modal-content",
                { scale: 0.8, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
            );
            gsap.to(".modal-overlay", { opacity: 1, duration: 0.3 });
        }
    }, [isOpen]);

    const handleClose = () => {
        gsap.to(".modal-content", { scale: 0.8, opacity: 0, y: 50, duration: 0.3, ease: "power2.in" });
        gsap.to(".modal-overlay", { opacity: 0, duration: 0.3, onComplete: onClose });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="modal-overlay absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0"
                onClick={handleClose}
            />

            {/* Modal Content */}
            <div className="modal-content relative bg-card w-full max-w-lg rounded-2xl border border-border/50 shadow-2xl p-6 md:p-8">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">Get a Quote</h3>
                    <p className="text-muted-foreground text-sm">
                        Inquiring about: <span className="text-accent-primary font-medium">{serviceTitle}</span>
                    </p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Mock form submitted!"); handleClose(); }}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Name</label>
                        <input type="text" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-accent-primary transition-colors" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email</label>
                        <input type="email" className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-accent-primary transition-colors" placeholder="john@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Project Details</label>
                        <textarea className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:border-accent-primary transition-colors min-h-[100px]" placeholder="Tell me about your project..." required />
                    </div>

                    <button type="submit" className="w-full bg-accent-primary text-white font-bold py-3 rounded-lg hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 group">
                        Send Inquiry <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    )
}
