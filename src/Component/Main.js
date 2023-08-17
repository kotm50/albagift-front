import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Recommend from "./Main/Recommend";
import MainCategory from "./Main/MainCategory";
import Jumbotron from "./Main/Jumbotron";
import SubContent from "./Main/SubContent";

function Main() {
  const location = useLocation();
  const [cateNums, setCateNums] = useState("");
  useEffect(() => {
    getCateNums();
    //eslint-disable-next-line
  }, [location]);

  const getCateNums = () => {
    const numberOfRandomNumbers = 2;
    const excludedNumber = 8;

    const random = [];
    const goods = new Array(numberOfRandomNumbers);

    while (random.length < numberOfRandomNumbers) {
      let randomNumber = Math.floor(Math.random() * 6) + 2;

      if (randomNumber !== excludedNumber && !random.includes(randomNumber)) {
        random.push(Number(randomNumber));
      }
    }

    for (let i = 0; i < numberOfRandomNumbers; i++) {
      goods[i] = random[i];
    }
    setCateNums(random);
  };
  return (
    <>
      <Jumbotron />
      <SubContent />
      <MainCategory />
      {cateNums.length > 0 && (
        <>
          <Recommend category={1} />
          <Recommend category={cateNums[1]} />
        </>
      )}
    </>
  );
}

export default Main;
