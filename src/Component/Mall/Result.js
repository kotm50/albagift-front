import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Result() {
  const location = useLocation();
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
    // location이 바뀔 때마다 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    if (timer === 0) {
      navi("/mypage/coupon");
    }
    //eslint-disable-next-line
  }, [timer]);

  return (
    <div>
      <h1 className="text-center text-xl lg:text-4xl font-medium mt-4">
        구매가 완료되었습니다.
        <br className="block lg:hidden" /> 이용해주셔서 감사합니다.
      </h1>
      <div className="countainer mx-auto bg-indigo-50 p-4 mt-2 lg:mt-5 rounded-lg">
        <div className="lg:text-lg text-center">
          <strong className="text-rose-500 text-xl lg:text-2xl">{timer}</strong>{" "}
          초 후 쿠폰리스트로 이동합니다
        </div>
      </div>
    </div>
  );
}

export default Result;
