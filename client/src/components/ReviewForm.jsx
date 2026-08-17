import { useState } from "react";
import StarRating from "./StarRating";
import api from "../api/axios";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("rating", rating);
      formData.append("text", text);
      if (image) formData.append("image", image);

      const { data } = await api.post(`/products/${productId}/reviews`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onReviewAdded(data);
      setText("");
      setRating(5);
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="font-semibold mb-2">Write a review</h3>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="mb-3">
        <StarRating rating={rating} onChange={setRating} />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your thoughts about this product..."
        className="w-full border rounded p-2 mb-3"
        rows={3}
        required
      />
      <div className="mb-3">
        <label className="text-sm text-gray-600 block mb-1">
          Add a photo (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
