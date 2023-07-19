import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Search from "./Search";

function SearchResult() {
  const { keyword } = useParams();
  const [goods, setGoods] = useState([]);
  const [resultNum, setResultNum] = useState();
  const location = useLocation();
  const [renderCount, setRenderCount] = useState(0);
  const [load, setLoad] = useState(false);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const user = useSelector(state => state.user);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    searchIt();
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

  const searchIt = async () => {
    setGoods([]);
    await axios
      .get(`/api/v1/shop/goods/search/${keyword}`, {
        token: user.accessToken,
      })
      .then(res => {
        setGoods(res.data.goodsList);
        setResultNum(res.data.listNum);
        setLoadMsg(res.data.message);
        if (res.data.goodsList.length > 0) {
          setLoad(true);
          setRenderCount(40);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  function checkName(name) {
    //name의 마지막 음절의 유니코드(UTF-16)
    const charCode = name.charCodeAt(name.length - 1);

    //유니코드의 한글 범위 내에서 해당 코드의 받침 확인
    const consonantCode = (charCode - 44032) % 28;

    if (consonantCode === 0) {
      //0이면 받침 없음 -> 를
      return `로`;
    }
    //1이상이면 받침 있음 -> 을
    return `으로`;
  }

  return (
    <div>
      <Search user={user} />
      {load ? (
        <>
          <h3 className="text-2xl p-2 bg-orange-50 rounded-lg mt-2">
            <span className="font-medium text-sky-500">{keyword}</span>
            {checkName(keyword)} 검색하여 총{" "}
            <span className="font-medium text-red-500">{resultNum}</span>개의
            상품을 발견했습니다
          </h3>
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
        </>
      ) : (
        <div>{loadMsg}</div>
      )}
    </div>
  );
}

export default SearchResult;
