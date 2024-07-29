import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
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
