import { useEffect, useState } from "react";
import { IconStar } from "../icon";

const StarRating = ({ preview = true, rate, setRate }) => {
  const [rating, setRating] = useState(parseInt(rate));
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(parseInt(rate));
  }, [rate])

  const handleClick = (getCurrentIndex) => {
    if (preview) 
      return;

    setRating(getCurrentIndex);
    setRate(getCurrentIndex);
  }

  const handleMouseEnter = (getCurrentIndex) => {
    if (preview) 
      return;

    setHover(getCurrentIndex);
  }

  const handleMouseLeave = () => {
    if (preview) 
      return;
    
    setHover(rating);
  }

  return (
    <div className="flex gap-2">
      {[...Array(5)].map((_, index) => {
        index += 1;

        return (
          <IconStar
            key={index}
            className={`text-black ${preview ? "cursor-default" : "cursor-pointer"}`}
            filled={index <= (hover || rating)}
            onClick={() => handleClick(index)}
            onMouseMove={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave()}
          />
        );
      })}
    </div>
  );


};

export default StarRating;