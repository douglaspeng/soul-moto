export default function Footer() {
  return (
    <footer className="relative footer-section" style={{ backgroundColor: '#d8d8d8' }}>
      <div className="bg-gradient-to-b from-white w-full h-full absolute top-0 footer-gradient"></div>
      <div className="container relative footer-container">
        <div className="py-16 px-4 sm:px-6 lg:px-8 footer-content">
          <div className="max-w-4xl mx-auto text-center footer-mission">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 footer-title">
              我们的使命
            </h2>
            <p className="text-lg text-gray-600 mb-8 footer-description">
              在 Soul Moto，我们相信开阔道路上的自由，以及身处摩托社群时的情谊。我们的使命是连接骑士，分享故事，并共同创造难忘的骑行体验。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 footer-values">
              <div className="text-center footer-value-card">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 footer-value-icon">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 footer-value-title">社区 Community</h3>
                <p className="text-gray-600 footer-value-description">在骑士之间建立联系</p>
              </div>
              <div className="text-center footer-value-card">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 footer-value-icon">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 footer-value-title">冒险 Adventure</h3>
                <p className="text-gray-600 footer-value-description">用两轮去探索世界</p>
              </div>
              <div className="text-center footer-value-card">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 footer-value-icon">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 footer-value-title">热爱 Passion</h3>
                <p className="text-gray-600 footer-value-description">分享我们对摩托车的热情</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
