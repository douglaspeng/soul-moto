'use client'

import { createContext, useContext, useRef, ReactNode } from 'react'

interface ScrollContextType {
  aboutUsRef: React.RefObject<HTMLDivElement | null>
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const aboutUsRef = useRef<HTMLDivElement>(null)

  return (
    <ScrollContext.Provider value={{ aboutUsRef }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScroll() {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider')
  }
  return context
}
