import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

import { Helmet } from "react-helmet";

import list from "../../Asset/mypage/list.png";
import user from "../../Asset/mypage/user.png";
import coupon from "../../Asset/mypage/coupon.png";
import diamond from "../../Asset/mypage/diamond.png";

function Mypage() {
  const location = useLocation();
  const [title, setTitle] = useState("");
  useEffect(() => {
    location.pathname.split("/")[2] === "pwdchk"
      ? setTitle("개인정보수정")
      : location.pathname.split("/")[2] === "edit"
      ? setTitle("개인정보수정")
      : location.pathname.split("/")[2] === "coupon"
      ? setTitle("보유쿠폰정보")
      : location.pathname.split("/")[2] === "pointhistory"
      ? setTitle("포인트내역")
      : location.pathname.split("/")[2] === "payhistory"
      ? setTitle("지급신청내역")
      : location.pathname.split("/")[2] === "cancel"
      ? setTitle("회원탈퇴")
      : setTitle("마이페이지");
  }, [location]);
  return (
    <>
      <Helmet>
        <title>{title} | 알바선물</title>
      </Helmet>
      <div className="container mx-auto grid grid-cols-1 h-full ">
        <div
          id="touch-target"
          className="container mx-auto flex flex-row flex-nowrap overflow-x-auto giftCategoryMenu gap-3 xl:justify-center"
        >
          <Link
            to="/mypage/pwdchk"
            className="p-4 text-center hover:bg-blue-50 rounded-lg flex flex-col justify-center gap-2 group hover:text-indigo-500"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
              <img
                src={user}
                alt="개인정보수정"
                className="mx-auto w-10 drop-shadow-lg"
              />
            </div>
            <span className="text-sm">개인정보수정</span>
          </Link>
          <Link
            to="/mypage/coupon"
            className="p-4 text-center hover:bg-blue-50 rounded-lg flex flex-col justify-center gap-2 group hover:text-indigo-500"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
              <img
                src={coupon}
                alt="보유쿠폰확인"
                className="mx-auto w-10 drop-shadow-lg"
              />
            </div>
            <span className="text-sm">보유쿠폰확인</span>
          </Link>
          <Link
            to="/mypage/pwdchk"
            className="p-4 text-center hover:bg-blue-50 rounded-lg flex flex-col justify-center gap-2 group hover:text-indigo-500"
            onClick={e => {
              e.preventDefault();
              alert("죄송합니다. 해당 기능은 현재 준비중입니다 🙏");
            }}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
              <img
                src={diamond}
                alt="포인트내역"
                className="mx-auto w-10 drop-shadow-lg"
              />
            </div>
            <span className="text-sm">포인트내역</span>
          </Link>
          <Link
            to="/mypage/payhistory"
            className="p-4 text-center hover:bg-blue-50 rounded-lg flex flex-col justify-center gap-2 group hover:text-indigo-500"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
              <img
                src={list}
                alt="지급신청내역"
                className="mx-auto w-10 drop-shadow-lg"
              />
            </div>
            <span className="text-sm">지급신청내역</span>
          </Link>
        </div>
        {title !== "" && title !== "회원탈퇴" ? (
          <h2 className="text-3xl font-neoextra py-2 text-center mt-2">
            {title}
          </h2>
        ) : null}

        <Outlet />
      </div>
    </>
  );
}

export default Mypage;
