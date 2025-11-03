/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // matches $font-family-base
      },
      fontSize: {
        // matches your Sass scale
        h1: ["2rem", { lineHeight: "1.4", fontWeight: "700" }], // 32px
        h2: ["1.375rem", { lineHeight: "1.35", fontWeight: "600" }], // 22px
        h3: ["1rem", { lineHeight: "1.4", fontWeight: "500" }], // 16px
        paragraph: ["0.875rem", { lineHeight: "1.6" }], // 14px
        label: ["0.8125rem", { lineHeight: "1.4", fontWeight: "500" }], // 13px
        body: ["0.625rem", { lineHeight: "1.4", fontWeight: "400" }], // 10px
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },     
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },    
        tertiary: {
          DEFAULT: "var(--tertiary)",
          foreground: "var(--tertiary-foreground)",
        },     
        danger: {
          DEFAULT: "var(--danger)",
          foreground: "var(--danger-foreground)",
        },       
        text: "var(--text-color)",         
        background: {
          DEFAULT: "var(--background)",
          foreground: "var(--text-color)",
        },   

        // Components
        card: {
          DEFAULT: "var(--surface)",     
          foreground: "var(--text-color)",
        },
        popover: {
          DEFAULT: "var(--surface)",
          foreground: "var(--text-color)",
        },   
      },
      borderColor: {
        DEFAULT: "#F5F5F5", 
      },
    },
  },
  plugins: [],
}

