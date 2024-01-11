import React from "react";
import { Link } from "react-router-dom";
import { category } from "../Data/Category";
import all from "../../Asset/mainCategory/all.png";
import MainCategoryImg from "./MainCategoryImg";

function MainCategory() {
  return (
    <div className="p-2">
      <div className="lg:w-5/6 mx-auto">
        <div
          id="touch-target"
          className="container mx-auto flex flex-row flex-nowrap overflow-x-auto giftCategoryMenu gap-3 lg:grid lg:grid-cols-10"
        >
          <Link to={`/list`} className="text-center text-xs giftcategory p-2">
            <div className="mainCategory group">
              <div className="bg-sky-50 rounded-full text-center w-20 h-20 mx-auto mb-2 flex flex-col justify-center">
                <img
                  src={all}
                  alt="전체상품"
                  className="w-12 h-auto max-w-full mx-auto"
                />
              </div>
              <div className="group-hover:text-rose-500">전체상품</div>
            </div>
          </Link>
          {category.map((cat, idx) => (
            <Link
              to={`/list/${cat.category1Seq}`}
              key={idx}
              className={`text-center text-xs giftcategory p-2 ${
                cat.category1Seq === "etc" && "hidden"
              }`}
            >
              <div className="mainCategory group">
                <div className="bg-sky-50 rounded-full text-center w-20 h-20 mx-auto mb-2 flex flex-col justify-center">
                  <MainCategoryImg
                    cat={cat.category1Seq}
                    txt={cat.category1Name}
                  />
                </div>
                <div className="group-hover:text-rose-500">
                  {cat.category1Name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainCategory;
