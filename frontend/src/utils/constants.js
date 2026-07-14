export const CATEGORIES = [
  { name: 'Laptops', slug: 'laptops', icon: '💻', color: 'from-blue-600 to-blue-800' },
  { name: 'Smartphones', slug: 'smartphones', icon: '📱', color: 'from-green-600 to-green-800' },
  { name: 'Monitors', slug: 'monitors', icon: '🖥️', color: 'from-purple-600 to-purple-800' },
  { name: 'Cameras', slug: 'cameras', icon: '📷', color: 'from-red-600 to-red-800' },
  { name: 'Tablets', slug: 'tablets', icon: '📟', color: 'from-yellow-600 to-yellow-800' },
  { name: 'Headphones', slug: 'headphones', icon: '🎧', color: 'from-pink-600 to-pink-800' },
  { name: 'Smartwatches', slug: 'smartwatches', icon: '⌚', color: 'from-teal-600 to-teal-800' },
  { name: 'Power Banks', slug: 'power-banks', icon: '🔋', color: 'from-lime-600 to-lime-800' },
  { name: 'Accessories', slug: 'accessories', icon: '🖱️', color: 'from-orange-600 to-orange-800' },
  { name: 'Networking', slug: 'networking', icon: '📡', color: 'from-cyan-600 to-cyan-800' },
  { name: 'Storage', slug: 'storage', icon: '💾', color: 'from-violet-600 to-violet-800' },
  { name: 'Gaming', slug: 'gaming', icon: '🎮', color: 'from-indigo-600 to-indigo-800' },
]
export const BRANDS = [
  'Apple', 'Samsung', 'HP', 'Dell', 'Lenovo',
  'Sony', 'LG', 'Asus', 'Acer', 'Microsoft',
  'Canon', 'Nikon', 'DJI', 'Bose', 'JBL',
  'Logitech', 'Anker', 'Xiaomi', 'Tecno', 'Infinix'
]

export const HERO_SLIDES = [
  {
    id: 1,
    title: 'Latest MacBook Pro M4',
    subtitle: 'Unleash the power of Apple Silicon',
    description: 'The most powerful MacBook Pro ever. Now available in Uganda.',
    cta: 'Shop Now',
    badge: 'New Arrival',
    color: 'from-blue-900 to-gray-900',
    icon: '💻',
  },
  {
    id: 2,
    title: 'Samsung Galaxy S25 Ultra',
    subtitle: "Uganda's best smartphone deal",
    description: 'The ultimate Android experience. Pay with MTN MoMo or Airtel.',
    cta: 'View Deal',
    badge: 'Hot Deal',
    color: 'from-purple-900 to-blue-900',
    icon: '📱',
  },
  {
    id: 3,
    title: 'DJI Mini 4 Pro Drone',
    subtitle: 'Capture Uganda from above',
    description: '4K video, 34min flight time, obstacle sensing.',
    cta: 'Explore',
    badge: 'Popular',
    color: 'from-green-900 to-teal-900',
    icon: '🚁',
  },
  {
    id: 4,
    title: 'Pay with Mobile Money',
    subtitle: 'MTN MoMo and Airtel Money accepted',
    description: 'Shop securely and conveniently with Uganda\'s most trusted payment methods.',
    cta: 'Start Shopping',
    badge: 'Secure',
    color: 'from-yellow-900 to-orange-900',
    icon: '💰',
  },
]

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
]

export const LOYALTY_TIERS = {
  BRONZE: { label: 'Bronze', color: 'text-orange-400', min: 0, max: 999 },
  SILVER: { label: 'Silver', color: 'text-gray-400', min: 1000, max: 4999 },
  GOLD: { label: 'Gold', color: 'text-yellow-400', min: 5000, max: 14999 },
  PLATINUM: { label: 'Platinum', color: 'text-blue-400', min: 15000, max: Infinity },
}