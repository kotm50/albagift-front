import React, { useState, useEffect } from "react";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

import axios from "axios";
import CouponList from "./CouponList";
import AlertModal from "../../Layout/AlertModal";

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
        console.log(res.data);
        if (res.data.code === "E999") {
          logoutAlert(res.data.message);
          return false;
        }
        if (res.data.couponList.length === 0) {
          setLoadList("쿠폰이 없습니다");
        }
        setCouponList(res.data.couponList.reverse());
      })
      .catch(e => console.log(e));
  };

  const logoutAlert = m => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"로그인 에러"} // 제목
            message={m} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"다시 로그인 하기"} // 확인버튼 제목
            doIt={logout} // 확인시 실행할 함수
          />
        );
      },
    });
  };
  const logout = async () => {
    await axios
      .post("/api/v1/user/logout", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        dispatch(clearUser());
        navi("/login");
      })
      .catch(e => {
        console.log(e);
      });
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
