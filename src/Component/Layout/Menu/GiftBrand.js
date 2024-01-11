import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

function GiftBrand(props) {
  const user = useSelector(state => state.user);
  const location = useLocation();
  const [load, setLoad] = useState(false);
  const [brandList, setBrandList] = useState([]);

  useEffect(() => {
    const parts = location.pathname.split("/");
    getBrandList(parts[2]);
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    setLoad(false);
    if (brandList.length > 0) {
      setLoad(true);
    } else {
      setLoad(false);
    }
  }, [brandList]);

  const getBrandList = async n => {
    setBrandList([]);
    let listUrl = "/api/v1/shop/brand/list";
    if (n !== "") {
      listUrl = listUrl + "/" + n;
    }
    await axios
      .get(listUrl, { token: user.accessToken })
      .then(res => {
        setBrandList(res.data.brandsList);
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div>
      {load ? (
        <div className="container mx-auto text-lg flex flex-row flex-nowrap lg:flex-wrap gap-3 p-2 lg:max-h-72 overflow-auto giftCategoryMenu bg-indigo-100">
          {brandList.map((brand, idx) => (
            <Link
              to={`/list/${props.cateNum}/${brand.brandCode}`}
              className={
                String(brand.brandSeq) === props.brandNum
                  ? "bg-blue-500 py-2 px-4 text-white giftcategory text-sm rounded-lg border lg:w-1/12"
                  : "text-black bg-white py-2 px-4 hover:bg-blue-500 hover:text-white hover:drop-shadow-lg giftcategory text-sm rounded-lg border lg:w-1/12"
              }
              key={idx}
            >
              <div className="w-16 h-16 mx-auto p-1 rounded bg-white overflow-hidden">
                <img
                  src={brand.brandIConImg}
                  alt={`${brand.brandName}의 로고`}
                  className="w-16 h-auto mx-auto"
                />
              </div>
              <div className="w-full overflow-hidden text-ellipsis text-center mt-1">
                {brand.brandName}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="container mx-auto text-lg flex flex-row flex-nowrap lg:flex-wrap gap-3 p-2 lg:max-h-72 overflow-auto giftCategoryMenu bg-indigo-100">
          <div className="aniamte-pulse  bg-white py-2 px-4 giftcategory text-sm rounded-lg border lg:w-1/12">
            <div className="w-16 h-16 mx-auto p-1 rounded bg-slate-200 overflow-hidden"></div>
            <div className="w-full bg-slate-200 h-2 mt-1"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiftBrand;
