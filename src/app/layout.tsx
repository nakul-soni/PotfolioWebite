
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { CustomCursor } from "@/components/shared/CustomCursor";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { ThemeToggle } from "@/components/shared/ThemeToggle"; // Floating orb
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/sections/ParticlesBackground";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Nakul Soni | Full-Stack Developer",
  description: "Nakul Soni, a Full-Stack Developer based in Ahmedabad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased selection:bg-accent-primary selection:text-white overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingScreen />
          <CustomCursor />
          <Navbar />
          <ThemeToggle />
          <ParticlesBackground />
          <main className="relative z-10 min-h-screen bg-transparent text-foreground">
            {children}
          </main>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
