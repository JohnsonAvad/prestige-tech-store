import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import HeroBanner from '../../components/shop/HeroBanner'
import CategoryGrid from '../../components/shop/CategoryGrid'
import FeaturedProducts from '../../components/shop/FeaturedProducts'
import BrandStrip from '../../components/shop/BrandStrip'
import NewArrivals from '../../components/shop/NewArrivals'
import Newsletter from '../../components/shop/Newsletter'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-12">
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <BrandStrip />
        <NewArrivals />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}