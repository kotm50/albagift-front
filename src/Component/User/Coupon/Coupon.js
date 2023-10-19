import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

import axios from "axios";
import queryString from "query-string";
import CouponList from "./CouponList";
import { logoutAlert } from "../../LogoutUtil";
import Pagenate from "../../Layout/Pagenate";

import Sorry from "../../doc/Sorry";
import Loading from "../../Layout/Loading";

function Coupon() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const location = useLocation();
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const [couponList, setCouponList] = useState([]);
  const [loadList, setLoadList] = useState("쿠폰을 불러오고 있습니다");
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getCouponList(page);
    //eslint-disable-next-line
  }, []);

  const getCouponList = async p => {
    setLoaded(false);
    const data = {
      page: p,
      size: 20,
    };
    await axios
      .post("/api/v1/shop/goods/buyList", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
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
        setCouponList(res.data.couponList);
        setLoaded(true);
      })
      .catch(e => {
        console.log(e);
        setCouponList([]);
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
    <div className="xl:container xl:mx-auto">
      {loaded ? (
        <>
          {couponList.length > 0 ? (
            <div className="grid grid-cols-2 xl:grid-cols-5 gap-2">
              {couponList.map((coupon, idx) => (
                <div className="border p-2" key={idx}>
                  <CouponList coupon={coupon} />
                </div>
              ))}
            </div>
          ) : (
            <Sorry message={loadList} />
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

export default Coupon;
