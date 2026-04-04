import { useSearchParams, Link } from 'react-router-dom'

const EsewaFailure = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const message = searchParams.get('message')

  return (
    <div className="max-w-xl mx-auto text-center py-12">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Payment Failed
      </h1>
      <p className="text-gray-700 mb-2">
        Your eSewa sandbox payment was not completed.
      </p>
      {message && (
        <p className="text-sm text-gray-500 mb-4">
          Reason: {message}
        </p>
      )}
      {orderId && (
        <p className="text-sm text-gray-500 mb-4">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <div className="flex justify-center gap-4 mt-4">
        <Link
          to="/cart"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-400"
        >
          Try Again
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default EsewaFailure

