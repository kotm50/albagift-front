import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import EditUser from "./Mypage/EditUser";
import PwdChk from "./Mypage/PwdChk";

function Mypage() {
  const user = useSelector(state => state.user);
  const [checkPwd, setCheckPwd] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [domain, setDomain] = useState("");
  const [kakao, setKakao] = useState(false);
  const [code, setCode] = useState("");
  useEffect(() => {
    setSortParams();
    let domain = extractDomain();
    setDomain(domain);
    //eslint-disable-next-line
  }, []);

  const setSortParams = () => {
    setSearchParams(searchParams);
    const code = searchParams.get("code");
    if (code) {
      setCode(code);
      setKakao(true);
      setCheckPwd(true);
    }
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
    console.log(fullDomain);
    // 일반 도메인인 경우 프로토콜과 함께 반환
    return fullDomain;
  };

  const kakaoLogin = e => {
    e.preventDefault();
    const apiKey = "e8b025aca3eb87648da9d341528bca5a";
    const redirectUrl = `${domain}/mypage`;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectUrl}&response_type=code`;
    window.location.href = kakaoURL;
  };

  return (
    <>
      {!checkPwd ? (
        <PwdChk user={user} setCheckPwd={setCheckPwd} />
      ) : (
        <EditUser
          user={user}
          kakaoLogin={kakaoLogin}
          code={code}
          kakao={kakao}
        />
      )}
    </>
  );
}

export default Mypage;
