import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Result() {
  let navi = useNavigate();
  const [timer, setTimer] = useState(3);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(intervalId);
          return prevTimer - 1;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (timer === 0) {
      navi("/mypage/coupon");
    }
    //eslint-disable-next-line
  }, [timer]);

  return (
    <div>
      <h1 className="text-center text-xl xl:text-4xl font-medium mt-4">
        구매가 완료되었습니다.
        <br className="block xl:hidden" /> 이용해주셔서 감사합니다.
      </h1>
      <div className="countainer mx-auto bg-indigo-50 p-4 mt-2 xl:mt-5 rounded-lg">
        <div className="xl:text-lg text-center">
          <strong className="text-rose-500 text-xl xl:text-2xl">{timer}</strong>{" "}
          초 후 쿠폰리스트로 이동합니다
        </div>
      </div>
    </div>
  );
}

export default Result;
