import React from "react";
import { Link } from "react-router-dom";

import { category } from "./Category";
import { AiFillHome } from "react-icons/ai";
import CategoryIcons from "./CategoryIcons";

function GiftCategory(props) {
  return (
    <>
      <div className="flex flex-row flex-nowrap">
        <Link
          to="/"
          className="bg-teal-500 text-white  p-2 hover:bg-teal-100 hover:text-black giftcategory"
        >
          <div>
            <AiFillHome size={24} />
          </div>
        </Link>
        <div
          id="touch-target"
          className="container mx-auto flex flex-row flex-nowrap overflow-x-auto giftCategoryMenu"
        >
          <Link
            to="/list"
            className={
              props.path === "/list"
                ? props.cateno
                  ? "bg-white text-gray-500 p-2 hover:bg-teal-100 hover:text-black giftcategory"
                  : "bg-teal-50 text-gray-500 border-b-2 border-teal-500 p-2 hover:bg-teal-100 hover:text-black giftcategory"
                : "bg-white text-gray-500 p-2 hover:bg-teal-100 hover:text-black giftcategory"
            }
          >
            <div>전체상품</div>
          </Link>
          {category.map(cat => (
            <Link
              to={`/list/${cat.category1Seq}`}
              className={
                Number(props.cateno) === cat.category1Seq
                  ? "bg-teal-50 text-gray-500 p-2 border-b-2 border-teal-500 hover:bg-teal-100 hover:text-black giftcategory"
                  : "bg-white text-gray-500 p-2 hover:bg-teal-100 hover:text-black giftcategory"
              }
              key={cat.category1Seq}
            >
              <div className="flex flex-row flex-nowrap gap-1">
                <CategoryIcons num={cat.category1Seq} />
                {cat.category1Name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default GiftCategory;
