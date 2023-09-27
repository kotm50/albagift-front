import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";

import queryString from "query-string";

import { getNewToken } from "../../Reducer/userSlice";

import Pagenate from "../Layout/Pagenate";
import UserSection from "../User/UserSection";
import Loading from "../Layout/Loading";
import ImgLoad from "./ImgLoad";

function List() {
  const dispatch = useDispatch();
  const [goods, setGoods] = useState([]);
  let navi = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const { category, brand } = useParams();
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const user = useSelector(state => state.user);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [loaded, setLoaded] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // location이 바뀔 때마다 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    setLoading(true);
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
    if (c === "etc") {
      listUrl = "/api/v1/shop/goods/etc/list";
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
        if (res.data.code === "E999") {
          logout();
          return false;
        }
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
        setLoading(false);
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

  const logout = async () => {
    await axios
      .post("/api/v1/user/logout", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        alert("세션이 만료되었습니다. 다시 로그인 해주세요");
      })
      .catch(e => {
        console.log(e);
      });
    dispatch(clearUser());
    navi("/login");
  };

  return (
    <>
      <div className="xl:container mx-auto">
        {loading ? <Loading /> : null}
        <UserSection />
        {loaded ? (
          <div className="my-2 grid grid-cols-2 xl:grid-cols-5 gap-2 gap-y-10">
            {goods.map((good, idx) => (
              <Link
                key={idx}
                to={`/detail/${good.goodsCode}`}
                className="pb-0 min-h-0 h-fit"
              >
                <div className="group p-2 rounded">
                  <div className="w-32 h-32 xl:w-60 xl:h-60 mx-auto rounded overflow-hidden max-w-full bg-white drop-shadow hover:drop-shadow-xl">
                    <ImgLoad good={good} />
                  </div>
                  <div className="w-32 xl:w-60 mx-auto grid grid-cols-1 mt-2 pt-1 border-t border-gray-100 max-w-full mt-3">
                    <p className="xl:text-base group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left font-neobold text-blue-500">
                      {good.brandName}
                    </p>
                    <p className="xl:text-lg group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left">
                      {good.goodsName}
                    </p>
                    <p className="xl:text-lg text-left mt-3">
                      <span className="text-xl text-rose-500">
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
        <Pagenate
          pagenate={pagenate}
          page={Number(page)}
          totalPage={Number(totalPage)}
          pathName={pathName}
        />
      </div>
    </>
  );
}

export default List;
