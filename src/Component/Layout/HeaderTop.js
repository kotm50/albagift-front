import React from "react";
import { Link } from "react-router-dom";

import logo from "../../Asset/albaseonmul.svg";

import UserInfo from "./UserInfo";
import SearchArea from "./SearchArea";

function HeaderTop() {
  return (
    <>
      <div className="text-center w-full bg-white dark:text-white py-5">
        <div className="container mx-auto flex justify-between">
          <div className="text-center pt-5 xl:pt-0">
            <Link to="/" className="inline-block px-2">
              <img src={logo} className="h-16 mx-auto" alt="알바선물 로고" />
            </Link>
          </div>
          <SearchArea />
          <UserInfo />
        </div>
      </div>
    </>
  );
}

export default HeaderTop;
