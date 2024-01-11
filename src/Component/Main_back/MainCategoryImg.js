import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import coffee from "../../Asset/mainCategory/coffee.png";
import donut from "../../Asset/mainCategory/donut.png";
import icecream from "../../Asset/mainCategory/icecream.png";
import conv from "../../Asset/mainCategory/conv.png";
import pizza from "../../Asset/mainCategory/pizza.png";
import dinner from "../../Asset/mainCategory/dinner.png";
import movie from "../../Asset/mainCategory/movie.png";
import cosmetic from "../../Asset/mainCategory/cosmetic.png";
import baby from "../../Asset/mainCategory/baby.png";

function MainCategoryImg(props) {
  const location = useLocation();
  const [img, setImg] = useState("");

  useEffect(() => {
    if (props.cat >= 1 && props.cat <= 10) {
      const imagesArray = [
        coffee,
        donut,
        icecream,
        conv,
        pizza,
        dinner,
        movie,
        "",
        cosmetic,
        baby,
      ];

      const imgToSet = imagesArray[props.cat - 1];
      setImg(imgToSet);
    }
    //eslint-disable-next-line
  }, [location]);
  return (
    <img src={img} alt={props.txt} className="w-12 h-auto max-w-full mx-auto" />
  );
}

export default MainCategoryImg;
