import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import queryString from "query-string";

import { getNewToken } from "../../Reducer/userSlice";

import Search from "./Search";

function List() {
  const dispatch = useDispatch();
  const [goods, setGoods] = useState([]);
  const location = useLocation();
  const pathName = location.pathname;
  console.log(pathName);
  const { category, brand } = useParams();
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const user = useSelector(state => state.user);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [loaded, setLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  useEffect(() => {
    setLoadMsg("상품을 불러오고 있습니다");
    getGoods(category, brand, page);
    //eslint-disable-next-line
  }, [location]);

  const getGoods = async (c, b, p) => {
    let listUrl = "/api/v1/shop/goods/list";
    if (c !== undefined && b === undefined) {
      listUrl = "/api/v1/shop/goods/list";
      listUrl = listUrl + "/" + c;
    }
    if (b !== undefined) {
      listUrl = "/api/v1/shop/brand/goods/list";
      listUrl = listUrl + "/" + b;
    }
    const data = {
      page: p,
      size: 20,
    };
    setGoods([]);
    await axios
      .get(listUrl, {
        params: data,
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res);
        const totalP = res.data.totalPages;
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
        const pagenate = generatePaginationArray(p, totalP);
        setPagenate(pagenate);
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

  function generatePaginationArray(currentPage, totalPage) {
    let paginationArray = [];

    // 최대 페이지가 4 이하인 경우
    if (totalPage <= 4) {
      for (let i = 1; i <= totalPage; i++) {
        paginationArray.push(i);
      }
      return paginationArray;
    }

    // 현재 페이지가 1 ~ 3인 경우
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    // 현재 페이지가 totalPage ~ totalPage - 2인 경우
    if (currentPage >= totalPage - 2) {
      return [
        totalPage - 4,
        totalPage - 3,
        totalPage - 2,
        totalPage - 1,
        totalPage,
      ];
    }

    // 그 외의 경우
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }

  return (
    <>
      <Search user={user} />
      {loaded ? (
        <div
          id="goodsList"
          className="my-2 grid grid-cols-2 xl:grid-cols-4 gap-2"
        >
          {goods.map((good, idx) => (
            <Link key={idx} to={`/detail/${good.goodsCode}`}>
              <div className="group p-2 hover:border-2 hover:border-indigo-500 hover:bg-indigo-50 rounded">
                <div className="w-30 h-30 xl:w-60 xl:h-60 mx-auto rounded overflow-hidden max-w-full">
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
                <div className="p-2 grid grid-cols-1 mt-2">
                  <p className="text-lg group-hover:font-tmoney keep-all overflow-hidden text-ellipsis whitespace-nowrap text-center">
                    {good.goodsName}
                  </p>
                  <p className="text-lg text-center">
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
      {pagenate.length > 0 && (
        <div className="flex flex-row justify-center gap-3">
          {page > 1 && (
            <Link to={`${pathName}?page=${page - 1}`} className="pageButton">
              &lt;
            </Link>
          )}
          <div className="grid grid-cols-5 gap-3">
            {pagenate.map((pageNum, idx) => (
              <Link
                to={`${pathName}?page=${pageNum}`}
                key={idx}
                className="pageButton"
              >
                <span
                  className={`${
                    Number(page) === pageNum ? "font-bold text-blue-500" : null
                  }`}
                >
                  {pageNum}
                </span>
              </Link>
            ))}
          </div>
          {page < totalPage && (
            <Link to={`${pathName}?page=${page + 1}`} className="pageButton">
              &gt;
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default List;
