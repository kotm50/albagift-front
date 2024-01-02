import React from "react";
import { Link } from "react-router-dom";

import logo from "../../Asset/albaseonmul.svg";
import mLogo from "../../Asset/aslogo-m.png";

import SearchArea from "./SearchArea";

function HeaderTop() {
  return (
    <>
      <div className="text-center w-full bg-white dark:text-white py-5">
        <div className="container mx-auto grid grid-cols-5 ">
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
          <div className="col-span-4 flex flex-col justify-center">
            <SearchArea />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderTop;
