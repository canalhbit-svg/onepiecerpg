import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { HowToPlaySection } from '@/components/sections/how-to-play-section'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-onePiece-dark via-onePiece-dark to-onePiece-red text-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowToPlaySection />
      </main>
      <Footer />
    </div>
  )
}
