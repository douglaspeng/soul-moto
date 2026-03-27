'use client'

import Link from 'next/link'
import Image from 'next/image'

const gearItems = [
  {
    id: 'hoodie',
    name: 'Soul Moto 连帽卫衣',
    description: '简约设计，重在质感',
    image: '/images/gears/2.JPG',
  },
  {
    id: 'tshirt',
    name: 'Soul Moto T恤',
    description: '经典版型，自在随行',
    image: '/images/gears/1.JPG',
  },
]

const sections = [
  {
    title: 'Built for Riders',
    description:
      '精选面料，考究剪裁，体现真正的质感。这是属于 Soul Moto 的风格，也是你的日常。',
    image: '/images/gears/3.JPG',
  },
  {
    title: 'Wear the Culture',
    description:
      "Soul Moto 不只是一个名字，更是一种态度。穿上它，你带走的不只是风格，还有属于你的那份表达",
    image: '/images/gears/4.JPG',
  },
  {
    title: 'Limited Runs',
    description:
      "每一批次都是限量制作。售完即止。在下一次发售前，抓住属于你的那一件",
    image: '/images/gears/5.JPG',
  },
]

export default function GearClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — banner image */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/gears/bannerJPG.JPG"
          alt="Soul Moto Gear"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 px-6">
          <p className="text-sm tracking-widest uppercase font-mono mb-4 text-gray-300">
            Soul Moto Crew Official
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">Gear</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-xl">Ride. Represent. Repeat.</p>
        </div>
      </section>

      {/* Product Cards */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gearItems.map((item) => (
            <div key={item.id} className="rounded-2xl overflow-hidden flex flex-col bg-gray-900">
              {/* Product image */}
              <div className="relative h-80 w-full">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Card info */}
              <div className="p-8 flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-white">{item.name}</h2>
                <p className="text-gray-300 text-sm">{item.description}</p>
                <div className="mt-4">
                  <Link
                    href={`/gear/order/${item.id}`}
                    className="inline-block bg-white text-black font-semibold text-sm px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    预定
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scrollable Feature Sections */}
      {sections.map((section, index) => (
        <section
          key={index}
          className={`md:min-h-screen flex flex-col md:flex-row items-center gap-6 md:gap-12 px-6 md:px-20 py-10 md:py-12 ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
          }`}
        >
          {/* Text side */}
          <div className={`flex-1 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
            <p className="text-xs tracking-widest uppercase font-mono text-gray-400 mb-4">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
              {section.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              {section.description}
            </p>
          </div>

          {/* Image side */}
          <div className={`w-full md:flex-1 ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
            <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden">
              <Image
                src={section.image}
                alt={section.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
