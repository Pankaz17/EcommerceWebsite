import { Link } from 'react-router-dom'
import { productImageUrl } from '../utils/productImage'

const NEW_DAYS = 45

function isNewDrop(createdAt) {
  if (!createdAt) return false
  const t = new Date(createdAt).getTime()
  if (Number.isNaN(t)) return false
  return Date.now() - t < NEW_DAYS * 24 * 60 * 60 * 1000
}

export default function ShoeCard({ product, bestSellerIds = null }) {
  const isBest =
    bestSellerIds &&
    typeof bestSellerIds.has === 'function' &&
    bestSellerIds.has(product.id)
  const isNew = isNewDrop(product.created_at)

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col rounded-2xl border border-zinc-700/80 bg-zinc-900/50 overflow-hidden hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
        {(isBest || isNew) && (
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
            {isBest && (
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-950">
                Best seller
              </span>
            )}
            {isNew && (
              <span className="rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                New drop
              </span>
            )}
          </div>
        )}
        {product.image && (
          <img
            src={productImageUrl(product.image)}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null
              e.target.src =
                'data:image/svg+xml,' +
                encodeURIComponent(
                  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="#27272a" width="100%" height="100%"/><text x="50%" y="50%" fill="#71717a" font-size="14" text-anchor="middle" dominant-baseline="middle">No image</text></svg>'
                )
            }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
          {product.brand || 'StrideLab'}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-zinc-500 line-clamp-1">
          {product.category}
          {product.color ? ` · ${product.color}` : ''}
        </p>
        <p className="mt-auto pt-3 font-display text-xl font-bold text-amber-400">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
