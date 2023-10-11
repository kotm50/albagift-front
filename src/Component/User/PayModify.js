import React from "react";

function PayModify() {
  const submit = () => {
    console.log("수정하기");
  };
  return (
    <>
      <div className="py-2 font-neoextra text-center bg-blue-50 hover:bg-gray-50">
        면접날짜 수정
      </div>
      <div className="py-2 text-center bg-white hover:bg-gray-50">면접시간</div>
      <div className="py-2 font-neoextra text-center bg-blue-50 hover:bg-gray-50">
        면접시간 수정
      </div>
      <div className="py-2 text-center bg-white hover:bg-gray-50">
        지급액/사유<span className="text-sm font-neo">(불가시)</span>
      </div>

      <div className="py-2 font-neoextra text-center bg-blue-50 hover:bg-gray-50">
        수정하기
      </div>
      <div className="p-2 text-center bg-white hover:bg-gray-50 col-span-2">
        <button
          className="bg-green-500 py-1 px-4 hover:bg-green-700 text-center text-white w-full"
          onClick={e => submit()}
        >
          버튼을 눌러 수정하기
        </button>
      </div>
    </>
  );
}

export default PayModify;
