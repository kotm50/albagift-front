import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

import { FaUser, FaTicketAlt, FaCoins, FaList } from "react-icons/fa";
import { Helmet } from "react-helmet";

function Mypage() {
  const [title, setTitle] = useState("");
  return (
    <>
      <Helmet>
        <title>마이페이지 | 알바선물</title>
      </Helmet>
      <div className="container mx-auto grid grid-cols-1 h-full ">
        <div
          id="touch-target"
          className="container mx-auto flex flex-row flex-nowrap overflow-x-auto giftCategoryMenu gap-3 xl:justify-center"
        >
          <Link
            to="/mypage/pwdchk"
            className="p-4 text-center bg-blue-50 rounded-lg flex flex-col justify-center gap-2 group hover:text-indigo-500"
            onClick={e => setTitle("개인정보수정")}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
              <FaUser className="mx-auto" size={36} />
            </div>
            <span className="text-sm">개인정보수정</span>
          </Link>
          <Link
            to="/mypage/coupon"
            className="p-4 text-center bg-blue-50 rounded-lg flex flex-col justify-center gap-2 group hover:text-indigo-500"
            onClick={e => setTitle("보유쿠폰확인")}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
              <FaTicketAlt className="mx-auto" size={36} />
            </div>
            <span className="text-sm">보유쿠폰확인</span>
          </Link>
          <Link
            to="/mypage/pwdchk"
            className="p-4 text-center bg-blue-50 rounded-lg flex flex-col justify-center gap-2 group hover:text-indigo-500"
            onClick={e => {
              e.preventDefault();
              alert("죄송합니다. 해당 기능은 현재 준비중입니다 🙏");
            }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
              <FaCoins className="mx-auto" size={36} />
            </div>
            <span className="text-sm">포인트내역</span>
          </Link>
          <Link
            to="/mypage/payhistory"
            className="p-4 text-center bg-blue-50 rounded-lg flex flex-col justify-center gap-2 group hover:text-indigo-500"
            onClick={e => setTitle("지급신청내역")}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
              <FaList className="mx-auto" size={36} />
            </div>
            <span className="text-sm">지급신청내역</span>
          </Link>
        </div>
        {title !== "" ? (
          <h2 className="text-3xl font-neoextra py-2">{title}</h2>
        ) : null}

        <Outlet />
      </div>
    </>
  );
}

export default Mypage;
