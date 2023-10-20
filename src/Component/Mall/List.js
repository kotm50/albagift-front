import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import queryString from "query-string";

import Pagenate from "../Layout/Pagenate";
import UserSection from "../User/UserSection";
import ImgLoad from "./ImgLoad";
import { Helmet } from "react-helmet";
import AlertModal from "../Layout/AlertModal";
import Sorry from "../doc/Sorry";
import { useDispatch } from "react-redux";
import { getNewToken } from "../../Reducer/userSlice";

function List() {
  const dispatch = useDispatch();
  const [goods, setGoods] = useState([]);
  const location = useLocation();
  const pathName = location.pathname;
  const { category, brand } = useParams();
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [loaded, setLoaded] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [catName, setCatName] = useState("");

  useEffect(() => {
    // location이 바뀔 때마다 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    setLoadMsg("상품을 불러오고 있습니다");
    getGoods(category, brand, page);
    setCatName(
      Number(category) === 1
        ? "커피/음료"
        : Number(category) === 2
        ? "베이커리/도넛"
        : Number(category) === 3
        ? "아이스크림"
        : Number(category) === 4
        ? "편의점"
        : Number(category) === 5
        ? "피자/버거/치킨"
        : Number(category) === 6
        ? "외식/분식/배달"
        : Number(category) === 7
        ? "영화/음악/도서"
        : Number(category) === 9
        ? "뷰티/헤어/바디"
        : Number(category) === 10
        ? "출산/생활/통신"
        : category === "etc"
        ? "기타상품"
        : "전체 상품"
    );
    //eslint-disable-next-line
  }, [location]);

  const getGoods = async (c, b, p) => {
    let listUrl = "/api/v1/shop/goods/list";
    if (c !== undefined && b === undefined) {
      listUrl = "/api/v1/shop/goods/list";
      listUrl = listUrl + "/" + c;
    }
    if (b !== undefined) {
      listUrl = "/api/v1/shop/goods/list/brand";
      listUrl = listUrl + "/" + b;
    }
    if (c === "etc") {
      listUrl = "/api/v1/shop/goods/etc/list";
    }
    const data = {
      page: p,
      size: 20,
    };
    await axios
      .get(listUrl, {
        params: data,
      })
      .then(async res => {
        if (res.headers.authorization) {
          await dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        const totalP = res.data.totalPages;
        setTotalPage(res.data.totalPages);
        const pagenate = generatePaginationArray(p, totalP);
        setPagenate(pagenate);
        setLoadMsg(res.data.message);
        setGoods(res.data.goodsList);
        if (res.data.goodsList.length > 0) {
          setLoaded(true);
        }
      })
      .catch(e => {
        console.log(e);
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={
                  "상품 불러오기를 실패했습니다\n관리자에게 문의해주세요"
                } // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
        setGoods([]);
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
  return (
    <>
      <Helmet>
        <title>{catName} | 알바선물 | 면접보고 선물받자!</title>
      </Helmet>
      <div className="xl:container mx-auto">
        <UserSection />
        <h2 className="text-xl xl:text-2xl font-neoextra">
          <span className="inline-block py-2 px-6 bg-blue-500 text-white rounded-full">
            {catName}
          </span>
        </h2>
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
                  <div className="w-32 xl:w-60 mx-auto grid grid-cols-1 pt-1 border-t border-gray-100 max-w-full mt-3">
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
          <>
            {loadMsg === "상품을 불러오고 있습니다" ? (
              <div className="text-center">{loadMsg}</div>
            ) : (
              <Sorry message={"조회된 내용이 없습니다"} />
            )}
          </>
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
