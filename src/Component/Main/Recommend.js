import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Recommend() {
  const user = useSelector(state => state.user);
  const [goods, setGoods] = useState([]);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getGoods();
    //eslint-disable-next-line
  }, [location]);
  const getGoods = async (c, b) => {
    let listUrl = "/api/v1/shop/goods/list";
    const data = {
      page: 1,
      size: 6,
    };
    setGoods([]);
    await axios
      .get(listUrl, {
        params: data,
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        setLoadMsg(res.data.message);
        setGoods(res.data.goodsList);
        if (res.data.goodsList.length > 0) {
          setLoaded(true);
        }
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };

  return (
    <div className="overflow-x-auto">
      {loaded ? (
        <div
          id="recommendList"
          className="mx-auto my-2 flex flex-row flex-nowrap overflow-x-auto xl:grid xl:grid-cols-6 gap-2 xl:w-11/12 w-full"
        >
          {goods.map((good, idx) => (
            <Link
              key={idx}
              to={`/detail/${good.goodsCode}`}
              className="giftcategory flex-shrink-0 w-32 xl:w-auto"
            >
              <div className="group p-2 hover:border-2 bg-white hover:border-indigo-500 hover:bg-indigo-50 rounded recommendListItem">
                <div className="w-32 h-32 xl:w-64 xl:h-64 mx-auto rounded overflow-hidden max-w-full">
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
                      className="w-full mx-auto my-auto duration-100 transition-all group-hover:scale-110"
                    />
                  ) : (
                    <div className="bg-slate-200 animate-pulse w-30 h-30 xl:w-60 xl:h-60"></div>
                  )}
                </div>
                <div className="w-30 xl:w-60 mx-auto grid grid-cols-1 mt-2 max-w-full">
                  <p className="text-base group-hover:font-lineseed keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left font-lineseed text-blue-500">
                    {good.brandName}
                  </p>
                  <p className="text-lg group-hover:font-lineseed keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left">
                    {good.goodsName}
                  </p>
                  <p className="text-lg text-left">
                    <span className="text-xl text-rose-500">
                      {Number(good.realPrice)}
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
  );
}

export default Recommend;
