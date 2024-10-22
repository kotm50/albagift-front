import React from "react";
import axios from "axios";
//import axiosInstance from "../Api/axiosInstance";
function KakaoTest() {
  const sendIt = async () => {
    const data = {
      msg: "테스트입니다",
      smsType: "S",
      sPhone1: "010",
      sPhone2: "7745",
      sPhone3: "6059",
      rPhone: "010-8031-5450",
    };
    console.log(data);
    try {
      const res = await axios.post("/api/v1/formMail/sendSms", data);
      console.log(res);
    } catch (e) {
      // 오류 메시지와 상태 코드를 함께 출력
      if (e.response) {
        console.error(`Error: ${e.message}, Status: ${e.response.status}`);
      } else {
        console.error(`Error: ${e.message}`);
      }
    }
  };
  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit  p-2 bg-white border rounded-lg">
        <button
          className="p-2 bg-green-600 text-white"
          onClick={() => {
            sendIt();
          }}
        >
          문자전송 테스트
        </button>
      </div>
    </>
  );
}

export default KakaoTest;
