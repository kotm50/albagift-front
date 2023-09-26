import React from "react";
import { Link } from "react-router-dom";
import UserInformation from "./UserInfomation";

function UserSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 py-3">
      <div className="bg-green-700 text-white px-2 pt-4  rounded-lg relative  flex-col justify-center  overflow-hidden hidden xl:flex group">
        <Link to="/board/write?boardId=B01" className="z-40">
          <div className="text-center xl:text-left xl:text-xl mb-1">
            면접보고 오셨어요?
          </div>
          <div className="text-center xl:text-left text-3xl xl:text-4xl mb-5 text-yellow-300 font-neoextra">
            포인트 신청하세요!
          </div>
          <div className="text-center xl:text-right relative z-40 pb-2"></div>
        </Link>
        <div className="absolute hidden xl:block top-1/2 -translate-y-1/2 left-full -translate-x-2/3 w-36 h-36 xl:h-40 xl:w-40 bg-blue-500 rounded-full z-0"></div>
      </div>
      <div className="bg-blue-500 text-white p-2">
        <Link to="/board/list?boardId=B01">포인트신청 내역</Link>
      </div>
      <div className="border p-2">
        <UserInformation />
      </div>
    </div>
  );
}

export default UserSection;
