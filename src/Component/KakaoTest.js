import React, { useState } from "react";

// AWS SDK v3 사용
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// AWS S3 클라이언트 초기화
const s3Client = new S3Client({
  region: "ap-northeast-2", // 예: 'us-west-2'
  // 자격 증명 방법에 따라 추가 설정이 필요할 수 있습니다.
});

function KakaoTest() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = event => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        alert("이미지 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const fileName = `${Date.now()}-${selectedFile.name}`;
    const params = {
      Bucket: "api-echo-bucket", // S3 버킷 이름
      Key: fileName, // 파일 이름
      Body: selectedFile, // 업로드할 파일 객체
      ContentType: selectedFile.type, // 파일 타입
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      alert("파일 업로드 성공!");
    } catch (err) {
      console.error("S3 파일 업로드 오류:", err);
      alert("파일 업로드 실패.");
    }
  };

  return (
    <div className="mx-auto container">
      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {selectedFile && (
          <div>
            <p>선택된 파일: {selectedFile.name}</p>
            <button onClick={handleUpload}>업로드</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default KakaoTest;
