import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Search from "./Search";

function List() {
  const [goods, setGoods] = useState([]);
  const location = useLocation();
  const { category, brand } = useParams();
  const user = useSelector(state => state.user);
  const [renderCount, setRenderCount] = useState(0);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [loaded, setLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    setLoadMsg("상품을 불러오고 있습니다");
    getGoods(category, brand);
    //eslint-disable-next-line
  }, [location]);

  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;

    if (bottom) {
      setRenderCount(prevCount => prevCount + 20); // 아래로 스크롤했을 때 추가로 20개씩 렌더링
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]); // handleScroll 함수가 변경될 때마다 useEffect를 실행

  const getGoods = async (c, b) => {
    let listUrl = "/api/v1/shop/goods/list";
    if (c !== undefined && b === undefined) {
      listUrl = "/api/v1/shop/goods/list";
      listUrl = listUrl + "/" + c;
    }
    if (b !== undefined) {
      listUrl = "/api/v1/shop/brand/goods/list";
      listUrl = listUrl + "/" + b;
    }
    setGoods([]);
    await axios
      .get(listUrl, { headers: { Authorization: user.accessToken } })
      .then(res => {
        console.log(res.headers.authorization);
        setLoadMsg(res.data.message);
        setGoods(res.data.goodsList);
        if (res.data.goodsList.length > 0) {
          setLoaded(true);
        }
        setRenderCount(40);
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };

  return (
    <>
      <Search user={user} />
      {loaded ? (
        <div
          id="goodsList"
          className="my-2 grid grid-cols-2 xl:grid-cols-4 gap-2"
        >
          {goods.slice(0, renderCount).map((good, idx) => (
            <Link key={idx} to={`/detail/${good.goodsCode}`}>
              <div className="group p-2 border-2 hover:border-indigo-500 hover:bg-indigo-50 rounded">
                <div className="w-30 h-30 xl:w-60 xl:h-60 mx-auto rounded overflow-hidden">
                  <img
                    src={good.goodsImgS}
                    alt={good.goosName}
                    className="fixed top-0 left-0 w-0 h-0 opacity-0"
                    onLoad={e => setImgLoaded(true)}
                  />
                  {imgLoaded ? (
                    <img
                      src={good.goodsImgS}
                      alt={good.goosName}
                      className="w-full mx-auto my-auto duration-100 transition-all group-hover:scale-110"
                    />
                  ) : (
                    <div className="bg-slate-200 animate-pulse w-30 h-30 xl:w-60 xl:h-60"></div>
                  )}
                </div>
                <div className="p-2 grid grid-cols-1 xl:grid-cols-4 mt-2">
                  <p className="text-lg group-hover:font-medium keep-all overflow-hidden text-ellipsis whitespace-nowrap xl:col-span-3">
                    {good.goodsName}
                  </p>
                  <p className="text-lg xl:text-right">
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
    </>
  );
}

export default List;
