import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { RiCoupon2Line } from "react-icons/ri";
import { BiNotepad } from "react-icons/bi";

function MobileFooter() {
  const user = useSelector(state => state.user);
  const [isLogin, setIsLogin] = useState(false);
  const [isPromo, setIsPromo] = useState(true);
  const thisLocation = useLocation();
  useEffect(() => {
    if (user.accessToken !== "") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user]);
  useEffect(() => {
    const parts = thisLocation.pathname.split("/");
    parts[1] === "sns"
      ? setIsPromo(true)
      : parts[1] === "cert"
      ? setIsPromo(true)
      : parts[1] === "certification"
      ? setIsPromo(true)
      : parts[1] === "employ"
      ? setIsPromo(true)
      : setIsPromo(false);
    // eslint-disable-next-line
  }, [thisLocation]);
  return (
    <>
      {!isPromo ? (
        <div className="md:hidden fixed bottom-0 w-full h-auto py-2 bg-white text-center z-50 grid grid-cols-4 text-xs text-gray-500 mobileFooter">
          <Link to="/" className="flex flex-col justify-end gap-y-1">
            <AiOutlineHome size={24} className="mx-auto" />
            메인으로
          </Link>
          <Link
            to={isLogin ? "/mypage" : "/login"}
            className="flex flex-col justify-end gap-y-1"
          >
            <AiOutlineUser size={24} className="mx-auto" />
            마이페이지
          </Link>
          <Link
            to={isLogin ? "/mypage/coupon" : "/login"}
            className="flex flex-col justify-end gap-y-1"
          >
            <RiCoupon2Line size={24} className="mx-auto" />
            보유쿠폰
          </Link>
          <Link
            to={isLogin ? "/mypage/pointrequest" : "/login"}
            className="flex flex-col justify-end gap-y-1"
          >
            <BiNotepad size={24} className="mx-auto" />
            면접포인트
          </Link>
        </div>
      ) : null}
    </>
  );
}

export default MobileFooter;
