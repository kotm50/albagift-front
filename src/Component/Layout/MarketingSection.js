import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import phone from "../../Asset/marketing/phone.png";
import speech from "../../Asset/marketing/speech.png";
import object from "../../Asset/marketing/object.png";

function MarketingSection() {
  const [isLogin, setIsLogin] = useState(false);
  const user = useSelector(state => state.user);
  useEffect(() => {
    if (user.accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [user]);
  return (
    <>
      {isLogin ? (
        <>
          <Link to="/marketing" className="hidden lg:block">
            <div className="w-full lg:container mx-auto lg:rounded-lg bg-teal-500 hover:cursor-pointer mt-3 h-[100px] lg:h-[180px] relative overflow-hidden z-0">
              <div className="text-white pplight text-center absolute top-1/2 left-1/2 w-full h-fit -translate-x-1/2 -translate-y-1/2 text-5xl z-50">
                <span className="border-b-2">마케팅 수신동의</span> 하고{" "}
                <span className="text-yellow-300 ppbold">4000p</span> 받아가세요
              </div>
              <img
                src={phone}
                alt=""
                className="absolute right-20 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[240px] w-auto z-10"
              />
              <img
                src={speech}
                alt=""
                className="absolute right-[48px] top-1/2 -translate-y-[60px] h-[80px] w-auto z-10"
              />
              <img
                src={object}
                alt=""
                className="absolute left-20 top-1/2 -translate-y-1/2 h-[240px] w-auto z-10"
              />
            </div>
          </Link>

          <Link to="/marketing" className="lg:hidden block">
            <div className="w-full lg:container mx-auto lg:rounded-lg bg-teal-500 hover:cursor-pointer h-[100px] lg:h-[180px] relative overflow-hidden z-0">
              <div className="text-white pplight absolute left-5 top-1/2 w-full h-fit -translate-y-1/2 text-xl z-50 flex flex-col justify-center gap-y-1">
                <div>
                  <span className="border-b-2">마케팅 수신동의</span> 하고{" "}
                </div>
                <div>
                  <span className="text-yellow-300 ppbold">4000p</span>{" "}
                  받아가세요
                </div>
              </div>
              <img
                src={phone}
                alt=""
                className="absolute right-[40px] top-1/2 -translate-y-1/2 h-[120px] w-auto z-20"
              />
              <img
                src={speech}
                alt=""
                className="absolute right-0 top-1/2 -translate-y-[30px] h-[36px] w-auto z-30"
              />
              <img
                src={object}
                alt=""
                className="absolute right-[72px] top-1/2 -translate-y-1/2 h-[80px] w-auto z-10"
              />
            </div>
          </Link>
        </>
      ) : null}
    </>
  );
}

export default MarketingSection;
