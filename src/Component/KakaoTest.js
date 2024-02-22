import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function KakaoTest() {
  // 파일 상태 관리
  const [selectedFile, setSelectedFile] = useState(null);
  const navi = useNavigate();

  // 파일 선택 핸들러
  const handleFileChange = event => {
    // 사용자가 파일을 선택했는지 확인
    if (event.target.files.length > 0) {
      // 첫 번째 파일만 선택
      const file = event.target.files[0];

      // 파일이 이미지인지 확인
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        alert("이미지 파일만 업로드 가능합니다.");
      }
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();
    // 단일 파일을 formData에 추가
    formData.append("file", selectedFile); // 'files' 대신 'file' 사용하고, 단일 파일만 추가

    try {
      const response = await axios.post("/api/v1/board/file/test", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      // 업로드 성공 후 처리
    } catch (error) {
      console.error("Upload error", error);
      // 업로드 실패 처리
    }
  };

  return (
    <div className="mx-auto container">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        className="p-2 bg-indigo-500 hover:bg-indigo-700 text-white"
        onClick={() => uploadFile()}
      >
        파일업로드
      </button>
      <button
        onClick={() => {
          navi("/joinback", {
            state: {
              promo: null,
            },
          });
        }}
        className="bg-indigo-500 text-white p-2"
      >
        일반가입
      </button>{" "}
      <button
        onClick={() => {
          navi("/joinback", {
            state: {
              promo: "SNS",
            },
          });
        }}
        className="bg-indigo-500 text-white p-2"
      >
        프로모션가입
      </button>
    </div>
  );
}

export default KakaoTest;
