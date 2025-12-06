import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#2C3E50',      // Dark slate for text
                'primary-light': '#34495E', // Medium slate
                'secondary': '#5D6D7E',    // Blue-grey
                'accent': '#3498DB',       // Soft blue accent
                'bg-main': '#E8ECEF',      // Main light grey background
                'bg-card': '#E8ECEF',      // Card background (same as main for neomorphic)
                'text-dark': '#2C3E50',    // Dark slate
                'text-light': '#7F8C8D',   // Medium grey
                'shadow-dark': '#A3B1C6',  // Darker shadow for neomorphic
                'shadow-light': '#FFFFFF', // Light shadow for neomorphic
                'error': '#E74C3C',        // Soft red
                'success': '#27AE60',      // Soft green
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
