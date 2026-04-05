import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";
import { productImageUrl } from "../utils/productImage";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [message, setMessage] = useState("");

  const parseSizes = (raw) => {
    if (!raw && raw !== 0) return [];
    if (Array.isArray(raw)) return raw.map(s => String(s));
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(s => String(s)) : [String(parsed)];
    } catch (e) {
      if (typeof raw === "string") {
        return raw.includes(",") ? raw.split(",").map((s) => s.trim()) : [raw];
      }
      return [String(raw)];
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      const sizes = parseSizes(response.data.size);
      if (sizes.length > 0) setSelectedSize(sizes[0]);
      if (response.data.color)
        setSelectedColor(response.data.color);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity,
        selected_size: selectedSize || null,
        selected_color: selectedColor || product.color || "",
      });
      refreshCartCount();
      setMessage("Added to cart");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding to cart");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-zinc-700 border-t-amber-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-zinc-400 text-center py-20">
        Product not found.{" "}
        <Link to="/products" className="text-amber-500">
          Back to shop
        </Link>
      </div>
    );
  }

  const sizes = parseSizes(product.size);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50">
          {product.image && (
            <img
              src={productImageUrl(product.image)}
              alt={product.name}
              className="w-full aspect-square object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml," +
                  encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#27272a"/></svg>'
                  );
              }}
            />
          )}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-500 mb-2">
              {product.brand}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-bold text-amber-400">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <p className="text-zinc-400 leading-relaxed">{product.description}</p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border border-zinc-800 rounded-xl p-4 bg-zinc-900/40">
            <div>
              <dt className="text-zinc-500">Shoe type</dt>
              <dd className="text-zinc-200 font-medium">{product.category}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Stock</dt>
              <dd className="text-zinc-200 font-medium">
                {product.stock_quantity} pair(s)
              </dd>
            </div>
            {product.material && (
              <div className="sm:col-span-2">
                <dt className="text-zinc-500">Upper / material</dt>
                <dd className="text-zinc-200">{product.material}</dd>
              </div>
            )}
            {product.sole_type && (
              <div className="sm:col-span-2">
                <dt className="text-zinc-500">Sole</dt>
                <dd className="text-zinc-200">{product.sole_type}</dd>
              </div>
            )}
          </dl>

          {sizes.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                US size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-amber-500/60 outline-none"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product.color && (
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">
                Colorway
              </label>
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder={product.color}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:border-amber-500/60 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-3 text-zinc-100 focus:border-amber-500/60 outline-none"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-sm ${
                message.includes("Error")
                  ? "bg-red-950/80 text-red-300 border border-red-900"
                  : "bg-emerald-950/80 text-emerald-300 border border-emerald-900"
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="w-full rounded-xl bg-amber-500 text-zinc-950 px-6 py-4 font-semibold hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
          >
            {product.stock_quantity === 0 ? "Out of stock" : "Add to cart"}
          </button>
        </div>
      </div>

      {product.recommendations && product.recommendations.length > 0 && (
        <section className="mt-16 pt-12 border-t border-zinc-800">
          <h2 className="font-display text-2xl font-bold text-zinc-100 mb-8">
            You may also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {product.recommendations.map((rec) => (
              <Link
                key={rec.id}
                to={`/products/${rec.id}`}
                className="group rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/40 hover:border-amber-500/40 transition"
              >
                {rec.image && (
                  <img
                    src={productImageUrl(rec.image)}
                    alt={rec.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml," +
                        encodeURIComponent(
                          '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="#27272a"/></svg>'
                        );
                    }}
                  />
                )}
                <div className="p-3">
                  <p className="font-semibold text-zinc-100 truncate group-hover:text-amber-400 text-sm">
                    {rec.name}
                  </p>
                  <p className="text-amber-400 font-bold">
                    ${Number(rec.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
