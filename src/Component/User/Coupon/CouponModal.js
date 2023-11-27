import React from "react";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import { CopyToClipboard } from "react-copy-to-clipboard";
import AlertModal from "../../Layout/AlertModal";

function CouponModal(props) {
  const handleCopy = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"복사완료"} // 제목
            message={`쿠폰번호가 복사되었습니다.\n필요한 곳에 붙여넣기 해주세요`} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
          />
        );
      },
    });
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative lg:w-auto my-6 mx-auto w-11/12 lg:max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-[98vh] p-6">
            <div className="relative p-2 lg:p-6 flex-auto overflow-y-hidden">
              <img src={props.coupon.couponImgUrl} alt="쿠폰이미지" />
            </div>
            {props.remainAmt !== "해당 없음" ? (
              <div className="text-lg my-1 p-2 text-center bg-gray-100">
                사용 가능한 금액 :{" "}
                <span className="font-neoheavy text-rose-500">
                  {Number(props.remainAmt).toLocaleString()}
                </span>{" "}
                원
              </div>
            ) : null}

            <div className="text-sm my-1 text-center xl:block hidden">
              쿠폰이미지를 우클릭 후{" "}
              <span className="font-neoextra text-sky-500">
                '이미지를 다른 이름으로 저장'
              </span>
              <br />
              하시면 저장해서 쓰실 수 있습니다
            </div>
            <div className="text-sm my-1 text-center xl:hidden">
              쿠폰이미지를 꾹 누르시고
              <br />
              <span className="font-neoextra text-sky-500">
                '이미지 다운로드'
              </span>
              를 누르시면
              <br />
              저장해서 쓰실 수 있습니다
            </div>
            <div className="text-lg font-neoextra my-1 text-center">
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
