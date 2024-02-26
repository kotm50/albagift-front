import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import logo from "../../Asset/albaseonmul.svg";
import employlogo from "../../Asset/employlogo.svg";
import employlogoM from "../../Asset/employlogo_m.png";
import mLogo from "../../Asset/aslogo-m.png";

import SearchArea from "./SearchArea";

function HeaderTop() {
  const thisLocation = useLocation();
  const [isEmploy, setIsEmploy] = useState(false);

  useEffect(() => {
    if (thisLocation.pathname.split("/")[1] === "employ") {
      setIsEmploy(true);
    } else {
      setIsEmploy(false);
    }
  }, [thisLocation]);
  return (
    <>
      {isEmploy ? (
        <div className="text-center w-full bg-white dark:text-white py-3">
          <div
            className={`container mx-auto flex justify-start ${
              isEmploy && "lg:justify-center"
            } gap-x-2`}
          >
            <div className="text-center pt-0">
              <Link to="/" className="lg:inline-block px-2 hidden">
                <img
                  src={logo}
                  className="h-16 mx-auto"
                  alt="알바선물 로고 데스크탑"
                />
              </Link>
              <Link to="/employ/list" className="lg:inline-block hidden">
                <img
                  src={employlogo}
                  className="h-16 mx-auto w-auto"
                  alt="채용게시판 로고 데스크탑"
                />
              </Link>
              <Link
                to="/"
                className="inline-block p-2 lg:hidden w-12 h-12 mt-2"
              >
                <img
                  src={mLogo}
                  className="w-full mx-auto"
                  alt="알바선물 로고 모바일"
                />
              </Link>
              <Link
                to="/employ/list"
                className="inline-block lg:hidden mt-2 h-12 text-xl pplight"
              >
                <img
                  src={employlogoM}
                  className="h-full w-auto"
                  alt="채용게시판 로고 모바일"
                />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center w-full bg-white dark:text-white py-5">
          <div className="container mx-auto flex justify-start gap-x-2">
            <div className="text-center pt-0">
              <Link to="/" className="lg:inline-block px-2 hidden">
                <img
                  src={logo}
                  className="h-16 mx-auto"
                  alt="알바선물 로고 데스크탑"
                />
              </Link>
              <Link to="/" className="inline-block p-2 lg:hidden w-12 mt-2">
                <img
                  src={mLogo}
                  className="w-full mx-auto"
                  alt="알바선물 로고 모바일"
                />
              </Link>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <SearchArea />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderTop;
