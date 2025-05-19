import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({ rate, setRate }) {
  const [rating, setRating] = useState(rate);
  const [hover, setHover] = useState(0);

  function handleClick(getCurrentIndex) {
    setRating(getCurrentIndex);
    setRate(getCurrentIndex);
  }

  function handleMouseEnter(getCurrentIndex) {
    setHover(getCurrentIndex);
  }

  function handleMouseLeave() {
    setHover(rating);
  }

  return (
    <div className="flex gap-2">
      {[...Array(5)].map((_, index) => {
        index += 1;

        return (
          <FaStar
            key={index}
            className={`cursor-pointer ${index <= (hover || rating) ? "text-black" : "text-gray-300"}`}
            onClick={() => handleClick(index)}
            onMouseMove={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave()}
            size={18}
          />
        );
      })}
    </div>
  );
}