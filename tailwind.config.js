function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined && !isNaN(Number(opacityValue))) {
      return `color-mix(in srgb, var(${variableName}) ${Number(opacityValue) * 100}%, transparent)`;
    }
    return `var(${variableName})`;
  };
}

/** @type {import("tailwindcss").Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: withOpacity("--background"),
        foreground: withOpacity("--foreground"),
        panel: withOpacity("--panel"),
        card: {
          DEFAULT: withOpacity("--card"),
          foreground: withOpacity("--card-foreground"),
        },
        popover: {
          DEFAULT: withOpacity("--popover"),
          foreground: withOpacity("--popover-foreground"),
        },
        primary: {
          DEFAULT: withOpacity("--primary"),
          foreground: withOpacity("--primary-foreground"),
        },
        secondary: {
          DEFAULT: withOpacity("--secondary"),
          foreground: withOpacity("--secondary-foreground"),
        },
        muted: {
          DEFAULT: withOpacity("--muted"),
          foreground: withOpacity("--muted-foreground"),
        },
        accent: {
          DEFAULT: withOpacity("--accent"),
          foreground: withOpacity("--accent-foreground"),
        },
        destructive: {
          DEFAULT: withOpacity("--destructive"),
          foreground: withOpacity("--destructive-foreground"),
        },
        border: withOpacity("--border"),
        input: withOpacity("--input"),
        ring: withOpacity("--ring"),
        chart: {
          1: withOpacity("--chart-1"),
          2: withOpacity("--chart-2"),
          3: withOpacity("--chart-3"),
          4: withOpacity("--chart-4"),
          5: withOpacity("--chart-5"),
        },
        sidebar: {
          DEFAULT: withOpacity("--sidebar"),
          foreground: withOpacity("--sidebar-foreground"),
          primary: withOpacity("--sidebar-primary"),
          "primary-foreground": withOpacity("--sidebar-primary-foreground"),
          accent: withOpacity("--sidebar-accent"),
          "accent-foreground": withOpacity("--sidebar-accent-foreground"),
          border: withOpacity("--sidebar-border"),
          ring: withOpacity("--sidebar-ring"),
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "hero-h1": [
          "clamp(2.5rem, 2rem + 3vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "hero-sub": [
          "1.125rem",
          { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" },
        ],
        "docs-h1": [
          "clamp(2rem, 1.7rem + 1.5vw, 2.5rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        h2: [
          "1.625rem",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h3: [
          "1.1875rem",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" },
        ],
        body: [
          "1rem",
          { lineHeight: "1.65", letterSpacing: "0", fontWeight: "400" },
        ],
        nav: [
          "0.875rem",
          { lineHeight: "1.4", letterSpacing: "0", fontWeight: "500" },
        ],
        table: [
          "0.8125rem",
          { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" },
        ],
        caption: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        code: [
          "0.8125rem",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
        ],
        "demo-base": [
          "0.875rem",
          { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" },
        ],
      },
      spacing: {
        1: "0.25rem", // 4px
        2: "0.5rem", // 8px
        3: "0.75rem", // 12px
        4: "1rem", // 16px
        6: "1.5rem", // 24px
        8: "2rem", // 32px
        12: "3rem", // 48px
        16: "4rem", // 64px
        24: "6rem", // 96px
        "target-min": "1.5rem", // 24px
        "target-desktop": "2.5rem", // 40px
        "target-touch": "2.75rem", // 44px
        "gap-target": "0.5rem", // 8px min gap
      },
      maxWidth: {
        prose: "65ch",
      },
      minHeight: {
        "target-desktop": "2.5rem",
        "target-touch": "2.75rem",
      },
      minWidth: {
        "target-desktop": "2.5rem",
        "target-touch": "2.75rem",
      },
    },
  },
  plugins: [],
};
