import React from "react";

function Test() {
  return (
    <div className="w-[1000px] mx-auto">
      <h2 className="text-6xl text-center font-neoextra text-green-800 my-8">
        코리아티엠 방문예약 주문서
      </h2>
      <p className="text-lg text-center font-neo my-8 leading-7">
        코리아티엠을 방문해 주셔서 감사합니다. 방문하신 모든 분들께
        <br />
        음료와 간식을 무료로 제공해 드리고 있사오니 원하시는 메뉴를 선택해
        주세요
      </p>
      <div className="flex justify-between w-[95%] mx-auto">
        <div className="flex gap-x-2 p-2 border-b border-green-800 w-[22%]">
          <p className="text-lg text-left w-[40%]">지점명</p>
          <input type="text" className="border-0 w-full text-left" />
        </div>
        <div className="flex gap-x-2 p-2 border-b border-green-800 w-[30%]">
          <p className="text-lg text-left w-[40%]">연락처</p>
          <input type="text" className="border-0 w-full text-left" />
        </div>
        <div className="flex gap-x-2 p-2 border-b border-green-800 w-[18%]">
          <p className="text-lg text-left w-[40%]">인원</p>
          <input type="text" className="border-0 w-full text-left" />
        </div>
        <div className="flex gap-x-2 p-2 border-b border-green-800 w-[23%]">
          <p className="text-lg text-left w-[40%]">일시</p>
          <input type="text" className="border-0 w-full text-left" />
        </div>
      </div>
      <div className="w-full h-[2px] bg-green-800 my-8" />
    </div>
  );
}

export default Test;
