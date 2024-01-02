import React from "react";

function PointHistoryList(props) {
  return (
    <>
      <div className="text-center p-1 hidden lg:block truncate">
        {props.doc.regDate}
      </div>
      <div
        className={`text-center p-1 flex flex-col justify-center ${
          props.doc.gubun === "B"
            ? "text-rose-700"
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
      <div
        className={`text-center p-1 flex flex-col justify-center ${
          props.doc.gubun === "B"
            ? "text-rose-700"
            : props.doc.gubun === "P"
            ? "text-green-700"
            : props.doc.gubun === "D"
            ? "text-rose-700"
            : ""
        }`}
      >
        {props.doc.gubun === "P" ? "+" : "-"}
        {props.doc.point.toLocaleString()}p
      </div>
      <div className="text-center p-1 flex flex-col justify-center">
        {props.doc.currPoint.toLocaleString()}p
      </div>
      <div className="text-center p-1 flex flex-col justify-center">
        <div className="w-full truncate">
          {props.doc.logType === "CP"
            ? props.doc.goodsName
            : props.doc.logType === "PR"
            ? "가입 지급"
            : props.doc.logType === "EX"
            ? "기간 만료"
            : props.doc.logType === "AP"
            ? "관리자 지급"
            : props.doc.logType === "AD"
            ? "관리자 차감"
            : props.doc.logType === "AB"
            ? "면접 지급"
            : props.doc.logType === "PO"
            ? "포인트 이관"
            : "확인불가"}
        </div>
      </div>
    </>
  );
}

export default PointHistoryList;
