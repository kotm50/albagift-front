import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

import ReactQuill from "react-quill";
import { modulesB } from "../Layout/QuillModule";
import "react-quill/dist/quill.snow.css";

import PopupDom from "../Kakao/PopupDom";
import PopupPostCode from "../Kakao/PopupPostCode";
import axios from "axios";

function AddEmploy() {
  const user = useSelector(state => state.user);
  const [title, setTitle] = useState(""); //제목
  const [hireStart, setHireStart] = useState(""); // 채용종료일
  const [hireEnd, setHireEnd] = useState(""); // 채용종료일
  const [totalApply, setTotalApply] = useState(""); // 채용인원
  const [mainAddr, setMainAddr] = useState(""); // 근무지주소
  const [day, setDay] = useState(""); // 근무요일
  const [workTime, setWorkTime] = useState(""); // 근무시간
  const [point1, setPoint1] = useState(""); //지원시 포인트
  const [point2, setPoint2] = useState(""); //면접시 포인트
  const [content, setContent] = useState(""); //업무상세내용

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const fileInputRef = useRef(null);

  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  const handleFileSelect = event => {
    const files = event.target.files;

    // 파일 선택 취소 처리
    if (!files || files.length === 0) {
      setSelectedFiles([]);
      setPreviews([]);
      return;
    }

    // 파일 수 제한 검사
    if (files.length > 5) {
      alert("최대 5장까지만 등록 가능합니다\n확인 후 다시 시도해 주세요");
      return;
    }

    // FileList 객체를 배열로 변환
    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);

    // 미리보기 생성
    const updatedPreviews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = e => {
        updatedPreviews.push(e.target.result);
        // 모든 파일에 대한 미리보기가 준비되면 상태 업데이트
        if (updatedPreviews.length === files.length) {
          setPreviews(updatedPreviews);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveIt = async () => {
    try {
      const data = {
        title: title,
        compAddr: mainAddr,
        workDay: day,
        workTime: workTime,
        applyPoint: point1,
        intvPoint: point2,
        content: content,
        totalApplicants: totalApply,
        postingStartDate: hireStart,
        postingEndDate: hireEnd,
      };
      const formData = new FormData();
      selectedFiles.forEach((file, idx) => {
        formData.append(`files`, file);
      });

      formData.append(
        "job",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );

      const response = await axios.post(
        "/api/v1/board/add/job/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: user.accessToken,
          },
        }
      );
      console.log(response);
      if (response.data.code === "C000") {
        setSelectedFiles([]);
        setPreviews([]);
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("에러", error);
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
            id="hireStart"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              채용시작일
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="date"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="채용 시작일을 입력하세요"
                value={hireEnd}
                onChange={e => setHireStart(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="hireEnd"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              채용종료일
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="date"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="채용 종료일을 입력하세요"
                value={hireEnd}
                onChange={e => setHireEnd(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="hireCount"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              채용 인원
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="채용인원을 입력하세요"
                value={totalApply}
                onChange={e => setTotalApply(e.currentTarget.value)}
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
                placeholder="예시) 9시 ~ 18시, 5시간 근무 등"
                value={workTime}
                onChange={e => setWorkTime(e.currentTarget.value)}
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
              사진 올리기
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:px-4 lg:py-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />
              최대 3장까지 등록 가능합니다
            </div>
          </div>
          <div
            id="photopreview"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              미리보기
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:px-4 lg:py-6">
              {previews.length > 0 ? (
                <>
                  <div className="hidden lg:block text-sm mb-2">
                    마우스 오른쪽 버튼을 누르고{" "}
                    <span className="text-rose-500">'새 탭으로 열기'</span>를
                    선택하시면 원본 이미지를 확인 하실 수 있습니다
                  </div>
                  <div className="lg:hidden text-sm mb-2">
                    이미지를 꾹 누르고
                    <span className="text-rose-500">'새 탭으로 열기'</span>를
                    선택하시면 원본 이미지를 확인 하실 수 있습니다
                  </div>
                  <div className="flex flex-row justify-start gap-x-2 w-full flex-wrap">
                    {previews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt="Preview"
                        style={{
                          width: "auto",
                          height: "120px",
                          maxWidth: "240px",
                          minWidth: "120px",
                        }}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
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
