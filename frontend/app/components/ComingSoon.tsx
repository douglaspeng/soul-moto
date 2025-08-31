export default function ComingSoon() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/images/coming_soon.png)'
      }}
    >
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">Coming Soon</h1>
      </div>
      <div className="absolute bottom-4 right-4">
        <img
          src="/images/white_text_coming_soon_fixed.svg"
          alt="Coming Soon"
          className="w-[300px] h-auto"
        />
      </div>
    </div>
  )
}
