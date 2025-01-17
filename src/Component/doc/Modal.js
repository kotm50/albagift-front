import React from "react";

import Privacy from "./Privacy";
import Terms from "./Terms";
import RefusalEmail from "./RefusalEmail";
import Privacy2 from "./Privacy2";
import Marketing from "./Marketing";
import JobRec from "./JobRec";

function Modal(props) {
  let domain = window.location.hostname;
  let parts = domain.split(".");
  let domainName = parts[parts.length - 2]; // 'albagift'
  let domainExtension = parts[parts.length - 1]; // 'com'
  return (
    <>
      <div className="fixed top-1/2 left-1/2 min-w-[200px] min-h-[100px] h-[95vh] overflow-hidden -translate-x-1/2 -translate-y-1/2 z-[2000] bg-white rounded-lg p-10">
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
            : props.modalCount === 6
            ? "추천 채용안내를 위한 개인정보 처리"
            : null}
        </h3>
        <button
          className="fixed w-[36px] h-[36px] font-neoextra top-10 right-10"
          onClick={() => {
            props.setModalCount(0);
            props.setModalOn(false);
          }}
        >
          x
        </button>
        <div className="relative p-2 lg:p-6 flex-auto h-[90vh] overflow-y-auto">
          {props.modalCount === 1 ? (
            <Privacy
              domainName={domainName}
              domainExtension={domainExtension}
            />
          ) : props.modalCount === 2 ? (
            <Terms domainName={domainName} domainExtension={domainExtension} />
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
          ) : props.modalCount === 6 ? (
            <JobRec domainName={domainName} domainExtension={domainExtension} />
          ) : null}
        </div>
      </div>
      <div
        className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-y-hidden bg-black bg-opacity-50 z-[1000]"
        onClick={() => {
          props.setModalCount(0);
          props.setModalOn(false);
        }}
      ></div>
    </>
  );
}

export default Modal;
