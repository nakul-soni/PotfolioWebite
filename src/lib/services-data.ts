
import { Laptop, Palette, Truck, Wrench } from "lucide-react";

export interface Service {
    id: string;
    title: string;
    icon: any;
    heroImage: string;
    description: string;
    benefits: string[];
    pricing: string;
}

export const SERVICES_DATA: Service[] = [
    {
        id: "full-stack",
        title: "FULL-STACK DEVELOPMENT",
        icon: Laptop,
        heroImage: "/projects/ServicesPhotos/FullStackServicePhoto.png", // Placeholder
        description: "Custom web applications from concept to deployment. Scalable, secure, and built for performance.",
        benefits: [
            "Next.js/React + Node.js backends",
            "Database design + API development",
            "Vercel/Netlify deployment"
        ],
        pricing: "Starting: $5,000+"
    },
    {
        id: "portfolio",
        title: "PORTFOLIO WEBSITES",
        icon: Palette,
        heroImage: "/projects/ServicesPhotos/PortfolioServicePhoto.png", // Placeholder
        description: "Advanced animated portfolios like this one. Stand out with 3D interactions and smooth motion.",
        benefits: [
            "GSAP ScrollTrigger animations",
            "Responsive + mobile-first design",
            "Theme toggle + performance optimized"
        ],
        pricing: "Starting: $2,500+"
    },
    {
        id: "consulting",
        title: "TECHNICAL CONSULTING",
        icon: Wrench,
        heroImage: "/projects/ServicesPhotos/TechConsultancyServicePhoto.png", // Placeholder
        description: "Architecture reviews + optimization. Improve your code quality and application performance.",
        benefits: [
            "Codebase audits + refactoring",
            "Tech stack recommendations",
            "Performance optimization"
        ],
        pricing: "Starting: $150/hour"
    }
];
