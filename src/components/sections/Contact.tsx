"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Send, MapPin, Mail, Linkedin, Github } from "lucide-react"

export function Contact() {
    const containerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const ctx = gsap.context(() => {
            const inputs = gsap.utils.toArray(".form-input")

            gsap.from(inputs, {
                y: 50,
                opacity: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: formRef.current,
                    start: "top 80%",
                    toggleActions: "play none reverse none"
                }
            })

        }, containerRef)
        return () => ctx.revert()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus("submitting")
        setErrorMessage("")

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            message: formData.get("message") as string,
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to send message")
            }

            setStatus("success")
            if (formRef.current) formRef.current.reset()

            // Reset success message after 5 seconds
            setTimeout(() => {
                setStatus("idle")
            }, 5000)
        } catch (error) {
            setStatus("error")
            setErrorMessage(error instanceof Error ? error.message : "Failed to send message. Please try again.")

            // Reset error message after 5 seconds
            setTimeout(() => {
                setStatus("idle")
                setErrorMessage("")
            }, 5000)
        }
    }

    return (
        <section id="contact" ref={containerRef} className="py-24 w-full bg-transparent min-h-screen flex items-center justify-center relative">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left: Info & Map */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-5xl font-black mb-6">Let&apos;s Build<br /><span className="text-accent-primary">Something Epic.</span></h2>
                        <p className="text-muted-foreground text-lg">
                            Open for freelance opportunities and innovative projects.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-xl">
                            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border">
                                <Mail className="w-5 h-5 text-accent-primary" />
                            </div>
                            <span>nakul@example.com</span>
                        </div>
                        <div className="flex items-center gap-4 text-xl">
                            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border">
                                <MapPin className="w-5 h-5 text-accent-primary" />
                            </div>
                            <span>Ahmedabad, India</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border hover:bg-accent-primary hover:text-white transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-12 h-12 rounded-full bg-surface flex items-center justify-center border border-border hover:bg-foreground hover:text-background transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="bg-surface p-8 md:p-12 rounded-3xl border border-border shadow-2xl relative overflow-hidden">
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="form-input space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Name</label>
                            <input required type="text" name="name" className="w-full bg-background border border-border rounded-lg p-4 focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                        </div>

                        <div className="form-input space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                            <input required type="email" name="email" className="w-full bg-background border border-border rounded-lg p-4 focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                        </div>

                        <div className="form-input space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Message</label>
                            <textarea
                                required
                                rows={4}
                                name="message"
                                className="w-full bg-background border border-border rounded-lg p-4 focus:ring-2 focus:ring-accent-primary focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Tell me about your project..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (formRef.current) {
                                            formRef.current.requestSubmit();
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="form-input pt-4">
                            <button disabled={status === 'submitting'} type="submit" className="w-full bg-accent-primary text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                                {status === 'idle' && <Send className="w-4 h-4" />}
                            </button>

                            {/* Success Message */}
                            {status === 'success' && (
                                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-500 text-center animate-fade-in">
                                    ✓ Message sent successfully! I'll get back to you soon.
                                </div>
                            )}

                            {/* Error Message */}
                            {status === 'error' && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center animate-fade-in">
                                    ✗ {errorMessage}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </div>

            </div>
        </section>
    )
}
