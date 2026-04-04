// Frontend-only promo carousel (no API). Images load from Laravel public via VITE_API_ORIGIN (see productImageUrl).

const heroPath = '/images/placeholders/shoe-sneakers.svg'

export const promoSlides = [
  {
    id: 1,
    title: 'New Drop — Carbon Runners',
    subtitle: 'Race-day stack foam + plate tech. Limited sizes online.',
    backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #7c3aed 55%, #f97316 100%)',
    image: heroPath,
  },
  {
    id: 2,
    title: 'Street Season',
    subtitle: 'Chunky soles & bold color. Build your rotation.',
    backgroundColor: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)',
    image: '/images/placeholders/shoe-running.svg',
  },
  {
    id: 3,
    title: 'Trail & Boot Drop',
    subtitle: 'Grip that holds on gravel, mud, and wet pavement.',
    backgroundColor: 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',
    image: '/images/placeholders/shoe-boots.svg',
  },
]
