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
    </div>
  );
}

export default KakaoTest;
