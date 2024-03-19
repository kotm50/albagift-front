import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance";

function RecomMall(props) {
  const location = useLocation();
  const [goods, setGoods] = useState([]);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getGoods(props.category);
    //eslint-disable-next-line
  }, [location]);

  const getGoods = async c => {
    let listUrl = `/api/v1/shop/detail/rand/goods`;
    const data = {
      category1Seq: Number(c),
    };
    setGoods([]);
    await axiosInstance
      .post(listUrl, data)
      .then(res => {
        setLoadMsg(res.data.message);
        setGoods(res.data.randList);
        if (res.data.randList.length > 0) {
          setLoaded(true);
        }
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };

  return (
    <div className="p-2 bg-white">
      <div className="lg:container mx-auto">
        <div className="overflow-x-auto w-full mx-auto my-2 px-4">
          <h3 className="lg:text-3xl font-lineseed py-2 border-b">
            이런 상품은 어떠세요?
          </h3>
          {loaded ? (
            <div
              id="recommendList"
              className="mx-auto my-2 flex flex-row flex-nowrap overflow-x-auto lg:grid lg:grid-cols-5 w-full"
            >
              {goods.map((good, idx) => (
                <Link
                  key={idx}
                  to={`/detail/${good.goodsCode}`}
                  className="giftcategory flex-shrink-0 lg:w-auto p-1"
                >
                  <div className="group p-2 rounded recommendListItem w-32 lg:w-auto">
                    <div className="w-32 h-32 lg:w-64 lg:h-64 mx-auto rounded overflow-hidden max-w-full drop-shadow hover:drop-shadow-lg">
                      <img
                        src={good.goodsImgS}
                        alt={good.goodsName}
                        className="fixed top-0 left-0 w-0 h-0 opacity-0"
                        onLoad={e => setImgLoaded(true)}
                      />
                      {imgLoaded ? (
                        <img
                          src={good.goodsImgS}
                          alt={good.goodsName}
                          className="w-full mx-auto my-auto duration-100 transition-all hover:scale-110"
                        />
                      ) : (
                        <div className="bg-slate-200 animate-pulse w-30 h-30 lg:w-60 lg:h-60"></div>
                      )}
                    </div>
                    <div className="w-30 lg:w-60 mx-auto grid grid-cols-1 mt-4">
                      <p className="text-sm lg:text-base group-hover:font-lineseed keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left font-lineseed text-blue-500 w-full overflow-x-hidden">
                        {good.brandName}
                      </p>
                      <p
                        className="text-base lg:base-lg group-hover:font-lineseed keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left w-full overflow-x-hidden"
                        title={good.goodsName}
                      >
                        {good.goodsName}
                      </p>
                      <p className="text-base lg:base-lg text-left w-full overflow-x-hidden mt-3">
                        <span className="text-base text-rose-500">
                          {Number(good.realPrice).toLocaleString()}
                        </span>{" "}
                        P
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div>{loadMsg}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecomMall;
