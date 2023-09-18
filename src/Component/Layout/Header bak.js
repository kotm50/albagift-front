import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import GiftCategory from "./Menu/GiftCategory";
import GiftBrand from "./Menu/GiftBrand";

import logo from "../../Asset/albaseonmul.svg";

import UserInfo from "./UserInfo";

function Header() {
  const [cateNum, setCateNum] = useState("");
  const [loadBrand, setLoadBrand] = useState(false);
  const [isPromo, setIsPromo] = useState(true);
  const thisLocation = useLocation();
  useEffect(() => {
    const parts = thisLocation.pathname.split("/");
    parts[1] === "promo" ? setIsPromo(true) : setIsPromo(false);
    setCateNum(parts[2]);
    getUrl(parts[1], parts[2]);
    // eslint-disable-next-line
  }, [thisLocation]);

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
      {!isPromo ? (
        <>
          <div className="text-center pb-5 w-full bg-white dark:text-white">
            <div className="xl:container mx-auto">
              <UserInfo />
              <div className="text-center pt-5 xl:pt-0">
                <Link to="/" className="inline-block px-2">
                  <img
                    src={logo}
                    className="h-16 mx-auto"
                    alt="알바선물 로고"
                  />
                </Link>
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
      ) : null}
    </>
  );
}

export default Header;
