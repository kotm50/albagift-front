import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../Reducer/userSlice";
import queryString from "query-string";
import axios from "axios";
import Search from "./Search";

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
            {goods.map((good, idx) => (
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
    </div>
  );
}

export default SearchResult;
