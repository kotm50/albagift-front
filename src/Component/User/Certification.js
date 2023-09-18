import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";

function Certification() {
  const location = useLocation();
  const [tokenId, setTokenId] = useState("");
  const [encData, setEncData] = useState("");
  const [integrityValue, setIntegrityValue] = useState("");

  useEffect(() => {
    getData();
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
  return (
    <div className="container mx-auto h-full pt-10">
      <form action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb">
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
        <div
          id="loginArea"
          className="mx-auto p-2 grid grid-cols-1 gap-3 w-full"
        >
          <div className="w-full">
            <button
              className="transition duration-100 w-full p-2 bg-stone-700 hover:bg-stone-950 text-white rounded hover:animate-wiggle"
              disabled={integrityValue === ""}
            >
              본인인증
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Certification;
