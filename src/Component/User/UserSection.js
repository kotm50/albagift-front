import React from "react";
import { Link } from "react-router-dom";
import UserInformation from "./UserInfomation";

import coin from "../../Asset/coin.png";
import calendar from "../../Asset/calendar.png";
function UserSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 py-3">
      <div className="bg-green-700 text-white px-2 pt-4  xl:rounded-lg relative  flex-col justify-center overflow-hidden  group hidden xl:flex">
        <Link to="/board/write?boardId=B02" className="z-40">
          <div className="text-left xl:text-xl mb-1">면접보고 오셨어요?</div>
          <div className="text-left text-3xl xl:text-4xl mb-5 text-yellow-300 font-neoextra">
            포인트 신청하세요!
          </div>
        </Link>
        <img
          src={coin}
          className="w-20 h-auto xl:w-36 absolute -right-3 xl:right-2 top-1/2 -translate-y-1/2 z-50 drop-shadow-lg hover:scale-110 transition-all duration-150"
          alt="코인"
        />
        <div className="absolute hidden xl:block top-1/2 -translate-y-1/2 right-0 translate-x-1/3 w-40 h-40 xl:h-48 xl:w-48 bg-violet-500 rounded-full z-0"></div>
      </div>
      <div className="bg-violet-500 text-white px-2 pt-4 relative  flex-col justify-center overflow-hidden  group xl:rounded-lg hidden xl:flex">
        <Link to="/mypage/payhistory">
          <div className="text-left xl:text-xl mb-1">포인트 신청 하셨나요?</div>
          <div className="text-left text-3xl xl:text-4xl mb-5 text-yellow-300 font-neoextra">
            신청기록 확인
          </div>
        </Link>
        <img
          src={calendar}
          className="w-20 h-auto xl:w-36 absolute -right-0 xl:right-2 top-1/2 -translate-y-1/2 z-50 drop-shadow-lg hover:scale-110 transition-all duration-150"
          alt="출석체크"
        />
        <div className="absolute hidden xl:block top-1/2 -translate-y-1/2 right-0 translate-x-1/3 w-40 h-40 xl:h-48 xl:w-48 bg-white rounded-full z-0"></div>
      </div>
      <div className="border p-2">
        <UserInformation />
      </div>

      <div className="bg-green-700 text-white px-2 pt-4  xl:rounded-lg relative  flex-col justify-center overflow-hidden flex group xl:hidden">
        <Link to="/board/write?boardId=B02" className="z-40">
          <div className="text-left xl:text-xl mb-1">면접보고 오셨어요?</div>
          <div className="text-left text-3xl xl:text-4xl mb-5 text-yellow-300 font-neoextra">
            포인트 신청하세요!
          </div>
        </Link>
        <img
          src={coin}
          className="w-20 h-auto xl:w-36 absolute -right-3 xl:right-2 top-1/2 -translate-y-1/2 z-50 drop-shadow-lg hover:scale-110 transition-all duration-150"
          alt="코인"
        />
        <div className="absolute hidden xl:block top-1/2 -translate-y-1/2 right-0 translate-x-1/3 w-40 h-40 xl:h-48 xl:w-48 bg-violet-500 rounded-full z-0"></div>
      </div>
      <div className="bg-violet-500 text-white px-2 pt-4 relative  flex-col justify-center overflow-hidden flex group xl:rounded-lg  xl:hidden">
        <Link to="/mypage/payhistory">
          <div className="text-left xl:text-xl mb-1">포인트 신청 하셨나요?</div>
          <div className="text-left text-3xl xl:text-4xl mb-5 text-yellow-300 font-neoextra">
            신청기록 확인
          </div>
        </Link>
        <img
          src={calendar}
          className="w-20 h-auto xl:w-36 absolute -right-0 xl:right-2 top-1/2 -translate-y-1/2 z-50 drop-shadow-lg hover:scale-110 transition-all duration-150"
          alt="출석체크"
        />
        <div className="absolute hidden xl:block top-1/2 -translate-y-1/2 right-0 translate-x-1/3 w-40 h-40 xl:h-48 xl:w-48 bg-white rounded-full z-0"></div>
      </div>
    </div>
  );
}

export default UserSection;
