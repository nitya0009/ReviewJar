import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { resolveImageUrl } from "../api/config";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const ProductCard = ({ product, wishlist, onWishlistChange }) => {
  const { userInfo } = useAuth();
  const inWishlist = wishlist?.some((id) => id === product._id);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) return;
    try {
      const { data } = await api.put(`/products/${product._id}/wishlist`);
      onWishlistChange && onWishlistChange(data.wishlist);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col relative"
    >
      {userInfo && (
        <button
          onClick={handleWishlistClick}
          className={`absolute top-6 right-6 text-xl ${
            inWishlist ? "text-red-500" : "text-gray-300"
          } hover:text-red-500`}
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {inWishlist ? "♥" : "♡"}
        </button>
      )}
      <img
        src={resolveImageUrl(product.image)}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h3 className="font-semibold text-lg pr-6">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={Math.round(product.avgRating)} size="text-sm" />
        <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
      </div>
      <p className="font-bold text-primary">${product.price?.toFixed(2)}</p>
    </Link>
  );
};

export default ProductCard;
