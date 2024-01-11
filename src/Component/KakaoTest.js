import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function KakaoTest() {
  const user = useSelector(state => state.user);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    await axios
      .post("/api/v1/board/image/test", formData, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => console.log("성공?", res))
      .catch(e => console.log("실패", e));
  };

  return (
    <div className="mx-auto container">
      <input type="file" accept="image/*" onChange={handleFileSelect} />
      <button onClick={handleUpload} className="bg-indigo-500 text-white p-2">
        업로드
      </button>
    </div>
  );
}

export default KakaoTest;
