
export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    heroPhoto: string;
    gallery: string[];
}

export const EVENTS_DATA: Event[] = [
    {
        id: "GDG-2025",
        title: "Google Developer Groups (GDG) Gandhinagar",
        date: "November 2025",
        location: "Gandhinagar, Gujarat",
        description: "Attending Google Developer Fest 2025 in Gandhinagar was an inspiring experience. I gained valuable insights into the latest Google technologies, developer tools, and industry trends through expert-led talks and sessions. The event also provided a great opportunity to network with developers, learn from real-world use cases, and strengthen my passion for building impactful technology solutions.",
        heroPhoto: "https://images.unsplash.com/photo-1540575467063-178a50935339?q=80&w=1000&auto=format&fit=crop", // Placeholder real URL for demo
        gallery: [
            "https://images.unsplash.com/photo-1540575467063-178a50935339?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000&auto=format&fit=crop"
        ]
    },
    {
        id: "Tic-Tech-Toe-2025",
        title: "Hackathon: Tic Tech Toe 2025",
        date: "April 2025",
        location: "DAIICT, Gandhinagar",
        description: "Participated in the Tic Tech Toe 2025 hackathon, where I collaborated with a team to design and build a secure web application under time pressure. I focused on authentication, input validation, and encrypting sensitive data, which gave me hands-on experience with secure-by-design thinking.",
        heroPhoto: "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=1000&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop"
        ]
    },
    {
        id: "Smart-India-Hackathon-2025",
        title: "Hackathon: Smart India Hackathon 2025",
        date: "September 2025",
        location: "Indus University",
        description: "Participated in Smart India Hackathon (SIH) 2025 and successfully cleared the internal round, gaining hands-on experience in problem-solving, teamwork, and developing innovative solutions under competitive conditions.",
        heroPhoto: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop"
        ]
    },
    {
        id: "Autonomous-Hacks-2026",
        title: "Autonomous Hacks 2026",
        date: "January 2026",
        location: "Ahmedabad, Gujarat",
        description: "Participated in Autonomous Hacks 2026 and successfully cleared the internal round, gaining hands-on experience in problem-solving, teamwork, and developing innovative solutions under competitive conditions.",
        heroPhoto: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop"
        ]
    }
];
