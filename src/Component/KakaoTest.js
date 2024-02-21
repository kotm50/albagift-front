import React from "react";
import { useNavigate } from "react-router-dom";

function KakaoTest() {
  const navi = useNavigate();

  return (
    <div className="mx-auto container">
      <button
        onClick={() => {
          navi("/joinback", {
            state: {
              promo: null,
            },
          });
        }}
        className="bg-indigo-500 text-white p-2"
      >
        일반가입
      </button>{" "}
      <button
        onClick={() => {
          navi("/joinback", {
            state: {
              promo: "SNS",
            },
          });
        }}
        className="bg-indigo-500 text-white p-2"
      >
        프로모션가입
      </button>
      <img
        src="https://api-echo-bucket.s3.ap-northeast-2.amazonaws.com/images/367b34e3-0aaa-4cc7-8b15-cb9e2305861e.jpg"
        alt="ㅇㅇㅇ"
      />
    </div>
  );
}

export default KakaoTest;
