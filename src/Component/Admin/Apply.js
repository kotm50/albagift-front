import React from "react";

function Apply(props) {
  return (
    <div
      className={`grid grid-cols-4 xl:w-5/6 p-2 xl:mx-auto ${
        props.idx % 2 === 0 && "bg-gray-100"
      }`}
    >
      <div>이름 : {props.apply.name || "없음"}</div>
      <div>연락처 : {props.apply.phone || "없음"}</div>
      <div>포인트 : {props.apply.point}</div>
    </div>
  );
}

export default Apply;
