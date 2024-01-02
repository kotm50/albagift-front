import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Helmet } from "react-helmet";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import list from "../../Asset/mypage/list.png";
import interview from "../../Asset/mypage/interview.png";
import user from "../../Asset/mypage/user.png";
import coupon from "../../Asset/mypage/coupon.png";
import diamond from "../../Asset/mypage/diamond.png";
import UserInformation from "./UserInfomation";
import AlertModal from "../Layout/AlertModal";

function Mypage() {
  const navi = useNavigate();
  const users = useSelector(state => state.user);
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (
      users.userId === "" ||
      users.userId === null ||
      users.userId === undefined
    ) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"로그인 필요"} // 제목
              message={"로그인 후 이용해 주세요"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
              doIt={goLogin} // 확인시 실행할 함수
            />
          );
        },
      });
    } else {
      setLoaded(true);
    }
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
      : location.pathname.split("/")[2] === "pointrequest"
      ? setTitle("면접포인트 지급신청")
      : location.pathname.split("/")[2] === "cancel"
      ? setTitle("회원탈퇴")
      : setTitle("개인정보수정");

    //eslint-disable-next-line
  }, [location]);

  const goLogin = () => {
    navi("/login");
  };
  return (
    <>
      {loaded ? (
        <>
          <Helmet>
            <title>{title} | 알바선물</title>
          </Helmet>
          <div className="fixed top-0 left-0 w-0 h-0 opacity-0">
            <UserInformation />
          </div>
          <div className="container mx-auto grid grid-cols-1 h-full">
            <div
              id="touch-target"
              className="container mx-auto flex flex-row flex-nowrap overflow-x-auto giftCategoryMenu gap-3 lg:justify-center"
            >
              <Link
                to="/mypage/pwdchk"
                className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group"
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
                to="/mypage/pointrequest"
                className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
                  <img
                    src={interview}
                    alt="포인트신청"
                    className="mx-auto w-10 drop-shadow-lg"
                  />
                </div>
                <span className="text-sm">포인트신청</span>
              </Link>
              <Link
                to="/mypage/coupon"
                className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group"
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
                to="/mypage/pointhistory"
                className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group"
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
                className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group"
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
            {title !== "회원탈퇴" ? (
              <h2 className="text-3xl font-neoextra py-2 text-center mt-2">
                {title}
              </h2>
            ) : null}

            <Outlet />
          </div>
        </>
      ) : null}
    </>
  );
}

export default Mypage;
