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

function GifticonLog() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const location = useLocation();
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const [couponList, setGifticonList] = useState([]);
  const [loadList, setLoadList] = useState("쿠폰을 불러오고 있습니다");
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getGifticonList(page);
    //eslint-disable-next-line
  }, [location]);

  const getGifticonList = async p => {
    setLoaded(false);
    const data = {
      page: p,
      size: 20,
    };
    await axiosInstance
      .post("/api/v1/shop/goods/all/buyList", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res);
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

  return (
    <div className="lg:container lg:mx-auto">
      {loaded ? (
        <>
          {couponList.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
              {couponList.map((coupon, idx) => (
                <div className="border p-2" key={idx}>
                  {coupon.userId}
                </div>
              ))}
            </div>
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

export default GifticonLog;
