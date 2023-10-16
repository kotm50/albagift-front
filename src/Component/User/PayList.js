import React from "react";
function PayList(props) {
  return (
    <>
      <div className="text-center p-1 hidden xl:block">
        {props.doc.regDate.substring(2, 10)}
      </div>
      <div className="text-center p-1 flex flex-col justify-center">
        {props.doc.intvDate.substring(2, 10)} <br className="xl:hidden" />
        {props.doc.intvTime}:{props.doc.intvMin}
      </div>
      <div
        className={`text-center p-1  flex flex-col justify-center ${
          props.doc.status === "Y"
            ? "text-green-500"
            : props.doc.status === "N"
            ? "text-rose-500"
            : null
        }`}
      >
        {props.doc.status === "S"
          ? "심사중"
          : props.doc.status === "Y"
          ? "지급완료"
          : props.doc.status === "N"
          ? "지급불가"
          : null}
      </div>
      <div className="text-center p-1  flex flex-col justify-center">
        {props.doc.status === "S"
          ? "심사중"
          : props.doc.status === "Y"
          ? Number(props.doc.result).toLocaleString()
          : props.doc.result}
      </div>
    </>
  );
}

export default PayList;
