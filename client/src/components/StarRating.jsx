const StarRating = ({ rating, onChange, size = "text-xl" }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex gap-1 ${size}`}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => onChange && onChange(star)}
          className={`${onChange ? "cursor-pointer" : ""} ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
