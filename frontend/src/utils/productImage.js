const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN || 'http://127.0.0.1:8000'

const STORAGE_BASE =
  import.meta.env.VITE_STORAGE_BASE || `${API_ORIGIN.replace(/\/$/, '')}/storage`

/**
 * Resolve product image for <img src>.
 * - Full http(s) URLs: used as-is (legacy / external).
 * - Paths starting with /: served from Laravel public (e.g. /images/placeholders/...) — must use API origin because the Vite dev server is a different host than :8000.
 * - Otherwise: storage path (uploads), e.g. products/abc.jpg → …/storage/products/abc.jpg
 */
export function productImageUrl(image) {
  if (!image) return ''
  const s = String(image).trim()
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('/')) {
    return `${API_ORIGIN.replace(/\/$/, '')}${s}`
  }
  const path = s.replace(/^\//, '')
  return `${STORAGE_BASE.replace(/\/$/, '')}/${path}`
}
