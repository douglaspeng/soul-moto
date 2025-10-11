'use client'

import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'
import {useScroll} from './ScrollContext'

interface AboutUsClientProps {
  persons: any[]
}

export default function AboutUsClient({ persons }: AboutUsClientProps) {
  const { aboutUsRef } = useScroll()

  return (
    <div 
      ref={aboutUsRef}
      className="relative min-h-[80vh] w-full about-us-section"
      style={{
        backgroundImage: 'url(/images/coming_soon.png)',
        backgroundAttachment: 'fixed',
        backgroundPosition: '50%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 about-us-overlay"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 about-us-content">
        <div className="flex flex-col items-center gap-8 about-us-layout">
          {/* Text Content Container with Glass Effect - Top/Right Side */}
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-6 text-white about-us-text-container">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase text-white about-us-title">
            团队介绍
            </h2>
            
            <div className="space-y-4 text-lg leading-relaxed text-white about-us-description">
              <p>
                Soul Moto Crew —— 我们最初，只是一群单纯热爱摩托的人。有人沉醉于山路的弯道，有人只是单纯享受两轮带来的自由。但当这些心怀热情的人走到一起，我们发现，这不仅仅是骑车——这是属于骑士们的生活方式。
              </p>
              
              <p>
                在这里，有轰鸣的引擎声作伴，有并肩驰骋的兄弟姐妹。我们相信，摩托不只是速度，更是一种责任和态度。为了让更多人安全地感受骑行的乐趣。
              </p>
              
              <p>
                我们的使命很简单：凝聚社群，让热爱不再孤单；传递激情，让自由永不停息。无论你是驰骋多年的老将，还是刚刚入门的新手，只要你心中有火，Soul Moto Crew 就会在这里，和你一起骑向远方。
              </p>
            </div>
            
                  {/* Social Media Icons */}
                  <div className="flex gap-4 pt-4 about-us-social-links">
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors about-us-social-link"
                      aria-label="Xiaohongshu"
                    >
                      <span className="text-white text-xs font-bold">小红书</span>
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all about-us-social-link"
                      aria-label="Instagram"
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
          </div>
          
          {/* Team Members Section - Bottom/Left Side */}
          {persons && persons.length > 0 && (
            <div className="w-full lg:w-1/3 space-y-4 about-us-team-section">
              <h3 className="text-2xl font-bold text-white mb-6 about-us-team-title">管理成员</h3>
              <div className="flex flex-wrap gap-3 about-us-team-list items-start">
                {persons.map((person: any) => (
                  <div 
                    key={person._id}
                    className="group rounded-xl p-4 pb-2 flex flex-col items-center text-center transition-all duration-500 ease-out hover:bg-white/20 hover:shadow-lg w-[120px] h-[120px] hover:w-64 hover:h-auto about-us-team-member transition-[width] duration-300"
                  >
                    {/* Profile Picture */}
                    <div className="flex-shrink-0 mb-2 about-us-team-member-avatar">
                      {person.picture && urlForImage(person.picture) ? (
                        <div className="w-16 h-16 group-hover:w-20 group-hover:h-20 rounded-full overflow-hidden about-us-team-member-image transition-all duration-500 ease-out">
                          <Image
                            src={urlForImage(person.picture)?.url() || ''}
                            alt={person.picture.alt || person.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 group-hover:w-20 group-hover:h-20 bg-white/20 rounded-full flex items-center justify-center about-us-team-member-placeholder transition-all duration-500 ease-out">
                          <svg className="w-6 h-6 group-hover:w-10 group-hover:h-10 text-white transition-all duration-500 ease-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Name - Always visible */}
                    <div className="flex-shrink-0 mb-1 about-us-team-member-name-container">
                      <h4 className="text-sm font-bold text-white about-us-team-member-name">
                        {person.name}
                      </h4>
                    </div>
                    
                    {/* Description - Hidden by default, expands on hover */}
                    <div className="w-full transition-all duration-500 ease-out max-h-0 group-hover:max-h-48 opacity-0 group-hover:opacity-100 about-us-team-member-description-container overflow-hidden group-hover:delay-300">
                      <p className="text-sm text-white/80 about-us-team-member-description px-2 leading-relaxed mb-0">
                        {person.description || 'Motorcycle enthusiast and community builder'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
