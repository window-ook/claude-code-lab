# CSS file cleanup for down-sizing

src: `@/app/globals.css`

Look through the custom className in `@theme {}` and `@layer {}`. They are declared to make custom TailwindCSS color, font-family, breakpoints and etc.
If it is not used by any components, just remove from globals.css.
