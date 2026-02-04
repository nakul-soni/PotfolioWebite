
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
        heroPhoto: "/projects/DevFest Gandhinagar/Snapchat-1567164758.jpg", // Placeholder real URL for demo
        gallery: [
            "/projects/DevFest Gandhinagar/Snapchat-862544047.jpg"
        ]
    },
    {
        id: "Tic-Tech-Toe-2025",
        title: "Hackathon: Tic Tech Toe 2025",
        date: "April 2025",
        location: "DAIICT, Gandhinagar",
        description: "Participated in the Tic Tech Toe 2025 hackathon, where I collaborated with a team to design and build a secure web application under time pressure. I focused on authentication, input validation, and encrypting sensitive data, which gave me hands-on experience with secure-by-design thinking.",
        heroPhoto: "/projects/TIC-TECH-TOE hackathon/Screenshot_2026-02-04-18-42-36-73_254de13a4bc8758c9908fff1f73e3725.jpg",
        gallery: [
            "/projects/TIC-TECH-TOE hackathon/Screenshot_2026-02-04-18-43-10-42_254de13a4bc8758c9908fff1f73e3725.jpg"
        ]
    },
    {
        id: "Autonomous-Hacks-2026",
        title: "Autonomous Hacks 2026",
        date: "January 2026",
        location: "Ahmedabad, Gujarat",
        description: "Participated in Autonomous Hacks 2026 and successfully cleared the internal round, gaining hands-on experience in problem-solving, teamwork, and developing innovative solutions under competitive conditions.",
        heroPhoto: "/projects/Autonomous Hacks/WhatsApp Image 2026-02-04 at 7.22.26 PM.jpeg",
        gallery: [
            "/projects/Autonomous Hacks/Snapchat-2138028487.jpg",
            "/projects/Autonomous Hacks/DHP_7269.JPG"]
    }
];
