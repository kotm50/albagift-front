import React, { useRef, useState } from "react";
import axios from "axios";
//import axiosInstance from "../Api/axiosInstance";
import { useSelector } from "react-redux";

function KakaoTest() {
  const user = useSelector(state => state.user);
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState("");

  const handleFileSelect = event => {
    // 파일이 선택되지 않은 경우 (사용자가 취소 버튼을 클릭한 경우)
    if (event.target.files.length === 0) {
      setSelectedFile(""); // selectedFile 상태를 빈 문자열로 설정
      return; // 함수 종료
    }

    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const saveIt = async () => {
    /*
    const data = {
      file: selectedFile,
    };
    */

    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post(
        "/api/v1/shop/admin/add/intv/excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: user.accessToken,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const saveIt2 = async () => {
    const data = {
      file: selectedFile,
    };

    try {
      const response = await axios.post("/api/v1/shop/add/intv/excel", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: user.accessToken,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-2 bg-[#eaeaea] flex justify-start gap-x-2 container mx-auto">
        <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
          테스트
        </div>
        <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:px-4 lg:py-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            multiple
            onChange={handleFileSelect}
          />
          테스트
        </div>
        <button className="bg-[#333] p-2 text-white" onClick={() => saveIt()}>
          버튼1
        </button>
        <button className="bg-[#dcf] p-2 text-white" onClick={() => saveIt2()}>
          버튼2
        </button>
      </div>
    </>
  );
}

export default KakaoTest;
