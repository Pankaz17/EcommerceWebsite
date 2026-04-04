import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const EsewaSuccess = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const refId = searchParams.get('refId')

  useEffect(() => {
    // In a real app, you might refetch the order/payment status here
  }, [])

  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful
      </h1>
      <p className="text-gray-700 mb-2">
        Your eSewa sandbox payment has been completed successfully.
      </p>
      {refId && (
        <p className="text-sm text-gray-500 mb-4">
          Transaction Reference: <span className="font-mono">{refId}</span>
        </p>
      )}
      {orderId && (
        <Link
          to={`/orders/${orderId}`}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400"
        >
          View Order Details
        </Link>
      )}
      {!orderId && (
        <Link
          to="/orders"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400"
        >
          Go to My Orders
        </Link>
      )}
    </div>
  )
}

export default EsewaSuccess

