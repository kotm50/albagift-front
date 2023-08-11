import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../Reducer/userSlice";
import queryString from "query-string";
import axios from "axios";
import Search from "./Search";

import Pagenate from "../Layout/Pagenate";

function SearchResult() {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const [goods, setGoods] = useState([]);
  const [resultNum, setResultNum] = useState();
  const location = useLocation();
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const [load, setLoad] = useState(false);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const user = useSelector(state => state.user);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);

  useEffect(() => {
    searchIt(page);
    //eslint-disable-next-line
  }, [location]);
  const searchIt = async p => {
    setGoods([]);

    const data = {
      page: p,
      size: 20,
    };
    await axios
      .get(`/api/v1/shop/goods/search/${keyword}`, {
        params: data,
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        setTotalPage(res.data.totalPages);
        if (res.headers.authorization) {
          if (res.headers.authorization !== user.accessToken) {
            dispatch(
              getNewToken({
                accessToken: res.headers.authroiztion,
              })
            );
          }
        }
        const pagenate = generatePaginationArray(p, res.data.totalPages);
        setPagenate(pagenate);
        setGoods(res.data.goodsList);
        setResultNum(res.data.listNum);
        setLoadMsg(res.data.message);
        if (res.data.goodsList.length > 0) {
          setLoad(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  function generatePaginationArray(currentPage, totalPage) {
    let paginationArray = [];

    // 최대 페이지가 4 이하인 경우
    if (Number(totalPage) <= 4) {
      for (let i = 1; i <= totalPage; i++) {
        paginationArray.push(i);
      }
      return paginationArray;
    }

    // 현재 페이지가 1 ~ 3인 경우
    if (Number(currentPage) <= 3) {
      return [1, 2, 3, 4, 5];
    }

    // 현재 페이지가 totalPage ~ totalPage - 2인 경우
    if (Number(currentPage) >= Number(totalPage) - 2) {
      return [
        Number(totalPage) - 4,
        Number(totalPage) - 3,
        Number(totalPage) - 2,
        Number(totalPage) - 1,
        Number(totalPage),
      ];
    }

    // 그 외의 경우
    return [
      Number(currentPage) - 2,
      Number(currentPage) - 1,
      Number(currentPage),
      Number(currentPage) + 1,
      Number(currentPage) + 2,
    ];
  }

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
      <Search user={user} keyword={keyword} />
      {load ? (
        <>
          <h3 className="text-lg xl:text-2xl p-2 bg-orange-50 rounded-lg mt-2 text-center xl:text-left">
            <span className="font-neobold text-sky-500">{keyword}</span>
            {checkName(keyword)} 검색하여
            <br className="block xl:hidden" />총{" "}
            <span className="font-neobold text-red-500">{resultNum}</span>개의
            상품을 발견했습니다
          </h3>
          <div className="my-2 grid grid-cols-2 xl:grid-cols-5 gap-2">
            {goods.map((good, idx) => (
              <Link
                key={idx}
                to={`/detail/${good.goodsCode}`}
                className="pb-0 min-h-0 h-fit"
              >
                <div className="group p-2 bg-white hover:border-2 hover:border-indigo-500 hover:bg-indigo-50 rounded drop-shadow hover:drop-shadow-xl">
                  <div className="w-32 h-32 xl:w-60 xl:h-60 mx-auto rounded overflow-hidden max-w-full">
                    {imgLoaded ? (
                      <img
                        src={good.goodsImgS}
                        alt={good.goodsName}
                        className="w-full mx-auto my-auto duration-300 transition-all ease-in-out group-hover:scale-125"
                      />
                    ) : (
                      <>
                        <img
                          src={good.goodsImgS}
                          alt={good.goodsName}
                          className="fixed top-0 left-0 w-0 h-0 opacity-0"
                          onLoad={e => setImgLoaded(true)}
                        />
                        <div className="bg-slate-200 animate-pulse w-32 h-32 xl:w-60 xl:h-60"></div>
                      </>
                    )}
                  </div>
                  <div className="w-32 xl:w-60 mx-auto grid grid-cols-1 mt-2 pt-1 border-t border-gray-100 max-w-full">
                    <p className="text-base group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left font-neobold text-blue-500">
                      {good.brandName}
                    </p>
                    <p className="text-lg group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left">
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
        </>
      ) : (
        <div>{loadMsg}</div>
      )}
      <Pagenate
        pagenate={pagenate}
        page={Number(page)}
        totalPage={Number(totalPage)}
        pathName={pathName}
      />
    </div>
  );
}

export default SearchResult;
