import React, { useState, useEffect } from "react";

import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";

import queryString from "query-string";
import { logoutAlert } from "../LogoutUtil";
import Pagenate from "../Layout/Pagenate";

import Sorry from "../doc/Sorry";
import Loading from "../Layout/Loading";
import axiosInstance from "../../Api/axiosInstance";

import dayjs from "dayjs";
import { FaSearch } from "react-icons/fa";
function GifticonLog2() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const location = useLocation();
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const [couponList, setGifticonList] = useState([]);
  const [loadList, setLoadList] = useState("쿠폰을 불러오고 있습니다");
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [hover, setHover] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    //setSearchKeyword(keyword);
    getGifticonList(page, keyword);
    //eslint-disable-next-line
  }, [location]);

  const chkCoupon = async c => {
    const data = {
      trId: c,
    };
    await axiosInstance
      .post("/api/v1/shop/goods/coupons", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        console.log(res.data);
        if (res.data.code === "E999") {
          logoutAlert(res.data.message);
          return false;
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getGifticonList = async (p, k) => {
    setLoaded(false);
    let data = {
      page: p,
      size: 20,
    };

    if (keyword) {
      data.searchKeyword = k;
    }
    await axiosInstance
      .post("/api/v1/shop/goods/all/buyList", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res.data);
        if (res.data.code === "E999") {
          logoutAlert(
            null,
            null,
            dispatch,
            clearUser,
            navi,
            user,
            res.data.message
          );
        }

        if (res.data.couponList.length === 0) {
          setLoadList("조회된 쿠폰이 없습니다");
        }
        const totalP = res.data.totalPages;
        setTotalPage(res.data.totalPages);
        const pagenate = generatePaginationArray(p, totalP);
        setPagenate(pagenate);
        setGifticonList(res.data.couponList);
        setLoaded(true);
      })
      .catch(e => {
        console.log(e);
        setGifticonList([]);
        setLoadList("조회된 쿠폰이 없습니다");
        setLoaded(true);
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

  //휴대폰변환
  const getPhone = str => {
    if (str.length !== 11) {
      // 문자열이 11자리가 아닌 경우에 대한 예외 처리
      return "Invalid input";
    }

    const firstPart = str.substring(0, 3); // 1, 2, 3번째 문자열
    const secondPart = str.substring(3, 7); // 4, 5, 6, 7번째 문자열은 '*'로 대체
    const thirdPart = str.substring(7, 11); // 8, 9, 10, 11번째 문자열

    // 조합하여 원하는 형식의 문자열을 만듭니다.
    const transformedString = `${firstPart}-${secondPart}-${thirdPart}`;
    return transformedString;
  };

  const isExpire = limit => {
    const today = new Date();
    const limitDay = new Date(limit);

    // limitDay에서 today를 뺀 결과를 밀리초 단위로 계산
    const diff = limitDay - today;

    // 밀리초를 일수로 변환 (1일 = 24 * 60 * 60 * 1000 밀리초)
    const days = diff / (1000 * 60 * 60 * 24);

    // 조건에 따라 결과 반환
    if (days < 0) {
      return "만료됨";
    } else if (days <= 3) {
      return "만료예정";
    } else {
      return false;
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchIt();
    }
  };

  const searchIt = () => {
    const keyword = searchKeyword.trim();
    let domain = `${pathName}?page=1${
      keyword !== "" ? `&keyword=${keyword}` : ""
    }`;
    navi(domain);
  };

  const cancelCoupon = trId => {
    console.log(trId);
  };

  return (
    <div className="lg:container lg:mx-auto p-2">
      {loaded ? (
        <>
          <div className="flex flex-row justify-start mb-2 gap-x-1">
            <input
              value={searchKeyword}
              className="border border-gray-300 p-2 w-80 block rounded font-neo"
              placeholder="이름/연락처로 검색"
              onChange={e => setSearchKeyword(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded transition-all duration-300"
              onClick={() => searchIt()}
            >
              <FaSearch />
            </button>
          </div>
          {couponList.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-blue-600 text-white p-2 border">
                    상품사진
                  </th>
                  <th className="bg-blue-600 text-white p-2 border">구매자</th>
                  <th className="bg-blue-600 text-white p-2 border">제품명</th>
                  <th className="bg-blue-600 text-white p-2 border">구매일</th>
                  <th className="bg-blue-600 text-white p-2 border">만료일</th>
                  <th className="bg-blue-600 text-white p-2 border">확인</th>
                  <th className="bg-blue-600 text-white p-2 border">취소</th>
                </tr>
              </thead>
              <tbody>
                {couponList.map((coupon, idx) => (
                  <tr key={idx} id={coupon.trId}>
                    <td className="w-fit border p-2 align-middle">
                      <div
                        className="w-12 h-12 mx-auto relative"
                        onMouseEnter={() => {
                          setHover(idx + 1);
                        }}
                        onMouseLeave={() => {
                          setHover(0);
                        }}
                      >
                        <img
                          src={coupon.goodsImgB}
                          className="w-full"
                          alt={coupon.goodsName}
                        />
                        {hover === idx + 1 && (
                          <div className="absolute top-[100%] left-[50%] w-[250px] h-[250px] p-1 border drop-shadow z-20 bg-white">
                            <img
                              src={coupon.goodsImgB}
                              className="w-full border"
                              alt={coupon.goodsName}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="align-middle border p-2">
                      <a
                        href={`/admin/userdetail?userId=${coupon.userId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-orange-500"
                      >
                        {coupon.userName}
                      </a>
                      <span className="font-neo text-gray-500">
                        ({getPhone(coupon.phone || "00000000000")})
                      </span>
                    </td>
                    <td className="align-middle border p-2">
                      {coupon.goodsName}
                    </td>
                    <td className="align-middle border p-2">
                      {dayjs(new Date(coupon.regDate)).format("YYYY-MM-DD")}
                    </td>
                    <td className="align-middle border p-2">
                      {dayjs(new Date(coupon.limitDate)).format("YYYY-MM-DD")}
                      {isExpire(coupon.limitDate) ? (
                        <span className="text-rose-500 ml-2">
                          {isExpire(coupon.limitDate)}
                        </span>
                      ) : null}
                    </td>
                    <td className="align-middle border p-2">
                      <button
                        className="transition duration-300 w-full border border-sky-500 hover:border-sky-700 text-sky-500 hover:text-sky-700 hover:bg-sky-100 text-lg p-2"
                        onClick={e => chkCoupon(coupon.trId)}
                      >
                        사용가능확인
                      </button>
                      <img
                        src={coupon.couponImgUrl}
                        alt={coupon.trId}
                        className="h-[20px] max-h-full"
                      />
                    </td>
                    <td className="align-middle border p-2">
                      <button
                        className="transition duration-300 w-full border border-rose-500 hover:border-rose-700 text-rose-500 hover:text-rose-700 hover:bg-rose-100 text-lg p-2"
                        onClick={e => cancelCoupon(coupon.trId)}
                      >
                        구매취소
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <Sorry message={loadList} />
              <div className="container mx-auto text-center mt-3">
                현재 보유중인 포인트로{" "}
                <Link
                  to="/list"
                  className="text-green-500 hover:text-green-700 hover:font-neoextra"
                >
                  쇼핑하기
                </Link>
              </div>
            </>
          )}
          <Pagenate
            keyword={keyword}
            pagenate={pagenate}
            page={Number(page)}
            totalPage={Number(totalPage)}
            pathName={pathName}
          />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default GifticonLog2;
