'use client'

import {useState} from 'react'
import {useSession, signIn} from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import ImageModal from '@/app/components/ImageModal'

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL']
const COLORS = ['White', 'Black']

const GEAR_CONFIG: Record<string, {label: string; images: string[]}> = {
  hoodie: {
    label: '连帽卫衣',
    images: [
      '/images/gears/11.JPG',
      '/images/gears/3.JPG',
      '/images/gears/7.JPG',
      '/images/gears/8.JPG',
    ],
  },
  tshirt: {
    label: 'T-Shirt',
    images: [
      '/images/gears/1.JPG',
      '/images/gears/9.JPG',
      '/images/gears/10.JPG',
      '/images/gears/4_close.JPG',
    ],
  },
}

interface GearOrderClientProps {
  clothType: string
}

export default function GearOrderClient({clothType}: GearOrderClientProps) {
  const {data: session, status} = useSession()
  const config = GEAR_CONFIG[clothType] ?? GEAR_CONFIG['hoodie']

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleOrder = () => {
    if (status === 'loading') return
    if (!session) {
      signIn('google', {callbackUrl: window.location.href})
      return
    }
    if (!selectedSize || !selectedColor) {
      setError('Please select a size and color.')
      return
    }
    setError(null)
    setShowDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/gear/order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: name.trim(),
          clothType,
          size: selectedSize,
          color: selectedColor,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to place order.')
      }
      setSuccess(true)
      setShowDialog(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <Link
          href="/gear"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </Link>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left: thumbnails + main image ── */}
          <div className="flex gap-3">
            {/* Vertical thumbnail strip */}
            {config.images.length > 1 && (
              <div className="flex flex-col gap-2 w-16 shrink-0">
                {config.images.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-150 ${
                      selectedImageIndex === index
                        ? 'border-black'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${config.label} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div
              className="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden cursor-zoom-in"
              onClick={() => setIsModalOpen(true)}
            >
              <Image
                src={config.images[selectedImageIndex]}
                alt={`${config.label} - Image ${selectedImageIndex + 1}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Arrow nav on main image */}
              {config.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex((i) => (i === 0 ? config.images.length - 1 : i - 1))
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedImageIndex((i) => (i === config.images.length - 1 ? 0 : i + 1))
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ── Right: product info ── */}
          <div className="flex flex-col gap-6 lg:pt-2">
            {/* Title */}
            <div>
              <p className="text-xs tracking-widest uppercase font-mono text-gray-400 mb-1">
                Soul Moto Crew Official
              </p>
              <h1 className="text-3xl font-bold text-gray-900">Soul Moto {config.label}</h1>
            </div>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <svg
                  className="w-12 h-12 text-green-500 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-lg font-bold text-green-800 mb-1">订单已确认</h3>
                <p className="text-green-700 text-sm">你的订单我们已经收到，后续将尽快为你处理。</p>
                <Link href="/gear" className="inline-block mt-4 text-sm underline text-green-700 hover:text-green-900">
                  继续浏览
                </Link>
              </div>
            ) : (
              <>
                {/* Color */}
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    颜色
                    {selectedColor && (
                      <span className="ml-2 font-normal text-gray-500">{selectedColor}</span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'border-black scale-110' : 'border-gray-300 hover:border-gray-500'
                        } ${color === 'White' ? 'bg-white' : 'bg-black'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-2">尺码</p>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 rounded border text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-600 text-sm -mt-2">{error}</p>
                )}

                {/* CTA */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={handleOrder}
                    disabled={status === 'loading' || isSubmitting}
                    className="w-full bg-black text-white font-semibold py-4 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                  >
                    {status === 'loading'
                      ? 'Loading...'
                      : session
                        ? '立即预定'
                        : '登录后预定'}
                  </button>
                </div>

                {/* Divider + accordion-style info */}
                <div className="border-t border-gray-200 pt-4 space-y-4 text-sm text-gray-600">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-800 py-1 list-none">
                      产品简介
                      <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-2 leading-relaxed text-gray-600">
                      {clothType === 'hoodie'
                        ? '高品质面料打造的连帽卫衣。兼顾保暖与版型，无论日常还是出行，都能保持利落有型。'
                        : '经典 Soul Moto T恤。轻盈透气，触感舒适，适合长时间穿着。简约的设计，让它可以轻松融入你的日常，无论去往哪里，都能陪你自在前行。'}
                    </p>
                  </details>

                  <details className="group border-t border-gray-200 pt-4">
                    <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-800 py-1 list-none">
                      尺码信息
                      <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm text-center border-collapse">
                        <thead>
                          <tr className="bg-gray-100 text-gray-500">
                            {['尺码', '衣长', '胸围', '肩宽', '袖长'].map((h) => (
                              <th key={h} className="px-3 py-2 font-medium">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-gray-700">
                          {[
                            ['S',   '68', '104', '51', '22'],
                            ['M',   '70', '108', '53', '22.5'],
                            ['L',   '72', '112', '55', '23'],
                            ['XL',  '74', '116', '57', '23.5'],
                            ['2XL', '76', '120', '59', '24'],
                            ['3XL', '78', '124', '61', '24.5'],
                          ].map(([size, ...vals]) => (
                            <tr
                              key={size}
                              className={`border-t border-gray-100 ${selectedSize === size ? 'bg-black text-white font-semibold' : 'hover:bg-gray-50'}`}
                            >
                              <td className="px-3 py-2">{size}</td>
                              {vals.map((v, i) => (
                                <td key={i} className="px-3 py-2">{v}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-400 mt-2">单位 cm</p>
                    </div>
                  </details>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={config.images as any[]}
        imageUrls={config.images}
        selectedIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
        title={config.label}
      />

      {/* Order Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">确认订单</h3>
              <button
                onClick={() => {setShowDialog(false); setError(null)}}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-800">商品:</span> Soul Moto {config.label}</p>
              <p><span className="font-medium text-gray-800">尺码:</span> {selectedSize}</p>
              <p><span className="font-medium text-gray-800">颜色:</span> {selectedColor}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="order-name" className="block text-sm font-medium text-gray-700 mb-1">
                  名字 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="order-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  placeholder="Enter your name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {setShowDialog(false); setError(null)}}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
                  disabled={isSubmitting}
                >
                  返回
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '提交中...' : '提交订单'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
