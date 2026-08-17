import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../api/config";

const ProductDetail = () => {
  const { id } = useParams();
  const { userInfo, updateUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [purchaseMsg, setPurchaseMsg] = useState("");

  const wishlist = (userInfo?.wishlist || []).map((w) => (typeof w === "string" ? w : w._id));
  const purchased = (userInfo?.purchasedProducts || []).map((p) =>
    typeof p === "string" ? p : p._id
  );
  const inWishlist = wishlist.includes(id);
  const hasPurchased = purchased.includes(id);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError("Product not found");
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/products/${id}/reviews`, { params: { sort } });
      setReviews(data);
    } catch (err) {
      setError("Could not load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [id, sort]);

  const handleWishlistToggle = async () => {
    try {
      const { data } = await api.put(`/products/${id}/wishlist`);
      updateUser({ wishlist: data.wishlist });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkPurchased = async () => {
    try {
      const { data } = await api.post(`/products/${id}/purchase`);
      updateUser({ purchasedProducts: data.purchasedProducts });
      setPurchaseMsg("Marked as purchased! You can now leave a verified review.");
    } catch (err) {
      setPurchaseMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  const userHasReviewed = reviews.some((r) => r.user?._id === userInfo?._id);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error && !product) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={resolveImageUrl(product.image)}
          alt={product.name}
          className="w-full md:w-64 h-48 object-cover rounded"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-gray-500 mb-2">{product.category}</p>
            </div>
            {userInfo && (
              <button
                onClick={handleWishlistToggle}
                className={`text-2xl ${inWishlist ? "text-red-500" : "text-gray-300"} hover:text-red-500`}
                title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {inWishlist ? "♥" : "♡"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={Math.round(product.avgRating)} />
            <span className="text-sm text-gray-500">
              {product.avgRating} ({product.numReviews} reviews)
            </span>
          </div>
          <p className="text-gray-700 mb-3">{product.description}</p>
          <p className="text-xl font-bold text-primary mb-3">${product.price?.toFixed(2)}</p>

          {userInfo && (
            <div>
              {hasPurchased ? (
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  ✓ You own this (demo)
                </span>
              ) : (
                <button
                  onClick={handleMarkPurchased}
                  className="text-sm border border-primary text-primary px-3 py-1 rounded hover:bg-primary hover:text-white transition"
                >
                  Mark as Purchased (Demo)
                </button>
              )}
              {purchaseMsg && <p className="text-xs text-gray-500 mt-2">{purchaseMsg}</p>}
            </div>
          )}
        </div>
      </div>

      {userInfo && !userHasReviewed && (
        <ReviewForm
          productId={id}
          onReviewAdded={(newReview) => {
            setReviews((prev) => [newReview, ...prev]);
            fetchProduct();
          }}
        />
      )}
      {!userInfo && (
        <p className="text-sm text-gray-500 mb-6">Please log in to write a review.</p>
      )}

      <ReviewList reviews={reviews} setReviews={setReviews} sort={sort} setSort={setSort} />
    </div>
  );
};

export default ProductDetail;
