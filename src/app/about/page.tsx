import Navbar from '@/components/layout/Navbar'
import AboutSection from '@/components/sections/AboutSection'
import Footer from '@/components/layout/Footer'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px' }}>
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}
