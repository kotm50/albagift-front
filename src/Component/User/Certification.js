import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";

import queryString from "query-string";
import Loading from "../Layout/Loading";

function Certification() {
  const location = useLocation();

  const parsed = queryString.parse(location.search);
  const token_version_id = parsed.token_version_id || "";
  const enc_data = parsed.enc_data || "";
  const integrity_value = parsed.integrity_value || "";

  let tokenId = "";
  let encData = "";
  let integrityValue = "";

  useEffect(() => {
    if (integrity_value === "" && enc_data === "" && token_version_id === "") {
      getData();
    } else {
      doCertification();
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    console.log(tokenId, encData, integrityValue);
    if (tokenId !== "" && encData !== "" && integrityValue) {
      const formElement = document.getElementById("yourFormId"); // 여기서 'yourFormId'를 폼의 id로 변경해야 합니다.
      console.log(formElement);
      if (formElement) {
        formElement.submit(); // 폼 자동 제출
      }
    }
    //eslint-disable-next-line
  }, [tokenId, encData, integrityValue]);

  const getData = async () => {
    await axios
      .post("/api/v1/common/nice/sec/req")
      .then(res => {
        tokenId = res.data.tokenVersionId;
        encData = res.data.encData;
        integrityValue = res.data.integrityValue;
      })
      .catch(e => {
        alert("오류가 발생했습니다 관리자에게 문의해 주세요", e);
        window.opener.parentCallback({});
        window.close();
      });
  };
  const doCertification = async () => {
    const data = {
      tokenVersionId: token_version_id,
      encData: enc_data,
      integrityValue: integrity_value,
    };

    window.opener.parentCallback(data);
    window.close();
  };
  return (
    <div className="container mx-auto h-full pt-10">
      <form
        id="cert"
        action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
        target="_blank"
      >
        <input type="hidden" id="m" name="m" value="service" />
        <input
          type="hidden"
          id="token_version_id"
          name="token_version_id"
          value={tokenId}
        />
        <input type="hidden" id="enc_data" name="enc_data" value={encData} />
        <input
          type="hidden"
          id="integrity_value"
          name="integrity_value"
          value={integrityValue}
        />
      </form>
      <div className="fixed z-50 bg-white top-0 bottom-0 left-0 right-0 w-screen h-screen">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loading />
        </div>
      </div>
    </div>
  );
}

export default Certification;
