import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
  theme: {
    extend: {
      screens: {
        "3xl": "1600px",
      },
      fontFamily: {
        sans: ["Satoshi", "DM Sans", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
