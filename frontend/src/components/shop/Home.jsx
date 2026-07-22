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
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <CartDrawer />
      <HeroBanner />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
        <NewArrivals />
        <CategoryGrid />
        <FeaturedProducts />
        <BrandStrip />
        <Newsletter />
      </div>
      <Footer />
    </div>
  )
}