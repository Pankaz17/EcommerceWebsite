// Frontend-only offer data (no backend/API calls)
// Import images from src/assets/images/
import dashainOffer from '../assets/images/dashainoffer.png'
import flashSale from '../assets/images/falshsale.png'
//  
import freeShiping from '../assets/images/freeshipping.png'
// import flashSale from '../assets/images/flashsale.png'

// Option 2: Use public folder paths (place images in public/images/banners/)
// Images should be in: frontend/public/images/banners/

export const offers = [
    {
        id: 1,
        title: 'Dashain Offer',
        subtitle: 'Up to 50% Off on All Abaya & Hijab',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '🎉',
        image: dashainOffer, // Using imported image from assets
    },
    {
        id: 2,
        title: 'Flash Sale',
        subtitle: 'Limited Time: 30% Off Pakistani Suits',
        backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        emoji: '⚡',
        image: flashSale, // Public folder path
        // image: flashSale, // Use this if importing from assets
    },
    {
        id: 3,
        title: 'New Arrivals',
        subtitle: 'Get 20% Off on Latest Hijab Collection',
        backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        emoji: '✨',
        image: freeShiping, // Empty - will show bg color + emoji only
    },
    // {
    //     id: 4,
    //     title: 'Student Discount',
    //     subtitle: 'Extra 15% Off with Student ID',
    //     backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    //     emoji: '🎓',
    //     image: '/images/banners/student-discount.jpg', // Public folder path
    //     // image: studentDiscount, // Use this if importing from assets
    // },
    // {
    //     id: 5,
    //     title: 'Free Shipping',
    //     subtitle: 'On Orders Over $100 - Shop Now!',
    //     backgroundColor: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    //     emoji: '🚚',
    //     image: '', // Empty - will show bg color + emoji only
    // },
]
