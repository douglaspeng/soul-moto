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
    <nav className="flex items-center justify-between w-full navigation-container">
      {/* Logo */}
      <Link href="/" className="flex items-center navigation-logo">
        <Image
          src="/images/sm-bk-text.svg"
          alt="Soul Moto Crew Logo"
          width={300}
          height={100}
          className="navigation-logo-image"
        />
      </Link>
      
      {/* Navigation Items */}
      <ul
        role="list"
        className="flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono navigation-menu"
      >

        <li className="navigation-item">
          <Link 
            href="/events" 
            className={`hover:underline navigation-link ${isActive('/events') ? 'text-black font-semibold' : ''}`}
          >
            Events
          </Link>
        </li>
        
        <li className="navigation-item">
          <Link 
            href="/gallery" 
            className={`hover:underline navigation-link ${isActive('/gallery') ? 'text-black font-semibold' : ''}`}
          >
            Gallery
          </Link>
        </li>
        <li className="navigation-item">
          <Link 
            href="/services" 
            className={`hover:underline navigation-link ${isActive('/services') ? 'text-black font-semibold' : ''}`}
          >
            Services
          </Link>
        </li>
        
        <li className="navigation-item">
          <Link 
            href="/trade-zone" 
            className={`hover:underline navigation-link ${isActive('/trade-zone') ? 'text-black font-semibold' : ''}`}
          >
            Trade Zone
          </Link>
        </li>
        <li className="navigation-item">
          <button 
            onClick={handleAboutUsClick}
            className={`hover:underline navigation-link ${isAboutUsActive ? 'text-black font-semibold' : ''}`}
          >
            About Us
          </button>
        </li>
        <li className="navigation-item">
          <span className="text-gray-400 cursor-not-allowed navigation-link-disabled">
            Rider Blog <span className="text-xs">(Coming Soon)</span>
          </span>
        </li>
      </ul>
    </nav>
  )
}
