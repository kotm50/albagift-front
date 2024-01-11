import React, { useState } from "react";

import ReactQuill from "react-quill";
import { modulesB } from "../Layout/QuillModule";
import "react-quill/dist/quill.snow.css";

import PopupDom from "../Kakao/PopupDom";
import PopupPostCode from "../Kakao/PopupPostCode";

function AddEmploy() {
  const [title, setTitle] = useState(""); //제목
  const [mainAddr, setMainAddr] = useState(""); // 근무지주소
  const [day, setDay] = useState(""); // 근무요일
  const [start, setStart] = useState(""); // 근무시작
  const [end, setEnd] = useState(""); //근무종료
  const [point1, setPoint1] = useState(""); //지원시 포인트
  const [point2, setPoint2] = useState(""); //면접시 포인트
  const [content, setContent] = useState(""); //업무상세내용
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  const timeChk = (event, type) => {
    const inputText = event.target.value;

    // 입력창의 글자 수가 4글자 이상인지 확인
    if (inputText.length >= 4) {
      // 입력 내용이 정확히 4글자이고 모두 숫자인 경우
      if (inputText.length === 4 && /^\d{4}$/.test(inputText)) {
        // ":"을 중간에 넣어 반환
        if (type === 0) {
          setStart(inputText.substring(0, 2) + ":" + inputText.substring(2));
        } else if (type === 1) {
          setEnd(inputText.substring(0, 2) + ":" + inputText.substring(2));
        }
      }
      // 입력 내용이 5글자이고, 3번째 글자가 ":"이 아닌 경우
      else if (inputText.length === 5 && inputText.charAt(2) !== ":") {
        // 경고창을 띄우고 입력창 초기화
        alert("양식이 잘못되었습니다 다시 입력하세요");
        if (type === 0) {
          setStart("");
        } else if (type === 1) {
          setEnd("");
        }
      }
    }
  };

  const handleFileSelect = event => {
    console.log(event.target.files[0]);
    if (event.target.files[0] === undefined) {
      setSelectedFile(null);
      setPreview(null);
      return false;
    }
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target.result); // 이미지를 Base64 문자열로 변환
      };
      reader.readAsDataURL(file);
    }
  };

  const saveIt = () => {
    console.log(title);
    const formData = new FormData();
    formData.append("file", selectedFile);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  };
  return (
    <div className="container mx-auto my-10 p-2">
      <h2 className="text-2xl lg:text-4xl text-center mb-2 font-neoextra">
        채용 등록
      </h2>
      <div className="mx-2 lg:mx-0 p-4 bg-white drop-shadow">
        <div className="grid grid-cols-1 divide-y divide-gray-300 border-y border-gray-500">
          <div
            id="title"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              공고제목
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="공고제목을 입력하세요"
                value={title}
                onChange={e => setTitle(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="area"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              근무지 위치
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4 flex justify-end">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="주소찾기 버튼을 눌러주세요"
                value={mainAddr}
                onChange={e => setMainAddr(e.currentTarget.value)}
                onBlur={e => setMainAddr(e.currentTarget.value)}
                onClick={e => {
                  e.preventDefault();
                  openPostCode();
                }}
                readOnly
              />
              <button
                className="h-full p-2 border-b lg:border-b-0 border-blue-500 hover:border-blue-700 text-white bg-blue-500 hover:bg-blue-700 text-xs lg:text-lg font-neoextra w-[120px] lg:w-[200px]"
                onClick={e => {
                  e.preventDefault();
                  openPostCode();
                }}
              >
                주소찾기
              </button>
            </div>
          </div>
          <div
            id="day"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              근무요일
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="근무요일을 입력하세요(주 5일, 주말, 등)"
                value={day}
                onChange={e => setDay(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="time"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              근무시간
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4 grid grid-cols-2 gap-x-4 relative">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="시작시간(09:00, 10:00 등)"
                value={start}
                onChange={e => setStart(e.currentTarget.value)}
                onBlur={e => timeChk(e, 0)}
                maxLength="5"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                ~
              </div>
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="종료시간(14:00, 18:00 등)"
                value={end}
                onChange={e => setEnd(e.currentTarget.value)}
                onBlur={e => timeChk(e, 1)}
                maxLength="5"
              />
            </div>
          </div>
          <div
            id="point1"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              지원포인트
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="number"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="지원만 해도 지급할 포인트입니다"
                value={point1}
                onChange={e => setPoint1(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="point2"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              면접포인트
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="number"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="면접 참석시 지급할 포인트입니다"
                value={point2}
                onChange={e => setPoint2(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="workphoto"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              내부사진
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:px-4 lg:py-6">
              <input type="file" accept="image/*" onChange={handleFileSelect} />
            </div>
          </div>
          {preview && (
            <div
              id="photopreview"
              className="flex justify-start flex-wrap border-x lg:border-x-0"
            >
              <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
                미리보기
              </div>
              <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-sm font-neo lg:px-4 lg:py-6">
                마우스 우클릭 후{" "}
                <span className="font-neoextra text-rose-500">
                  '새 탭에서 이미지 열기'
                </span>
                를 선택하시면 원본 크기로 확인 가능합니다
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "auto", height: "120px" }}
                />
              </div>
            </div>
          )}
          <div
            id="workcontent"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              업무내용
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <ReactQuill
                modules={modulesB}
                theme="snow"
                value={content}
                onChange={setContent}
                className={`p-0 border w-full bg-white h-full employment`}
                placeholder="기타 메모할 내용을 입력하세요"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center my-4">
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2 lg:text-lg"
            onClick={() => saveIt()}
          >
            채용등록
          </button>
        </div>
      </div>
      <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode
              onClose={closePostCode}
              setMainAddr={setMainAddr}
              modify={false}
            />
          </PopupDom>
        )}
      </div>
    </div>
  );
}

export default AddEmploy;
