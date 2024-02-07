import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { category } from "../../Data/Category";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";

import CategoryIcons from "./CategoryIcons";
import GiftBrand from "./GiftBrand";

function GiftCategory(props) {
  const thisLocation = useLocation();
  const [menuOn, setMenuOn] = useState(false);
  const [hover, setHover] = useState("");
  useEffect(() => {
    if (thisLocation.pathname.split("/")[2] !== "etc") {
      setHover(
        thisLocation.pathname.split("/")[2]
          ? Number(thisLocation.pathname.split("/")[2])
          : ""
      );
    } else {
      setHover("etc");
    }
    setMenuOn(false);
  }, [thisLocation]);

  useEffect(() => {
    if (thisLocation.pathname.split("/")[2] !== "etc") {
      setHover(
        thisLocation.pathname.split("/")[2]
          ? Number(thisLocation.pathname.split("/")[2])
          : ""
      );
    } else {
      setHover("etc");
    }
    //eslint-disable-next-line
  }, [menuOn]);
  return (
    <>
      <div className="flex flex-row flex-nowrap relative gap-x-2">
        <button
          className="bg-skybluehover text-white lg:w-48 px-4 py-2 flex flex-row justify-start gap-x-2 rounded-t-lg"
          onClick={() => setMenuOn(!menuOn)}
        >
          {menuOn ? <MdClose size={24} /> : <GiHamburgerMenu size={24} />} 선물
          카테고리
        </button>
        <Link
          to="/employ/list"
          className="py-2 px-5 text-center text-redorange font-neoextra hover:bg-gray-100 rounded-t-lg"
        >
          채용게시판
        </Link>
        {menuOn ? (
          <div
            className="absolute top-10 left-0 w-full h-fit z-50 bg-blue-100 border-t border-skybluehover flex flex-row justify-start"
            onMouseLeave={() => setHover(0)}
          >
            <div className="w-full lg:w-48 grid grid-cols-1 divide-y divide-skyblue bg-skybluehover text-white border-t border-skyblue">
              {category.map(cat => (
                <Link
                  to={`/list/${cat.category1Seq}`}
                  className={`${
                    hover === cat.category1Seq
                      ? "bg-blue-100 text-skybluehover"
                      : ""
                  } py-3 px-4`}
                  key={cat.category1Seq}
                  onMouseOver={() => setHover(cat.category1Seq)}
                >
                  <div className="flex flex-row flex-nowrap gap-x-2">
                    <CategoryIcons num={cat.category1Seq} />
                    {cat.category1Name}
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-4 flex-1 h-full bg-blue-100 hidden lg:block">
              <GiftBrand category={hover} />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default GiftCategory;
