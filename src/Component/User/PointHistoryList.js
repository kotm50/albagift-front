import React from "react";

function PointHistoryList(props) {
  return (
    <>
      <div className="text-center p-1 hidden xl:block truncate">
        {props.doc.regDate}
      </div>
      <div
        className={`text-center p-1 flex flex-col justify-center ${
          props.doc.gubun === "B"
            ? "text-blue-700"
            : props.doc.gubun === "P"
            ? "text-green-700"
            : props.doc.gubun === "D"
            ? "text-rose-700"
            : ""
        }`}
      >
        {props.doc.gubun === "B"
          ? "구매"
          : props.doc.gubun === "P"
          ? "지급"
          : props.doc.gubun === "D"
          ? "차감"
          : "확인불가"}
      </div>
      <div className="text-center p-1 flex flex-col justify-center">
        {props.doc.point.toLocaleString()}p
      </div>
      <div className="text-center p-1 flex flex-col justify-center truncate">
        {props.doc.gubun === "B"
          ? props.doc.goodsName
          : props.doc.gubun === "P"
          ? "관리자 지급"
          : props.doc.gubun === "D"
          ? "관리자 차감"
          : "확인불가"}
      </div>
      <div className="text-center p-1 flex flex-col justify-center">
        {props.doc.currPoint.toLocaleString()}p
      </div>
    </>
  );
}

export default PointHistoryList;
