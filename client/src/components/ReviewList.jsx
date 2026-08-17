import { useState } from "react";
import StarRating from "./StarRating";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../api/config";

const ReviewList = ({ reviews, setReviews, sort, setSort }) => {
  const { userInfo } = useAuth();
  const [error, setError] = useState("");

  const handleHelpful = async (id) => {
    try {
      const { data } = await api.put(`/reviews/${id}/helpful`);
      setReviews((prev) => prev.map((r) => (r._id === id ? { ...r, ...data } : r)));
    } catch (err) {
      setError(err.response?.data?.message || "Could not vote");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Reviews ({reviews.length})</h3>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded p-1 text-sm"
        >
          <option value="recent">Most Recent</option>
          <option value="rating">Highest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {reviews.length === 0 && <p className="text-gray-500">No reviews yet. Be the first!</p>}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{review.user?.name || "User"}</p>
                  {review.verifiedPurchase && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
                <StarRating rating={review.rating} size="text-sm" />
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{review.text}</p>
            {review.image && (
              <img
                src={resolveImageUrl(review.image)}
                alt="review"
                className="mt-3 w-32 h-32 object-cover rounded border"
              />
            )}
            <div className="flex items-center gap-4 mt-3 text-sm">
              <button onClick={() => handleHelpful(review._id)} className="text-primary hover:underline">
                👍 Helpful ({review.helpfulVotes})
              </button>
              {userInfo &&
                (userInfo._id === review.user?._id || userInfo.role === "admin") && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
