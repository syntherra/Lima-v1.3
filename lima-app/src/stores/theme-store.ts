import { create } from 'zustand'
import { useEffect } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',
  isDark: false,
  setTheme: (theme: Theme) => {
    set({ theme, isDark: theme === 'dark' })
    // Apply theme to document root for CSS custom properties
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
      // Save to localStorage
      localStorage.setItem('lima-theme-storage', JSON.stringify({ theme }))
    }
  },
  toggleTheme: () => {
    const currentTheme = get().theme
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    get().setTheme(newTheme)
  },
}))

// Hook to initialize theme on app start
export const useInitializeTheme = () => {
  const { theme, setTheme } = useThemeStore()
  
  // Initialize theme on mount
  useEffect(() => {
    setTheme(theme)
  }, [theme, setTheme])
}

// Export for use in components
export default useThemeStore