import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function CouponModal(props) {
  const handleCopy = () => {
    alert(
      `쿠폰번호가 복사되었습니다 필요한 곳에 붙여넣기 해주세요\n복사한 쿠폰번호:${props.coupon.pinNo}`
    );
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative lg:w-auto my-6 mx-auto w-11/12 lg:max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-screen p-6">
            <div className="relative p-2 lg:p-6 flex-auto overflow-y-auto">
              <img src={props.coupon.couponImgUrl} alt="쿠폰이미지" />
            </div>
            <div className="text-sm my-2 text-center xl:block hidden">
              쿠폰이미지를 우클릭 후{" "}
              <span className="font-neoextra text-sky-500">
                '이미지를 다른 이름으로 저장'
              </span>
              <br />
              하시면 저장해서 쓰실 수 있습니다
            </div>
            <div className="text-sm my-2 text-center xl:hidden">
              쿠폰이미지를 꾹 누르시고
              <span className="font-neoextra text-sky-500">
                '이미지 다운로드'
              </span>
              <br />를 누르시면 저장해서 쓰실 수 있습니다
            </div>
            <div className="text-lg font-neoextra my-2 text-center">
              쿠폰번호 :{" "}
              <span className="text-red-500">{props.coupon.pinNo}</span>
            </div>
            <div className="p-2 grid grid-cols-2 gap-3">
              <CopyToClipboard text={props.coupon.pinNo} onCopy={handleCopy}>
                <button className="bg-teal-500 hover:bg-teal-700 p-2 text-white">
                  쿠폰번호 복사하기
                </button>
              </CopyToClipboard>
              <button
                className="bg-gray-500 p-2 text-white"
                onClick={e => {
                  props.setCouponModal(false);
                }}
              >
                창닫기
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default CouponModal;
