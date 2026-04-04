import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * eSewa v2 may redirect with the payment response in the URL fragment (#data=...).
 * The fragment is never sent to the server, so we must read it here and forward
 * to the backend via a full redirect (so the backend receives ?data=... in the query).
 */
const EsewaCallback = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    // 1) Payload might be in query (if eSewa sends as ?data=...)
    const dataFromQuery = searchParams.get('data') || searchParams.get('ref') || searchParams.get('response') || searchParams.get('payload')
    if (dataFromQuery && orderId) {
      redirectToBackend(orderId, dataFromQuery)
      return
    }

    // 2) Payload might be in the hash (#data=... or #key=value&data=... or just #base64)
    const hash = window.location.hash
    if (hash) {
      const withoutHash = hash.slice(1)
      let payload = null
      if (withoutHash.includes('=')) {
        const params = new URLSearchParams(withoutHash)
        payload = params.get('data') || params.get('ref') || params.get('response') || params.get('payload')
      }
      if (!payload && /^[A-Za-z0-9+/=_-]+$/.test(withoutHash) && withoutHash.length > 50) {
        payload = withoutHash
      }
      if (payload && orderId) {
        redirectToBackend(orderId, payload)
        return
      }
    }

    // 3) No payload found – redirect to failure (e.g. user landed here without completing payment)
    const failureUrl = `/payment/esewa/failure?order_id=${orderId || ''}&message=${encodeURIComponent('No payment data received from eSewa.')}`
    window.location.replace(failureUrl)
  }, [searchParams, orderId])

  function redirectToBackend(orderId, data) {
    // Same-origin /api is proxied to backend; backend will verify and redirect to success/failure page
    const backendSuccessUrl = `${window.location.origin}/api/payment/esewa/success?order_id=${encodeURIComponent(orderId)}&data=${encodeURIComponent(data)}`
    window.location.replace(backendSuccessUrl)
  }

  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <p className="text-gray-600">Processing your payment...</p>
      <div className="mt-4 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-700 border-t-amber-500" />
      </div>
    </div>
  )
}

export default EsewaCallback
