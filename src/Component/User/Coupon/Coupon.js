import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

import axios from "axios";
import CouponList from "./CouponList";
import { logoutAlert } from "../../LogoutUtil";

function Coupon() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const [couponList, setCouponList] = useState([]);
  const [loadList, setLoadList] = useState("쿠폰을 불러오고 있습니다");

  useEffect(() => {
    getCouponList();
    //eslint-disable-next-line
  }, []);

  const getCouponList = async () => {
    await axios
      .post("/api/v1/shop/goods/buyList", null, {
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
          setLoadList("쿠폰이 없습니다");
        }
        setCouponList(res.data.couponList.reverse());
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="xl:container xl:mx-auto">
      {couponList.length > 0 ? (
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-2">
          {couponList.map((coupon, idx) => (
            <div className="border p-2" key={idx}>
              <CouponList coupon={coupon} />
            </div>
          ))}
        </div>
      ) : (
        loadList
      )}
    </div>
  );
}

export default Coupon;
