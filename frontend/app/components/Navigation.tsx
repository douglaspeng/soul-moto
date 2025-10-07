'use client'

import Link from 'next/link'
import Image from 'next/image'
import {usePathname, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {useScroll} from './ScrollContext'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { aboutUsRef } = useScroll()
  const [isAboutUsActive, setIsAboutUsActive] = useState(false)

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const handleAboutUsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Set active state when clicked
    setIsAboutUsActive(true)
    
    if (pathname === '/') {
      // If on home page, scroll to AboutUs component
      if (aboutUsRef.current) {
        aboutUsRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // If on other page, redirect to home and scroll to AboutUs
      router.push('/#about-us')
    }
  }

  // Handle hash navigation when coming from other pages
  useEffect(() => {
    if (pathname === '/' && window.location.hash === '#about-us') {
      setIsAboutUsActive(true)
      setTimeout(() => {
        if (aboutUsRef.current) {
          aboutUsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [pathname])

  // Reset About Us active state when scrolling away from it
  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/' && aboutUsRef.current) {
        const rect = aboutUsRef.current.getBoundingClientRect()
        const isInView = rect.top <= 100 && rect.bottom >= 100
        
        if (!isInView) {
          setIsAboutUsActive(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Reset About Us active state when navigating to other pages
  useEffect(() => {
    if (pathname !== '/') {
      setIsAboutUsActive(false)
    }
  }, [pathname])

  return (
    <nav className="flex items-center">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/images/sm-bk-text.svg"
          alt="Soul Moto Crew Logo"
          width={300}
          height={100}
          style={{ height: '100px', width: '300px' }}
        />
      </Link>
      
      {/* Navigation Items */}
      <ul
        role="list"
        className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono"
      >

        <li>
          <Link 
            href="/events" 
            className={`hover:underline ${isActive('/events') ? 'text-black font-semibold' : ''}`}
          >
            Events
          </Link>
        </li>
        
        <li>
          <Link 
            href="/gallery" 
            className={`hover:underline ${isActive('/gallery') ? 'text-black font-semibold' : ''}`}
          >
            Gallery
          </Link>
        </li>
        <li>
          <Link 
            href="/services" 
            className={`hover:underline ${isActive('/services') ? 'text-black font-semibold' : ''}`}
          >
            Services
          </Link>
        </li>
        <li>
          <button 
            onClick={handleAboutUsClick}
            className={`hover:underline ${isAboutUsActive ? 'text-black font-semibold' : ''}`}
          >
            About Us
          </button>
        </li>
        <li>
          <span className="text-gray-400 cursor-not-allowed">
            Rider Blog <span className="text-xs">(Coming Soon)</span>
          </span>
        </li>
      </ul>
    </nav>
  )
}
