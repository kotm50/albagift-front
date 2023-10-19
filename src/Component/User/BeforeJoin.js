import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { RiKakaoTalkFill } from "react-icons/ri";
import AlertModal from "../Layout/AlertModal";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

function BeforeJoin(props) {
  const [domain, setDomain] = useState("");
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  useEffect(() => {
    let domain = extractDomain();
    setDomain(domain);
    if (user.accessToken !== "") {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"오류"} // 제목
              message={"이미 로그인 하셨습니다.\n메인으로 이동합니다"} // 내용
              type={"alert"} // 타입 confirm(질문창), alert(경고창)
              yes={"확인"} // 확인버튼 제목
              doIt={goMain} // 확인시 실행할 함수
            />
          );
        },
      });
    }
    //eslint-disable-next-line
  }, []);

  const goMain = () => {
    navi("/");
  };

  const extractDomain = () => {
    let protocol = window.location.protocol; // 프로토콜을 가져옵니다. (예: http: 또는 https:)
    let hostname = window.location.hostname; // 도메인 이름을 가져옵니다.
    let port = window.location.port; // 포트 번호를 가져옵니다.

    // 로컬호스트인 경우 프로토콜과 포트를 포함하여 반환
    if (hostname === "localhost") {
      return `${protocol}//${hostname}:${port}`;
    }
    let fullDomain = `${protocol}//${hostname}`;
    // 일반 도메인인 경우 프로토콜과 함께 반환
    return fullDomain;
  };

  const kakaoLogin = e => {
    e.preventDefault();
    const apiKey = "e8b025aca3eb87648da9d341528bca5a";
    const redirectUrl = `${domain}/login`;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectUrl}&response_type=code`;
    window.location.href = kakaoURL;
  };
  return (
    <>
      <div
        id="beforejoin"
        className="mx-auto p-2 grid grid-cols-1 gap-3 w-full rounded-lg drop-shadow-lg"
      >
        <div
          className="absolute top-2 right-2 w-10 h-10 p-2 hover:bg-gray-100 text-center rounded-lg hover:cursor-pointer"
          onClick={e => props.setModal(false)}
        >
          X
        </div>
        <h2 className="text-xl p-2 xl:text-center">
          환영합니다! <br className="xl:hidden" />
          회원가입을 진행합니다
        </h2>
        <div className="w-full">
          <button
            className="transition duration-100 w-full bg-emerald-500 hover:bg-emerald-700 p-3 text-white rounded hover:animate-wiggle"
            onClick={e => navi("/cert")}
          >
            알바선물 계정으로 가입하기
          </button>
        </div>
        <div className="w-full">
          <button
            className="transition duration-100 w-full kakaobtn p-2 text-black rounded hover:animate-wiggle"
            onClick={kakaoLogin}
          >
            <RiKakaoTalkFill size={28} className="inline-block" /> 카카오
            계정으로 가입
          </button>
        </div>
      </div>
      <div
        className="opacity-25 fixed inset-0 z-40 bg-black h-screen overflow-hidden"
        onClick={e => props.setModal(false)}
      ></div>
    </>
  );
}

export default BeforeJoin;
