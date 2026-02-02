"use client"
import { forwardRef } from "react"

export const TimelineSVG = forwardRef<SVGSVGElement>((props, ref) => (
    <svg
        ref={ref}
        className="absolute top-1/2 left-0 w-full h-20 -translate-y-1/2 -z-10 pointer-events-none"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
    >
        <path
            d="M0,50 Q250,100 500,50 T1000,50"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            className="timeline-path-draw"
            strokeDasharray="1000"
            strokeDashoffset="1000"
        />
    </svg>
));
TimelineSVG.displayName = "TimelineSVG";
