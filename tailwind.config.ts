import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Add Sindoor custom colors if needed
                primary: {
                    DEFAULT: '#D32F2F',
                    hover: '#b71c1c'
                }
            },
        },
    },
    plugins: [],
};
export default config;
