import { useState } from "react";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import AlertModal from "./Layout/AlertModal"; // 모달창 커스텀 컴포넌트

function ModalSample() {
  const [cfm, setCfm] = useState("");
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
            doIt={doIt} // 확인시 실행할 함수
          />
        );
      },
    });
  };
  const doIt = () => {
    setCfm("Y");
  };

  const doNot = () => {
    setCfm("N");
  };
  return (
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
          onClick={e => setCfm("")}
        >
          메세지 돌려놓기
        </button>
        <br />
        <br />
        {cfm === "Y"
          ? "당신은 확인버튼을 눌렀습니다"
          : cfm === "N"
          ? "당신은 취소버튼을 눌렀습니다"
          : "모달버튼을 눌러보세요"}
      </div>
    </div>
  );
}

export default ModalSample;
