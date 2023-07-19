import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import axios from "axios";
import CouponList from "./CouponList";

function Coupon() {
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
        console.log(res.data);
        if (res.data.couponList.length === 0) {
          setLoadList("쿠폰이 없습니다");
        }
        setCouponList(res.data.couponList);
        console.log(couponList);
      })
      .catch(e => console.log(e));
  };
  return (
    <div>
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
