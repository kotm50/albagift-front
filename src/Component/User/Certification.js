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
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
    setTokenId("");
    setEncData("");
    setIntegrityValue("");
    console.log(tokenId, encData, integrityValue);
  };
  return (
    <div className="container mx-auto h-full pt-10">
      <form action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb">
        <div
          id="loginArea"
          className="mx-auto p-2 grid grid-cols-1 gap-3 w-full"
        >
          <div className="w-full">
            <button
              className="transition duration-100 w-full p-2 text-black rounded hover:animate-wiggle"
              onClick={e => console.log(e)}
            ></button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Certification;
