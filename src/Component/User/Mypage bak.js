import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import EditUser from "./Mypage/EditUser";
import PwdChk from "./Mypage/PwdChk";

function Mypage() {
  const { checked } = useParams();
  const user = useSelector(state => state.user);
  const [checkPwd, setCheckPwd] = useState(false);
  const [domain, setDomain] = useState("");
  useEffect(() => {
    if (checked) {
      setCheckPwd(true);
    }
    let domain = extractDomain();
    setDomain(domain);
    //eslint-disable-next-line
  }, []);

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

  return (
    <>
      {!checkPwd ? (
        <PwdChk domain={domain} user={user} setCheckPwd={setCheckPwd} />
      ) : (
        <EditUser domain={domain} user={user} />
      )}
    </>
  );
}

export default Mypage;
