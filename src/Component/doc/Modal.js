import React from "react";

import Privacy from "./Privacy";
import Terms from "./Terms";
import RefusalEmail from "./RefusalEmail";
import Privacy2 from "./Privacy2";
import Marketing from "./Marketing";

function Modal(props) {
  let domain = window.location.hostname;
  let parts = domain.split(".");
  let domainName = parts[parts.length - 2]; // 'albagift'
  let domainExtension = parts[parts.length - 1]; // 'com'
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={e => {
          props.setModalOn(false);
          props.setModalCount(0);
        }}
      >
        <div className="relative lg:w-auto my-6 mx-auto w-11/12 lg:max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-96 p-6">
            <h3 className="text-lg font-neoextra mb-3">
              {props.modalCount === 1
                ? "개인정보 처리방침"
                : props.modalCount === 2
                ? "이용약관"
                : props.modalCount === 3
                ? "E-Mail 무단수집 거부"
                : props.modalCount === 4
                ? "개인정보 수집 이용 동의"
                : props.modalCount === 5
                ? "마케팅 정보 수신 동의"
                : null}
            </h3>
            <div className="relative p-2 lg:p-6 flex-auto overflow-y-auto">
              {props.modalCount === 1 ? (
                <Privacy
                  domainName={domainName}
                  domainExtension={domainExtension}
                />
              ) : props.modalCount === 2 ? (
                <Terms
                  domainName={domainName}
                  domainExtension={domainExtension}
                />
              ) : props.modalCount === 3 ? (
                <RefusalEmail
                  domainName={domainName}
                  domainExtension={domainExtension}
                />
              ) : props.modalCount === 4 ? (
                <Privacy2
                  domainName={domainName}
                  domainExtension={domainExtension}
                />
              ) : props.modalCount === 5 ? (
                <Marketing
                  domainName={domainName}
                  domainExtension={domainExtension}
                />
              ) : null}
            </div>
          </div>
          <div className="text-white drop-shadow-lg">
            창을 닫으려면 아무 곳이나 눌러주세요
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default Modal;
