import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import GiftCategory from "./Menu/GiftCategory";
import GiftBrand from "./Menu/GiftBrand";

import logo from "../../Asset/albaseonmul.svg";

import UserInfo from "./UserInfo";
import { path } from "../../path/path";

function Header() {
  const [headless, setHeadless] = useState(false);
  const [cateNum, setCateNum] = useState("");
  const [loadBrand, setLoadBrand] = useState(false);
  const thisLocation = useLocation();
  useEffect(() => {
    setHeadless(path.some(chkBg));
    const parts = thisLocation.pathname.split("/");
    setCateNum(parts[2]);
    getUrl(parts[1], parts[2]);
    // eslint-disable-next-line
  }, [thisLocation]);

  const chkBg = (element, index, array) => {
    return thisLocation.pathname.startsWith(element);
  };

  const getUrl = (p, n) => {
    if (p === "list") {
      setLoadBrand(false);
      if (n !== "" && n !== undefined) {
        setLoadBrand(true);
      } else {
        setLoadBrand(false);
      }
    } else {
      setLoadBrand(false);
    }
  };
  return (
    <>
      {!headless && (
        <>
          <div className="text-center pb-5 w-full bg-white dark:text-white">
            <div className="xl:container mx-auto">
              <UserInfo />
              <div className="text-center pt-5 xl:pt-0">
                <a href="/" className="inline-block px-2">
                  <img
                    src={logo}
                    className="h-16 mx-auto"
                    alt="알바선물 로고"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="w-full border-b border-teal-500 bg-white">
            <div className="xl:container mx-auto">
              <GiftCategory cateno={cateNum} path={thisLocation.pathname} />
            </div>
          </div>
          {loadBrand && (
            <div className="bg-indigo-100 w-full">
              <div className="container mx-auto">
                <GiftBrand cateNum={cateNum} />
              </div>
            </div>
          )}{" "}
        </>
      )}
    </>
  );
}

export default Header;
