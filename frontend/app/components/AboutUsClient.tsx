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
      className="relative min-h-[80vh] w-full"
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
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center min-h-[60vh] gap-8">
          {/* Text Content Container with Glass Effect - Top/Right Side */}
          <div className="w-full lg:flex-1 lg:max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-6 text-white">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase text-white">
            团队介绍
            </h2>
            
            <div className="space-y-4 text-lg leading-relaxed text-white">
              <p>
                Soul Moto Crew —— 不只是一个团队，而是一群燃烧着激情的骑士。我们因热爱而聚，因自由而行，肩负着让摩托文化不断传承与进化的使命。这里有赛道的轰鸣，有兄弟的笑声，也有两轮带来的无尽冒险。
              </p>
              
              <p>
                我们不仅守护摩托的历史与精神，更不断探索创新与突破。通过安全倡议、骑行教育，以及对未来摩托科技的支持，我们让骑士之路更加稳健、更加长远。
              </p>
              
              <p>
              我们的目标很简单：凝聚摩托社群，让更多人感受速度与热血，启发新一代去追逐风的自由。无论你是驰骋多年的老将，还是初次上路的新手，只要心中有火，Soul Moto Crew 就欢迎你加入，一起用两轮书写属于我们的传奇。
              </p>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-4 pt-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-red-600 rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                aria-label="Xiaohongshu"
              >
                <span className="text-white text-xs font-bold">小红书</span>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all"
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
            <div className="w-full lg:w-1/3 space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">团队成员</h3>
              <div className="space-y-3">
                {persons.map((person: any) => (
                  <div 
                    key={person._id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 flex items-center gap-4"
                  >
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      {person.picture && urlForImage(person.picture) ? (
                        <div className="w-15 h-15 rounded-full overflow-hidden">
                          <Image
                            src={urlForImage(person.picture)?.url() || ''}
                            alt={person.picture.alt || person.name}
                            width={60}
                            height={60}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-15 h-15 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Name and Description */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-white truncate">
                        {person.name}
                      </h4>
                      <p className="text-sm text-white/80 truncate hidden sm:block">
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
