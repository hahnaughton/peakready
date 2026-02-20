/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#060913",
        panel: "#0B1120",
        glass: "rgba(255,255,255,0.08)",
        line: "rgba(255,255,255,0.18)",
        neon: {
          cyan: "#22D3EE",
          violet: "#A78BFA",
          lime: "#84CC16",
          amber: "#FBBF24",
          rose: "#FB7185",
        },
      },
      spacing: {
        18: "4.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 24px rgba(2, 8, 23, 0.45)",
      },
      fontFamily: {
        display: ["System"],
        body: ["System"],
      },
    },
  },
  plugins: [],
}

