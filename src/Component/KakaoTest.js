import { useState } from "react";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import AlertModal from "./Layout/AlertModal"; // 모달창 커스텀 컴포넌트

function KakaoTest() {
  const [isAgree, setIsAgree] = useState(false);
  const [cfm, setCfm] = useState("모달테스트 버튼을 눌러보세요");
  const formatPhoneNumber = phoneNumber => {
    return phoneNumber.slice(-4);
  };

  //컨펌모달 예시
  const confirm1 = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"컨펌창 제목입니다"} // 제목
            message={"컨펌창 내용입니다"} // 내용
            type={"confirm"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
            no={"취소"} // 취소버튼 제목
            doIt={doIt} // 확인시 실행할 함수
            doNot={doNot} // 취소시 실행할 함수
          />
        );
      },
    });
  };

  //얼럿모달 예시
  const confirm2 = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"경고창 제목입니다"} // 제목
            message={"경고창 내용입니다"} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
            doIt={doAlert} // 확인시 실행할 함수
          />
        );
      },
    });
  };
  const doIt = () => {
    setCfm("컨펌창 확인버튼을 눌렀습니다");
  };

  const doAlert = () => {
    setCfm("얼럿창 확인버튼을 눌렀습니다");
  };

  const doNot = () => {
    setCfm("컨펌창 취소버튼을 눌렀습니다");
  };
  return (
    <div className="container mx-auto">
      <div className="flex justify-end gap-2 text-lg font-neoextra">
        <div className="flex items-center">
          <input
            id="agreeUser"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={isAgree}
            onChange={e => {
              setIsAgree(!isAgree);
            }}
          />
          <label
            htmlFor="agreeUser"
            className="ml-2 text-gray-900 dark:text-gray-300"
          >
            동의회원만 보기
          </label>
        </div>
      </div>
      <div className="text-center text-3xl font-neo">
        {isAgree ? "동의회원만 봅니다" : "전체회원을 봅니다"}
        <br />
        {formatPhoneNumber("010-2578-5450")} <br />
        {formatPhoneNumber("01012345678")} <br />
      </div>
      <div className="container mx-auto">
        <h2 className="text-3xl mb-3">모달창 샘플페이지</h2>
        <div className="text-center">
          <button className="p-2 bg-green-500 text-white" onClick={confirm1}>
            컨펌모달테스트
          </button>{" "}
          <button className="p-2 bg-sky-500 text-white" onClick={confirm2}>
            얼럿모달테스트
          </button>{" "}
          <button
            className="p-2 bg-gray-500 text-white"
            onClick={e => setCfm("모달테스트 버튼을 눌러보세요")}
          >
            메세지 돌려놓기
          </button>
          <br />
          <br />
          {cfm}
        </div>
      </div>
    </div>
  );
}

export default KakaoTest;
