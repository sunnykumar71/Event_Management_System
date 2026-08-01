// Product image utility - Alternative approach using UI Avatars and colored placeholders
// This generates professional-looking images with product initials and category-based colors

// Color schemes for different product categories
const categoryColors = {
  cake: { bg: 'FF6B6B', text: 'FFFFFF' },        // Red - Cakes
  flower: { bg: '4ECDC4', text: 'FFFFFF' },      // Teal - Flowers
  photo: { bg: '45B7D1', text: 'FFFFFF' },       // Blue - Photography
  venue: { bg: '96CEB4', text: 'FFFFFF' },       // Green - Venue
  catering: { bg: 'FFEAA7', text: '2D3436' },    // Yellow - Catering
  music: { bg: 'DDA0DD', text: 'FFFFFF' },        // Purple - Music
  lighting: { bg: 'FDCB6E', text: '2D3436' },    // Orange - Lighting
  transport: { bg: '74B9FF', text: 'FFFFFF' },  // Light Blue - Transport
  invitation: { bg: 'A29BFE', text: 'FFFFFF' },  // Lavender - Invitations
  gift: { bg: 'FD79A8', text: 'FFFFFF' },        // Pink - Gifts
  jewelry: { bg: 'FDCB6E', text: '2D3436' },    // Gold - Jewelry
  beauty: { bg: 'E17055', text: 'FFFFFF' },      // Coral - Beauty
  furniture: { bg: '636E72', text: 'FFFFFF' },   // Gray - Furniture
  drink: { bg: '00B894', text: 'FFFFFF' },      // Mint - Drinks
  dress: { bg: 'E84393', text: 'FFFFFF' },       // Magenta - Dresses
  default: { bg: '6C5CE7', text: 'FFFFFF' }     // Purple - Default
}

// Get initials from product name (up to 2 characters)
const getInitials = (name) => {
  if (!name) return 'PR'
  const words = name.split(' ').filter(word => word.length > 0)
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase()
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}

// Determine category from product name
const getCategory = (name) => {
  if (!name) return 'default'
  const lowerName = name.toLowerCase()
  
  if (lowerName.includes('cake') || lowerName.includes('cupcake') || lowerName.includes('pastry') || lowerName.includes('bakery') || lowerName.includes('dessert')) return 'cake'
  if (lowerName.includes('flower') || lowerName.includes('bouquet') || lowerName.includes('floral') || lowerName.includes('rose') || lowerName.includes('lily') || lowerName.includes('tulip') || lowerName.includes('bloom')) return 'flower'
  if (lowerName.includes('photo') || lowerName.includes('camera') || lowerName.includes('video') || lowerName.includes('videography') || lowerName.includes('shoot')) return 'photo'
  if (lowerName.includes('venue') || lowerName.includes('hall') || lowerName.includes('decoration') || lowerName.includes('decor') || lowerName.includes('stage')) return 'venue'
  if (lowerName.includes('catering') || lowerName.includes('food') || lowerName.includes('meal') || lowerName.includes('dinner') || lowerName.includes('lunch') || lowerName.includes('buffet') || lowerName.includes('cuisine')) return 'catering'
  if (lowerName.includes('dj') || lowerName.includes('music') || lowerName.includes('band') || lowerName.includes('sound') || lowerName.includes('singer') || lowerName.includes('entertainment')) return 'music'
  if (lowerName.includes('light') || lowerName.includes('lighting') || lowerName.includes('lamp')) return 'lighting'
  if (lowerName.includes('car') || lowerName.includes('limo') || lowerName.includes('transport') || lowerName.includes('vehicle') || lowerName.includes('ride')) return 'transport'
  if (lowerName.includes('invitation') || lowerName.includes('card') || lowerName.includes('stationery') || lowerName.includes('invite')) return 'invitation'
  if (lowerName.includes('gift') || lowerName.includes('favor') || lowerName.includes('present')) return 'gift'
  if (lowerName.includes('jewelry') || lowerName.includes('ring') || lowerName.includes('necklace') || lowerName.includes('accessory') || lowerName.includes('earring') || lowerName.includes('bracelet')) return 'jewelry'
  if (lowerName.includes('hair') || lowerName.includes('makeup') || lowerName.includes('beauty') || lowerName.includes('salon') || lowerName.includes('bridal-makeup')) return 'beauty'
  if (lowerName.includes('chair') || lowerName.includes('table') || lowerName.includes('furniture') || lowerName.includes('rental') || lowerName.includes('seating')) return 'furniture'
  if (lowerName.includes('drink') || lowerName.includes('beverage') || lowerName.includes('bar') || lowerName.includes('wine') || lowerName.includes('cocktail') || lowerName.includes('champagne') || lowerName.includes('alcohol')) return 'drink'
  if (lowerName.includes('dress') || lowerName.includes('suit') || lowerName.includes('cloth') || lowerName.includes('attire') || lowerName.includes('outfit') || lowerName.includes('gown') || lowerName.includes('tuxedo')) return 'dress'
  
  return 'default'
}

// Get product image URL using UI Avatars
export const getProductImage = (productName, index = 0) => {
  if (!productName) return getDefaultProductImage(index)
  
  const category = getCategory(productName)
  const colors = categoryColors[category] || categoryColors.default
  const initials = getInitials(productName)
  const fontSize = initials.length === 1 ? '0.6' : '0.5'
  
  // Using UI Avatars to generate professional initials-based images
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${colors.bg}&color=${colors.text}&size=400&font-size=${fontSize}&length=2&rounded=false&bold=true`
}

// Get default product image
export const getDefaultProductImage = () => {
  const colors = categoryColors.default
  return `https://ui-avatars.com/api/?name=PR&background=${colors.bg}&color=${colors.text}&size=400&font-size=0.5&length=2&rounded=false&bold=true`
}

// Alternative: Get product image using placehold.co with text
export const getProductImageWithText = (productName) => {
  if (!productName) {
    const colors = categoryColors.default
    return `https://placehold.co/400x300/${colors.bg}/${colors.text}?text=Product`
  }
  
  const category = getCategory(productName)
  const colors = categoryColors[category] || categoryColors.default
  const shortName = productName.length > 15 ? productName.substring(0, 15) + '...' : productName
  
  // Using placehold.co to generate images with product name text
  return `https://placehold.co/400x300/${colors.bg}/${colors.text}?text=${encodeURIComponent(shortName)}`
}

// Export individual category getters for specific use cases
export const getCakeImage = (index = 0) => getProductImage('wedding cake', index)
export const getFlowerImage = (index = 0) => getProductImage('flower bouquet', index)
export const getPhotoImage = (index = 0) => getProductImage('photography', index)
export const getVenueImage = (index = 0) => getProductImage('venue', index)
export const getCateringImage = (index = 0) => getProductImage('catering', index)
export const getMusicImage = (index = 0) => getProductImage('dj', index)
export const getLightingImage = (index = 0) => getProductImage('lighting', index)
export const getTransportImage = (index = 0) => getProductImage('car', index)
export const getInvitationImage = (index = 0) => getProductImage('invitation', index)
export const getGiftImage = (index = 0) => getProductImage('gift', index)
export const getJewelryImage = (index = 0) => getProductImage('jewelry', index)
export const getBeautyImage = (index = 0) => getProductImage('makeup', index)
export const getFurnitureImage = (index = 0) => getProductImage('chair', index)
export const getDrinkImage = (index = 0) => getProductImage('drink', index)
export const getDressImage = (index = 0) => getProductImage('dress', index)

export default getProductImage
