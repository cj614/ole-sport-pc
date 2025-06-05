import { defineConfig } from 'windicss/helpers'
import theme from './src/ui/theme'

export default defineConfig({
  darkMode: 'class',
  extract: {
    include: ['index.html', 'src/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules/**/*', '.git/**/*', 'public/**/*']
  },
  theme: {
    extend: {
      zIndex: {
        '-1': '-1'
      },
      colors: {
        ...theme.themes.light
      },
      fontFamily: {
        serif: ['Kanit'],
        sans: ['DIN Alternate'],
        kanit: ['Kanit']
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1280px',
        '2xl': '1600px'
      }
    }
  }
})
