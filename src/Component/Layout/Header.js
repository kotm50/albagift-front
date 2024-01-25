import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import GiftCategory from "./Menu/GiftCategory";

import HeaderTop from "./HeaderTop";
import GiftBrandTop from "./Menu/GiftBrandTop";

function Header() {
  const [cateNum, setCateNum] = useState("");
  const [loadBrand, setLoadBrand] = useState(false);
  const [isPromo, setIsPromo] = useState(true);
  const thisLocation = useLocation();
  useEffect(() => {
    const parts = thisLocation.pathname.split("/");
    parts[1] === "promo"
      ? setIsPromo(true)
      : parts[1] === "collect"
      ? setIsPromo(true)
      : parts[1] === "sns"
      ? setIsPromo(true)
      : setIsPromo(false);

    setCateNum(parts[2]);
    getUrl(parts[1], parts[2]);
    // eslint-disable-next-line
  }, [thisLocation]);

  const getUrl = (p, n) => {
    if (p === "list") {
      setLoadBrand(false);
      if (n !== "" && n !== undefined && n !== "etc") {
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
          <HeaderTop isPromo={isPromo} />
          <div
            className={`w-full border-b border-blue-500 bg-white ${
              isPromo ? "hidden" : ""
            }`}
          >
            <div className="lg:container mx-auto">
              <GiftCategory cateno={cateNum} path={thisLocation.pathname} />
            </div>
          </div>
          {loadBrand && (
            <div className="bg-blue-100 w-full block lg:hidden">
              <div className="container mx-auto">
                <GiftBrandTop cateNum={cateNum} />
              </div>
            </div>
          )}
        </>
      ) : null}
    </>
  );
}

export default Header;
