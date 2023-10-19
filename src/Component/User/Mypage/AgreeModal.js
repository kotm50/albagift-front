import React, { useState, useRef } from "react";

function AgreeModal(props) {
  const checkRef = useRef();
  const [agree, setAgree] = useState(false);
  const [alert, setAlert] = useState(false);
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none shadow-lg">
        <div className="relative lg:w-auto my-6 mx-auto w-11/12 lg:max-w-3xl">
          <div className="border rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none max-h-128 p-6">
            <h3 className="text-base font-neoextra mb-3">
              개인정보 수집 이용 동의
            </h3>
            <div className="relative p-2 lg:p-6 flex-auto overflow-y-auto font-neo text-sm bg-gray-50">
              본인인증 후 알바선물 서비스 제공을 위해 이름, 생년월일, 성별,
              중복가입 확인정보(DI), 암호화된 동일인 식별정보(CI), 내외국인
              정보를 회원 탈퇴 시 까지 저장합니다.
              <br />
              <br />
              수집한 개인정보는 본인확인, 보안 향상, 부정 이용 방지, 회원 관리,
              고객 문의 처리와 같은 알바선물 서비스 제공을 위해 사용합니다. 또한
              이력 확인 및 분쟁조정(타인에 의한 정보 변경 등)을 위해 변경 전
              본인 확인 정보는 1년간 보관 후 파기합니다.
              <br />
              <br />위 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으나,
              수집 및 이용 동의를 거부하실 경우 서비스 이용이 제한됩니다.
            </div>
            <div
              id="agreeIt"
              className={`grid grid-cols-7 gap-1 p-1 my-1 ${
                alert ? "bg-rose-50" : agree ? "bg-green-50" : "bg-white"
              }`}
            >
              <label
                htmlFor="agree"
                className={`text-sm font-neoextra text-left flex flex-col justify-center xl:pl-3 py-2 col-span-6 ${
                  alert ? "text-rose-500" : ""
                }`}
              >
                개인정보 수집 이용에 동의합니다
              </label>
              <div className="flex flex-col justify-center">
                <input
                  ref={checkRef}
                  type="checkbox"
                  id="agree"
                  onChange={e => {
                    setAgree(!agree);
                    setAlert(false);
                  }}
                  checked={agree}
                />
              </div>
            </div>
            {alert ? (
              <div className="my-2 text-center text-rose-500 text-xs">
                개인정보 수집 이용에 동의하셔야 수정 가능합니다
              </div>
            ) : null}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 text-sm">
              <div className="xl:col-span-4">
                <button
                  className="p-2 bg-green-500 text-white w-full border border-green-500 hover:bg-green-700 hover:border-green-700"
                  onClick={e => {
                    if (agree) {
                      props.doCert();
                    } else {
                      setAlert(true);
                      checkRef.current.focus();
                    }
                  }}
                >
                  본인인증 진행
                </button>
              </div>
              <div>
                <button
                  className="p-2 border border-rose-500 text-rose-500 w-full hover:bg-gray-100"
                  onClick={e => {
                    props.setModal(false);
                  }}
                >
                  창닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black h-screen overflow-hidden"></div>
    </>
  );
}

export default AgreeModal;
