import React, { useState } from "react";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import AlertModal from "../../Layout/AlertModal";

function EmailModal(props) {
  const [email, setEmail] = useState("");
  const [isErr, setIsErr] = useState(false);

  //이메일 및 중복검사
  const chkEmail = async () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(email)) {
      setIsErr(false);
      return true;
    } else {
      setIsErr(true);
      return false;
    }
  };

  const errAlert = m => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"오류"} // 제목
            message={m} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
          />
        );
      },
    });
  };

  const emailConfirm = () => {
    const chk = chkEmail(email);
    if (chk) {
      props.setEmailModal(false);
      props.editIt("/api/v1/user/myinfo/editemail", "email", email);
    } else {
      errAlert("이메일 양식이 잘못되었습니다");
      return false;
    }
  };
  const cancelChange = () => {
    props.setEmailModal(false);
    setEmail("");
    setIsErr(false);
  };
  return (
    <>
      <form onSubmit={e => emailConfirm()}>
        <div
          id="editArea"
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 outline-none focus:outline-none shadow-lg"
        >
          <div className="lg:p-2">
            <div className="my-2 mx-auto p-2 border rounded-lg grid grid-cols-1 gap-3 bg-gray-50 w-full">
              <h2 className="my-3 text-2xl font-neoextra text-center">
                이메일 변경하기
              </h2>
              <div id="email" className={`grid grid-cols-1`}>
                <label
                  htmlFor="inputEmail"
                  className={`text-sm text-left flex flex-col justify-center mb-2 `}
                >
                  새 이메일주소
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputEmail"
                    length="21"
                    className={`border ${
                      isErr ? "border-red-500" : undefined
                    } p-2 w-full text-sm`}
                    value={email || ""}
                    onChange={e => {
                      setEmail(e.currentTarget.value);
                      setIsErr(false);
                    }}
                    onBlur={e => {
                      setEmail(e.currentTarget.value);
                      chkEmail();
                    }}
                    placeholder="이메일 주소를 입력하세요"
                  />
                </div>
              </div>
              {isErr && (
                <div className="text-sm text-rose-500">
                  이메일 양식이 잘못되었습니다
                </div>
              )}
              <div className="p-2 flex justify-center gap-x-2">
                <button
                  className="bg-teal-500 hover:bg-teal-700 text-white py-2 px-10"
                  onClick={e => emailConfirm()}
                >
                  수정하기
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white"
                  onClick={e => cancelChange()}
                >
                  취소하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="opacity-25 fixed inset-0 z-40 bg-black h-screen overflow-hidden"></div>
    </>
  );
}

export default EmailModal;
