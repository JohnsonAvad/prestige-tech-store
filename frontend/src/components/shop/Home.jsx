import Navbar from '../../components/shared/Navbar'
import Footer from '../../components/shared/Footer'
import HeroBanner from '../../components/shop/HeroBanner'
import NewArrivals from '../../components/shop/NewArrivals'
import CategoryGrid from '../../components/shop/CategoryGrid'
import FeaturedProducts from '../../components/shop/FeaturedProducts'
import BrandStrip from '../../components/shop/BrandStrip'
import Newsletter from '../../components/shop/Newsletter'
import CartDrawer from '../../components/shop/CartDrawer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartDrawer />
      <HeroBanner />
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-12">
        <NewArrivals />
        <CategoryGrid />
        <FeaturedProducts />
        <BrandStrip />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

