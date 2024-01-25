import React from "react";

function Content1() {
  return (
    <>
      <div className="fixed w-full max-w-[1000px] h-screen overflow-auto top-0 left-1/2 -translate-x-1/2 bg-white z-10 border">
        <div className="w-full px-4 py-8 lg:px-10 lg:py-20 bg-[#1a60fe] text-white flex flex-col justify-center gap-y-2 lg:gap-y-5">
          <div className="pplight text-xl lg:text-7xl">나한테 딱 맞는</div>
          <div className="ppbold text-3xl lg:text-8xl">추천 직업 확인하고</div>
          <div className="ppbold text-3xl lg:text-8xl">커피 쿠폰 받아가기</div>
        </div>
      </div>
    </>
  );
}

export default Content1;
