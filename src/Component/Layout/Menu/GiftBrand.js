import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

function GiftBrand(props) {
  const user = useSelector(state => state.user);
  const [load, setLoad] = useState(false);
  const [brandList, setBrandList] = useState([]);

  useEffect(() => {
    if (props.category === "") {
      setLoad(false);
      setBrandList([]);
      setTimeout(() => {
        setLoad(true);
      }, 100);
    } else {
      getBrandList(props.category);
    }
    //eslint-disable-next-line
  }, [props.category]);

  const getBrandList = async n => {
    setLoad(false);
    setBrandList([]);
    let listUrl = "/api/v1/shop/brand/list";
    if (n !== "") {
      listUrl = listUrl + "/" + n;
    }
    await axios
      .get(listUrl, { token: user.accessToken })
      .then(res => {
        setBrandList(res.data.brandsList);
        setLoad(true);
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      {load ? (
        <>
          {brandList.length > 0 ? (
            <div className="grid grid-cols-8 gap-x-2 gap-y-2 w-full">
              {brandList.map((brand, idx) => (
                <Link
                  to={`/list/${props.category}/${brand.brandCode}`}
                  className={
                    String(brand.brandSeq) === props.brandNum
                      ? "bg-blue-500 py-2 px-4 text-white giftcategory text-sm rounded-lg border"
                      : "text-black bg-white py-2 px-4 hover:bg-blue-500 hover:text-white hover:drop-shadow-lg giftcategory text-sm rounded-lg border"
                  }
                  key={idx}
                >
                  <div className="w-24 h-24 mx-auto p-1 rounded bg-white overflow-hidden">
                    <img
                      src={brand.brandIConImg}
                      alt={`${brand.brandName}의 로고`}
                      className="w-24 h-auto mx-auto"
                    />
                  </div>
                  <div className="w-full overflow-hidden text-ellipsis text-center mt-1">
                    {brand.brandName}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center">
              브랜드가 없습니다. 카테고리를 선택해 주세요
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-8">
          <div className="aniamte-pulse  bg-white py-2 px-4 text-sm rounded-lg border">
            <div className="w-24 h-24 mx-auto p-1 rounded bg-slate-200 overflow-hidden"></div>
            <div className="w-full bg-slate-200 h-2 mt-1"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default GiftBrand;
