import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Recommend from "./Main/Recommend";
import MainCategory from "./Main/MainCategory";
import Jumbotron from "./Main/Jumbotron";
import SubContent from "./Main/SubContent";
import Loading from "./Layout/Loading";
import UserSection from "./User/UserSection";

function Main() {
  const location = useLocation();
  const [cateNums, setCateNums] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCateNums();
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    loading
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "");
    //eslint-disable-next-line
  }, [loading]);

  const getCateNums = () => {
    setLoading(true);
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
    setLoading(false);
  };
  return (
    <>
      {loading ? <Loading /> : null}

      <div className="mx-auto container">
        <UserSection />
        <Jumbotron />
      </div>
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
