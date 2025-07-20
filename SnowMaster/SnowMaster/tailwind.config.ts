import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        snow: {
          50: "var(--snow-50)",
          100: "var(--snow-100)",
          200: "var(--snow-200)",
          300: "var(--snow-300)",
          400: "var(--snow-400)",
          500: "var(--snow-500)",
          600: "var(--snow-600)",
          700: "var(--snow-700)",
          800: "var(--snow-800)",
          900: "var(--snow-900)",
        },
        winter: {
          50: "var(--winter-50)",
          100: "var(--winter-100)",
          200: "var(--winter-200)",
          300: "var(--winter-300)",
          400: "var(--winter-400)",
          500: "var(--winter-500)",
          600: "var(--winter-600)",
          700: "var(--winter-700)",
          800: "var(--winter-800)",
          900: "var(--winter-900)",
        },
        kawaii: {
          50: "var(--kawaii-50)",
          100: "var(--kawaii-100)",
          200: "var(--kawaii-200)",
          300: "var(--kawaii-300)",
          400: "var(--kawaii-400)",
          500: "var(--kawaii-500)",
          600: "var(--kawaii-600)",
          700: "var(--kawaii-700)",
          800: "var(--kawaii-800)",
          900: "var(--kawaii-900)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
