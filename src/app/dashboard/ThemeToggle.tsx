'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === 'dark'

  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <Button
      onClick={() => {
        setTheme(isDark ? 'light' : 'dark')
      }}
      variant="ghost"
    >
      {ready ? isDark ? <Sun /> : <Moon /> : <Sun />}
    </Button>
  )
}
