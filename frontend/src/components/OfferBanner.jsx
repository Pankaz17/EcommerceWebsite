import { useState, useEffect } from "react";
import { offers } from "../helpers/db";

const OfferBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState({});

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleImageError = (offerId) => {
    setImageError((prev) => ({ ...prev, [offerId]: true }));
  };

  const currentOffer = offers[currentIndex];
  const hasValidImage =
    currentOffer.image &&
    currentOffer.image.trim() !== "" &&
    !imageError[currentOffer.id];

  return (
    <div
      className="relative w-full mb-6 rounded-xl overflow-hidden shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      {/* Banner Content */}
      <div
        className="relative px-6 py-8 md:px-12 md:py-10 text-white transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          // Only show bg color if no image, or make it almost invisible if image exists
          background: hasValidImage
            ? "transparent"
            : currentOffer.backgroundColor,
        }}>
        {/* Background Image (if available and valid) */}
        {hasValidImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={currentOffer.image}
              alt={currentOffer.title}
              className="w-full h-full object-cover"
              onError={() => handleImageError(currentOffer.id)}
            />
            {/* Very subtle overlay (almost invisible) to ensure text readability without covering image */}
            <div
              className="absolute inset-0"
              style={{
                background: currentOffer.backgroundColor,
                opacity: 0.05, // Almost invisible - just enough for text contrast if needed
              }}
            />
          </div>
        )}

        {/* Content Layer (always on top) */}
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          {/* Left: Offer Content with Emoji */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="text-4xl md:text-5xl flex-shrink-0 drop-shadow-lg">
              {/* {currentOffer.emoji} */}
            </div>
            <div className="min-w-0">
              <h3 className="text-xl md:text-2xl font-bold mb-1 drop-shadow-md">
                {/* {currentOffer.title} */}
              </h3>
              <p className="text-sm md:text-base opacity-90 drop-shadow-sm">
                {/* {currentOffer.subtitle} */}
              </p>
            </div>
          </div>

          {/* Right: Shop Now Button */}
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-200 border border-white/30 drop-shadow-md">
            Shop Now →
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferBanner;
