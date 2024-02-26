import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import ReactQuill from "react-quill";
import { modulesB } from "../Layout/QuillModule";
import "react-quill/dist/quill.snow.css";

import PopupDom from "../Kakao/PopupDom";
import PopupPostCode from "../Kakao/PopupPostCode";
import axios from "axios";

import { timeList } from "./Timer";
import { useNavigate } from "react-router-dom";

function AddEmploy() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const [compNum, setCompNum] = useState(""); //고객사번호
  const [title, setTitle] = useState(""); //제목
  const [phone, setPhone] = useState(""); //연락처
  const [manager, setManager] = useState(""); //채용담당자
  const [openRecruit, setOpenRecruit] = useState(false); // 채용종료일
  const [hireStart, setHireStart] = useState(""); // 채용종료일
  const [hireEnd, setHireEnd] = useState(""); // 채용종료일
  const [mainAddr, setMainAddr] = useState(""); // 근무지주소
  const [detailAddr, setDetailAddr] = useState(""); // 근무지주소
  const [day, setDay] = useState(""); // 근무요일
  const [workTime, setWorkTime] = useState(""); // 근무시간
  const [salary, setSalary] = useState(""); //지원시 포인트
  const [point1, setPoint1] = useState(""); //지원시 포인트
  const [point2, setPoint2] = useState(""); //면접시 포인트
  const [content, setContent] = useState(""); //업무상세내용
  const [qualification, setQualification] = useState(""); //지원자격
  const [welfare, setWelfare] = useState(""); //복지혜택
  const [sido, setSido] = useState(null);
  const [sigungu, setSigungu] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  //근무요일
  const [mon, setMon] = useState(false);
  const [tue, setTue] = useState(false);
  const [wed, setWed] = useState(false);
  const [thu, setThu] = useState(false);
  const [fri, setFri] = useState(false);
  const [sat, setSat] = useState(false);
  const [sun, setSun] = useState(false);

  const [weekday, setWeekday] = useState(false);
  const [weekend, setWeekend] = useState(false);

  // 체크박스의 변경 이벤트를 처리하는 함수
  const handleChange = event => {
    // 체크박스의 체크 상태에 따라 openRecruit 상태 업데이트
    setOpenRecruit(event.target.checked);
    if (event.target.checked) {
      setHireStart("");
      setHireEnd("");
    }
  };

  useEffect(() => {
    if (startTime !== "" && endTime !== "") {
      setWorkTime(`${startTime} ~ ${endTime}`);
    } else {
      setWorkTime("");
    }
  }, [startTime, endTime]);

  useEffect(() => {
    let list = [];
    if (mon) {
      list.push("월");
      setWeekday(false);
      setWeekend(false);
    }
    if (tue) {
      list.push("화");
      setWeekday(false);
      setWeekend(false);
    }
    if (wed) {
      list.push("수");
      setWeekday(false);
      setWeekend(false);
    }
    if (thu) {
      list.push("목");
      setWeekday(false);
      setWeekend(false);
    }
    if (fri) {
      list.push("금");
      setWeekday(false);
      setWeekend(false);
    }
    if (sat) {
      list.push("토");
      setWeekday(false);
      setWeekend(false);
    }
    if (sun) {
      list.push("일");
      setWeekday(false);
      setWeekend(false);
    }
    setDay(list.join(", "));
  }, [mon, tue, wed, thu, fri, sat, sun]);

  useEffect(() => {
    if (weekday) {
      setMon(false);
      setTue(false);
      setWed(false);
      setThu(false);
      setFri(false);
      setSat(false);
      setSun(false);
      setWeekend(false);
      setDay("평일");
    } else {
      setDay("");
    }
  }, [weekday]);

  useEffect(() => {
    if (weekend) {
      setMon(false);
      setTue(false);
      setWed(false);
      setThu(false);
      setFri(false);
      setSat(false);
      setSun(false);
      setWeekday(false);
      setDay("주말");
    } else {
      setDay("");
    }
  }, [weekend]);

  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState("");
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
    // 파일이 선택되지 않은 경우 (사용자가 취소 버튼을 클릭한 경우)
    if (event.target.files.length === 0) {
      setSelectedFile(""); // selectedFile 상태를 빈 문자열로 설정
      setPreview(""); // 미리보기도 제거
      return; // 함수 종료
    }

    const file = event.target.files[0];
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);

      // 파일 미리보기 생성
      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target.result); // 미리보기 상태 업데이트
      };
      reader.readAsDataURL(file);
    } else {
      alert("이미지 파일만 업로드 가능합니다.");
    }
  };

  const saveIt = async () => {
    const result = await test();
    if (result !== "완료") {
      return alert(result);
    }
    try {
      const data = {
        boardId: "B05", //게시판 아이디
        compNum: compNum, // 고객사 번호
        title: title, // 제목
        mainAddr: mainAddr, // 근무지
        compArea: `${sido || "지원 후"} ${sigungu || "안내"}`, //근무지 지역(시/군/구까지)
        detailAddr: detailAddr, //근무지 상세
        workDay: day, // 근무요일
        workTime: workTime, // 근무시간
        //applyPoint: point1,
        salary: salary,
        intvPoint: point2, // 면접포인트
        content: escapeHTML(content), // 상세내용
        qualification: escapeHTML(qualification), // 지원자격
        welfare: escapeHTML(welfare), // 복지혜택
        postingStartDate: hireStart === "" ? null : hireStart, // 채용 시작일
        postingEndDate: hireEnd === "" ? null : hireEnd, // 채용 종료일
        manager: manager, //채용담당자
        phone: phone, //담당자연락처
        openRecruit: openRecruit ? "Y" : "N",
      };

      const formData = new FormData();
      formData.append("file", selectedFile);

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
      if (response.data.code === "C000") {
        setSelectedFile("");
        setPreview("");
        fileInputRef.current.value = "";

        const confirm = window.confirm(
          "입력 완료, 목록으로 이동할까요?\n추가로 등록하시려면 '취소'를 눌러주세요"
        );
        if (confirm) {
          navi("/employ/list");
        } else {
          return true;
        }
      }
    } catch (error) {
      console.error("에러", error);
    }
  };

  const test = () => {
    if (compNum === "") {
      return "고객사 번호를 입력하세요";
    }
    if (title === "") {
      return "공고 제목을 입력하세요";
    }

    if (manager === "") {
      return "채용담당자를 입력하세요.\n비공개시 '채용담당자'라고 입력하세요";
    }
    if (phone === "") {
      return "연락처를 입력하세요";
    }

    if (!openRecruit) {
      if (hireStart === "") {
        return "채용시작일을 입력하시거나\n상시채용 공고에 체크해주세요";
      }
      if (hireEnd === "") {
        return "채용종료일을 입력하시거나\n상시채용 공고에 체크해주세요";
      }
    }
    if (mainAddr === "") {
      return "주소찾기를 눌러 근무지 주소를 입력하세요";
    }
    if (detailAddr === "") {
      return "근무지 근처 역 또는 정류장을 알려주세요";
    }

    if (day === "") {
      return "근무요일을 입력하세요";
    }
    if (workTime === "") {
      return "근무시간을 입력하세요";
    }
    if (startTime === endTime) {
      return "시작시간과 입력시간이 동일합니다\n확인 후 다시 시도해주세요";
    }
    if (salary === "") {
      return "급여를 숫자만 입력해 주세요";
    }
    if (point2 === "") {
      return "면접포인트를 입력하세요, 없으면 0을 입력해 주세요";
    }
    /*
    if (selectedFile.length < 1) {
      if (content === "") {
        return "업무내용을 입력하세요";
      }
    }
*/
    return "완료";
  };

  // HTML 암호화
  const escapeHTML = text => {
    return text
      .replace(/</g, "＜")
      .replace(/>/g, "＞")
      .replace(/=/g, "＝")
      .replace(/\(/g, "（")
      .replace(/\)/g, "）")
      .replace(/,/g, "，")
      .replace(/"/g, "＂")
      .replace(/:/g, "：")
      .replace(/;/g, "；")
      .replace(/\//g, "／");
  };
  // HTML복호화
  /*
  const unescapeHTML = text => {
    return text
      .replace(/＜/g, "<")
      .replace(/＞/g, ">")
      .replace(/＝/g, "=")
      .replace(/（/g, "(")
      .replace(/）/g, ")")
      .replace(/，/g, ",")
      .replace(/＂/g, '"')
      .replace(/：/g, ":")
      .replace(/；/g, ";")
      .replace(/／/g, "/");
  };
  */
  const handlePhone = event => {
    const value = event.target.value;
    // 입력 값이 숫자만 포함되어 있는지 확인하는 정규 표현식
    const regex = /^[0-9]*$/;

    // 입력 값이 숫자만 포함되어 있다면 상태 업데이트
    if (regex.test(value)) {
      setPhone(value);
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
            id="adNum"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              고객사 번호
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="폼메일 고객사 번호 4자리 입력"
                value={compNum}
                onChange={e => setCompNum(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="manager"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              채용담당자
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="채용담당자 이름 직책 입력"
                value={manager}
                onChange={e => setManager(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="phone"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              담당자연락처
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="담당자 연락처 숫자만 입력"
                value={phone}
                onChange={handlePhone}
              />
            </div>
          </div>
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
            id="hire"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              상시채용
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4 flex justify-start gap-x-1">
              <input
                id="openRecruit"
                type="checkbox"
                className="h-full w-auto"
                checked={openRecruit}
                onChange={handleChange}
              />
              <label htmlFor="openRecruit" className="p-2">
                상시 채용 공고입니다
              </label>
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
                className="focus:bg-blue-100 py-2 px-4 border-b w-full lg:w-1/3"
                placeholder="채용 시작일을 입력하세요"
                value={hireStart}
                onChange={e => setHireStart(e.currentTarget.value)}
                disabled={openRecruit}
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
                className="focus:bg-blue-100 py-2 px-4 border-b w-full lg:w-1/3"
                placeholder="채용 종료일을 입력하세요"
                value={hireEnd}
                onChange={e => setHireEnd(e.currentTarget.value)}
                disabled={openRecruit}
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
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4 flex justify-end lg:justify-start">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full lg:w-1/3"
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
            id="areaDetail"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              근무지 상세
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="예시)신당동 3번출구 도보 8분/7212번 버스 동화동 하차 도보 3분"
                value={detailAddr}
                onChange={e => setDetailAddr(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="day"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              근무요일
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-2 grid grid-cols-7 gap-x-1 gap-y-1">
              <button
                className={`p-2 ${
                  !mon ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setMon(!mon)}
              >
                월
              </button>
              <button
                className={`p-2 ${
                  !tue ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setTue(!tue)}
              >
                화
              </button>
              <button
                className={`p-2 ${
                  !wed ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setWed(!wed)}
              >
                수
              </button>
              <button
                className={`p-2 ${
                  !thu ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setThu(!thu)}
              >
                목
              </button>
              <button
                className={`p-2 ${
                  !fri ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setFri(!fri)}
              >
                금
              </button>
              <button
                className={`p-2 ${
                  !sat ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setSat(!sat)}
              >
                토
              </button>
              <button
                className={`p-2 ${
                  !sun ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setSun(!sun)}
              >
                일
              </button>
              <button
                className={`p-2 ${
                  !weekday ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setWeekday(!weekday)}
              >
                월~금
              </button>
              <button
                className={`p-2 ${
                  !weekend ? "bg-gray-500" : "bg-green-500"
                } text-white`}
                onClick={() => setWeekend(!weekend)}
              >
                주말
              </button>
            </div>
          </div>
          <div
            id="time"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              근무시간
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4 flex justify-start gap-x-4">
              <select
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                onChange={e => setStartTime(e.currentTarget.value)}
              >
                <option value="">시작 시간</option>
                {timeList.map((time, idx) => (
                  <option value={time} key={idx}>
                    {time}
                  </option>
                ))}
              </select>
              <span className="flex flex-col justify-center">~</span>
              <select
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                onChange={e => setEndTime(e.currentTarget.value)}
              >
                <option value="">종료 시간</option>
                {timeList.map((time, idx) => (
                  <option value={time} key={idx}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            id="salary"
            className="justify-start flex-wrap border-x lg:border-x-0 flex"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              월 급여
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
                className="focus:bg-blue-100 py-2 px-4 border-b w-full"
                placeholder="급여를 숫자만 입력하세요"
                value={salary}
                onChange={e => setSalary(e.currentTarget.value)}
              />
            </div>
          </div>
          <div
            id="point1"
            className="justify-start flex-wrap border-x lg:border-x-0 hidden"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              지원포인트
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <input
                type="text"
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
                type="text"
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
              1장만 등록 가능합니다
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
              {preview !== "" ? (
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
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "auto",
                        height: "120px",
                        maxWidth: "240px",
                        minWidth: "120px",
                      }}
                    />
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
          <div
            id="workcontent"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              지원자격
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <ReactQuill
                modules={modulesB}
                theme="snow"
                value={qualification}
                onChange={setQualification}
                className={`p-0 border w-full bg-white h-full employment`}
                placeholder="기타 메모할 내용을 입력하세요"
              />
            </div>
          </div>
          <div
            id="workcontent"
            className="flex justify-start flex-wrap border-x lg:border-x-0"
          >
            <div className="w-full lg:w-[20%] px-4 lg:py-6 py-2 font-neoextra truncate break-keep text-xs lg:text-lg lg:text-right bg-gray-100">
              복지혜택
            </div>
            <div className="w-full lg:w-fit lg:flex-1 text-xs lg:text-lg font-neo lg:p-4">
              <ReactQuill
                modules={modulesB}
                theme="snow"
                value={welfare}
                onChange={setWelfare}
                className={`p-0 border w-full bg-white h-full employment`}
                placeholder="기타 메모할 내용을 입력하세요"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center my-4 gap-x-5">
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
              setSido={setSido}
              setSigungu={setSigungu}
              isEmploy={"true"}
              modify={false}
            />
          </PopupDom>
        )}
      </div>
    </div>
  );
}

export default AddEmploy;
