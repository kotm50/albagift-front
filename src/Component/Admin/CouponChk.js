import React, { useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import CouponModal from "../User/Coupon/CouponModal";

function CouponChk(props) {
  const [chkStat, setChkStat] = useState(false);
  const [stat, setStat] = useState("");
  const [statColor, setStatColor] = useState(
    "border border-sky-500 hover:border-sky-700 text-sky-500 hover:text-sky-700 hover:bg-sky-100"
  );
  const [statDetail, setStatDetail] = useState("");
  const [remainAmt, setRemainAmt] = useState("");
  const [statCode, setStatCode] = useState("");
  const [couponModal, setCouponModal] = useState(false);

  const openDetail = () => {
    if (statCode === "01") {
      setCouponModal(true);
    } else if (statCode === "02" && remainAmt !== "해당 없음") {
      if (Number(remainAmt) > 0) {
        setCouponModal(true);
      } else {
        alert(`사용이 불가능한 쿠폰입니다\n사용불가사유 : ${statDetail}`);
        return false;
      }
    } else if (statCode === "") {
      alert("'사용가능 확인' 버튼을 눌러서\n쿠폰이 사용가능한지 확인해주세요");
      return false;
    } else {
      alert(`사용이 불가능한 쿠폰입니다\n사용불가사유 : ${statDetail}`);
      return false;
    }
  };

  const chkCoupon = async c => {
    const data = {
      trId: c,
    };
    await axiosInstance
      .post("/api/v1/shop/goods/coupons", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(async res => {
        if (res.data.couponDetail.pinStatusCd === "01") {
          setStatColor(
            "border border-sky-500 hover:border-sky-700 text-sky-500 hover:text-sky-700 hover:bg-sky-100"
          );

          setStat("사용가능");
        } else if (res.data.couponDetail.pinStatusCd === "02") {
          if (
            res.data.couponDetail.remainAmt !== "해당 없음" &&
            Number(res.data.couponDetail.remainAmt) > 0
          ) {
            setStatColor(
              "border border-sky-500 hover:border-sky-700 text-sky-500 hover:text-sky-700 hover:bg-sky-100"
            );

            setStat("사용가능");
          } else {
            setStatColor(
              "border border-indigo-500 hover:border-indigo-700 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100"
            );
            setStat("사용완료");
          }
        } else {
          setStatColor(
            "border border-rose-500 hover:border-rose-700 text-rose-500 hover:text-rose-700 hover:bg-rose-100"
          );
          setStat("사용불가");
        }
        setRemainAmt(res.data.couponDetail.remainAmt);
        setStatDetail(res.data.couponDetail.pinStatusNm);
        setStatCode(res.data.couponDetail.pinStatusCd);
        setChkStat(true);
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <button
            className="transition duration-300 w-full border border-teal-500 hover:border-teal-700 bg-teal-500 hover:bg-teal-700 text-white text-lg p-2"
            onClick={e => openDetail()}
          >
            쿠폰상세확인
          </button>
        </div>
        {!chkStat ? (
          <button
            className="transition duration-300 w-full border border-sky-500 hover:border-sky-700 text-sky-500 hover:text-sky-700 hover:bg-sky-100 text-lg p-2"
            onClick={e => chkCoupon(props.coupon.trId)}
          >
            사용가능확인
          </button>
        ) : (
          <div
            className={`transition duration-300 w-full ${statColor} text-lg text-center p-2`}
          >
            {stat}
          </div>
        )}
      </div>

      {couponModal ? <CouponModal /> : null}
    </>
  );
}

export default CouponChk;
