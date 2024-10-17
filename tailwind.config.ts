import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/mdx-components.tsx',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)'
      },
      textColor: {
        base: 'var(--color-text-base)',
        muted: 'var(--color-text-muted)'
      },
      backgroundColor: {
        fill: 'var(--color-fill)'
      }
    }
  },
  plugins: []
}
export default config
