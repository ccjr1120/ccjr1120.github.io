import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './mdx-components.tsx',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        pri: {
          dark: '#d8d02c',
          DEFAULT: '#d8d02c',
          light: '#d8d02c'
        }
      }
    }
  }
}
export default config
