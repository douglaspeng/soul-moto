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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false)
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
    <>
      <nav className="flex items-center w-full navigation-container">
        {/* Mobile Hamburger Button - Only visible on mobile, positioned on the left */}
        <button
          onClick={handleMobileMenuToggle}
          className="md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1"
        >
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center navigation-logo">
          <Image
            src="/images/sm-bk-text.svg"
            alt="Soul Moto Crew Logo"
            width={200}
            height={100}
            className="navigation-logo-image"
          />
        </Link>
        
        {/* Desktop Navigation Items - Hidden on mobile */}
        <ul
          role="list"
          className="hidden md:flex items-center gap-4 md:gap-6 leading-5 text-xs sm:text-base tracking-tight font-mono navigation-menu"
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
        </ul>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark Background */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleMobileMenuToggle}
          ></div>
          
          {/* Sliding Menu from Left */}
          <div className="fixed left-0 top-0 h-screen w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 opacity-100">
            <div className="flex flex-col h-screen bg-white">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Image
                  src="/images/sm-bk-text.svg"
                  alt="Soul Moto Crew Logo"
                  width={200}
                  height={60}
                  className="navigation-logo-image"
                />
                <button
                  onClick={handleMobileMenuToggle}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Menu Items */}
              <nav className="flex-1 p-6">
                <ul className="space-y-4">
                  <li>
                    <Link 
                      href="/events" 
                      onClick={handleMobileLinkClick}
                      className={`block py-3 px-4 text-lg font-medium rounded-lg transition-colors ${isActive('/events') ? 'bg-gray-100 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Events
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      href="/gallery" 
                      onClick={handleMobileLinkClick}
                      className={`block py-3 px-4 text-lg font-medium rounded-lg transition-colors ${isActive('/gallery') ? 'bg-gray-100 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Gallery
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      href="/services" 
                      onClick={handleMobileLinkClick}
                      className={`block py-3 px-4 text-lg font-medium rounded-lg transition-colors ${isActive('/services') ? 'bg-gray-100 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Services
                    </Link>
                  </li>
                  
                  <li>
                    <Link 
                      href="/trade-zone" 
                      onClick={handleMobileLinkClick}
                      className={`block py-3 px-4 text-lg font-medium rounded-lg transition-colors ${isActive('/trade-zone') ? 'bg-gray-100 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Trade Zone
                    </Link>
                  </li>
                  
                  <li>
                    <button 
                      onClick={handleAboutUsClick}
                      className={`block w-full text-left py-3 px-4 text-lg font-medium rounded-lg transition-colors ${isAboutUsActive ? 'bg-gray-100 text-black' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      About Us
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
