import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";

import queryString from "query-string";
import { useSelector } from "react-redux";

function Certification() {
  const location = useLocation();
  const kakao = useSelector(state => state.kakao);
  const [tokenId, setTokenId] = useState("");
  const [encData, setEncData] = useState("");
  const [integrityValue, setIntegrityValue] = useState("");
  const parsed = queryString.parse(location.search);
  const token_version_id = parsed.token_version_id || "";
  const enc_data = parsed.enc_data || "";
  const integrity_value = parsed.integrity_value || "";

  // useState를 사용하여 폼 데이터 상태 관리
  const [formAction, setFormAction] = useState("");

  // ...

  useEffect(() => {
    // integrityValue, tokenId, encData 값이 변경될 때마다 폼 액션 업데이트
    setFormAction(
      `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?` +
        `m=service&integrity_value=${integrityValue}&token_version_id=${tokenId}&enc_data=${encData}`
    );
  }, [integrityValue, tokenId, encData]);

  useEffect(() => {
    console.log(kakao);
    if (integrity_value === "" && enc_data === "" && token_version_id === "") {
      getData();
    } else {
      doCertification();
    }
    //eslint-disable-next-line
  }, [location]);

  const getData = async () => {
    axios
      .post("/api/v1/common/nice/sec/req")
      .then(res => {
        setTokenId(res.data.tokenVersionId);
        setEncData(res.data.encData);
        setIntegrityValue(res.data.integrityValue);
      })
      .catch(e => {
        alert("오류가 발생했습니다 관리자에게 문의해 주세요", e);
      });
  };

  const certPopUp = e => {
    e.preventDefault();
    console.log("팝업");

    // 폼 데이터를 URL 파라미터로 포함시켜 URL 생성
    const popupURL =
      `https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb?` +
      `m=service&token_version_id=${tokenId}&enc_data=${encData}&integrity_value=${integrityValue}`;
    console.log(popupURL);
    // 새 창 열기
    window.open(
      popupURL,
      "popForm",
      "toolbar=no, width=480, height=900, directories=no, status=no, scrollorbars=no, resizable=no"
    );
  };

  const doCertification = async () => {
    const data = {
      tokenVersionId: token_version_id,
      encData: enc_data,
      integrityValue: integrity_value,
    };
    axios
      .post("/api/v1/common/nice/dec/result", data)
      .then(res => {
        console.log(res);
        // 팝업 창을 닫는다
        window.close();

        // 지정한 페이지로 이동한다
        window.location.href = "https://albagift.shop/join"; // 성공한 페이지 URL로 변경
      })
      .catch(e => {
        alert("오류가 발생했습니다 관리자에게 문의해 주세요", e);
        // 팝업 창을 닫는다
        window.close();

        // 지정한 페이지로 이동한다
        window.location.href = "https://albagift.shop/"; // 성공한 페이지 URL로 변경
      });
  };
  return (
    <div className="container mx-auto h-full pt-10">
      <div id="loginArea" className="mx-auto p-2 grid grid-cols-1 gap-3 w-full">
        <div className="w-full">
          <button
            type="submit"
            className="transition duration-100 w-full p-2 bg-stone-700 hover:bg-stone-950 text-white rounded hover:animate-wiggle"
            disabled={integrityValue === ""}
            onClick={certPopUp}
          >
            본인인증
          </button>
        </div>
      </div>
    </div>
  );
}

export default Certification;
