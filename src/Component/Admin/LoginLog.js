import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Pagenate from "../Layout/Pagenate";
import { getNewToken } from "../../Reducer/userSlice";
import AlertModal from "../Layout/AlertModal";
import Sorry from "../doc/Sorry";
import Loading from "../Layout/Loading";

function LoginLog() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const startDate = parsed.startDate || "";
  const endDate = parsed.endDate || "";
  const [loaded, setLoaded] = useState(false);
  const [loginLogList, setLoginLogList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  useEffect(() => {
    setLoginLogList([]);
    setTotalPage(1);
    setPagenate([]);
    setSearchKeyword("");
    if (keyword !== "") {
      setSearchKeyword(keyword);
    }
    if (startDate !== "") {
      setInputStartDate(startDate);
    }
    if (endDate !== "") {
      setInputEndDate(endDate);
    }
    getLog(page, keyword, startDate, endDate);
    //eslint-disable-next-line
  }, [location]);

  //날짜수정
  useEffect(() => {
    if (inputStartDate !== "") {
      setSearchStartDate(dayjs(inputStartDate).format("YYYY-MM-DD"));
    } else {
      setSearchStartDate("");
    }
    if (inputEndDate !== "") {
      setSearchEndDate(dayjs(inputEndDate).format("YYYY-MM-DD"));
    } else {
      setSearchEndDate("");
    }
    //eslint-disable-next-line
  }, [inputStartDate, inputEndDate]);

  const user = useSelector(state => state.user);
  const getLog = async (p, k, s, e) => {
    setLoaded(false);
    let data = {
      page: p,
      size: 20,
    };
    if (k !== "") {
      data.searchKeyword = k;
    }
    if (s !== "") {
      data.startDate = s;
    }
    if (e !== "") {
      data.endDate = e;
    }
    await axios
      .get("/api/v1/user/admin/get/log", {
        params: data,
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.headers.authorization) {
          dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        setLoaded(true);
        if (res.data.loginLogList.length === 0) {
          return false;
        }
        const totalP = res.data.totalPages;
        setTotalPage(res.data.totalPages);
        const pagenate = generatePaginationArray(p, totalP);
        setPagenate(pagenate);
        let log = [];
        let loginLogList = res.data.loginLogList;
        loginLogList.forEach(element => {
          let data = {};
          data.date = element.regDate;
          data.name = element.userName;
          data.id = element.userId;
          data.role = element.role === "ROLE_USER" ? "회원" : "관리자";
          data.phone = getPhone(element.phone);
          data.ip = element.clientIP;
          log.push(data);
        });
        setLoginLogList(log);
      })
      .catch(e => {
        setLoaded(true);
      });

    function generatePaginationArray(currentPage, totalPage) {
      let paginationArray = [];

      // 최대 페이지가 4 이하인 경우
      if (Number(totalPage) <= 4) {
        for (let i = 1; i <= totalPage; i++) {
          paginationArray.push(i);
        }
        return paginationArray;
      }

      // 현재 페이지가 1 ~ 3인 경우
      if (Number(currentPage) <= 3) {
        return [1, 2, 3, 4, 5];
      }

      // 현재 페이지가 totalPage ~ totalPage - 2인 경우
      if (Number(currentPage) >= Number(totalPage) - 2) {
        return [
          Number(totalPage) - 4,
          Number(totalPage) - 3,
          Number(totalPage) - 2,
          Number(totalPage) - 1,
          Number(totalPage),
        ];
      }

      // 그 외의 경우
      return [
        Number(currentPage) - 2,
        Number(currentPage) - 1,
        Number(currentPage),
        Number(currentPage) + 1,
        Number(currentPage) + 2,
      ];
    }
  };

  //휴대폰변환
  const getPhone = str => {
    if (str.length !== 11) {
      // 문자열이 11자리가 아닌 경우에 대한 예외 처리
      return "연락처 미등록";
    }

    const firstPart = str.substring(0, 3); // 1, 2, 3번째 문자열
    const secondPart = "****"; // 4, 5, 6, 7번째 문자열은 '*'로 대체
    const thirdPart = str.substring(7, 11); // 8, 9, 10, 11번째 문자열

    // 조합하여 원하는 형식의 문자열을 만듭니다.
    const transformedString = `${firstPart}-${secondPart}-${thirdPart}`;
    return transformedString;
  };

  const searchIt = () => {
    if (searchKeyword.length === 1) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"조회 실패"} // 제목
              message={"검색어는 두 글자 이상 입력하세요"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      return false;
    }
    let isAfter = true;
    if (inputStartDate !== "") {
      isAfter = inputStartDate <= inputEndDate;
    }
    if (!isAfter) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"조회 실패"} // 제목
              message={"시작일은 종료일보다 이전이어야 합니다"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
              doIt={dateReset}
            />
          );
        },
      });
      return false;
    }
    let domain = `${pathName}${
      searchKeyword !== "" ? `?keyword=${searchKeyword}` : ""
    }${searchKeyword !== "" ? "&" : "?"}${
      searchStartDate !== "" && searchEndDate !== ""
        ? `startDate=${searchStartDate}&endDate=${searchEndDate}`
        : ""
    }`;
    navi(domain);
  };
  const dateReset = () => {
    setInputStartDate("");
    setInputEndDate("");
  };

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchIt();
    }
  };
  return (
    <>
      {loaded ? (
        <div className="mt-2 container p-4 mx-auto bg-white rounded-lg">
          <div className="flex flex-row justify-start gap-3 mb-4">
            <div className="font-neoextra text-lg p-2">검색어</div>
            <div>
              <input
                type="text"
                value={searchKeyword}
                className="border border-gray-300 p-2 w-80 block rounded-lg font-neo"
                placeholder="이름 또는 연락처를 입력해 주세요"
                onChange={e => setSearchKeyword(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="grid grid-cols-2">
              <div className="flex justify-start">
                <div className="font-neoextra text-lg p-2">조회 시작일</div>
                <input
                  type="date"
                  value={inputStartDate}
                  className="border border-gray-300 p-2 w-80 block rounded-lg font-neo"
                  placeholder="이름 또는 연락처를 입력해 주세요"
                  onChange={e => setInputStartDate(e.currentTarget.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="flex justify-start">
                <div className="font-neoextra text-lg p-2">조회 종료일</div>
                <input
                  type="date"
                  value={inputEndDate}
                  className="border border-gray-300 p-2 w-80 block rounded-lg font-neo"
                  placeholder="이름 또는 연락처를 입력해 주세요"
                  onChange={e => setInputEndDate(e.currentTarget.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-sm text-white"
              onClick={searchIt}
            >
              검색하기
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-700 py-2 px-4 rounded-sm text-white"
              onClick={e => {
                setSearchKeyword("");
                setInputStartDate("");
                setInputEndDate("");
              }}
            >
              초기화
            </button>
          </div>
          {loginLogList.length > 0 ? (
            <>
              <table className="w-full">
                <thead>
                  <tr className="bg-green-700 text-white font-neoextra">
                    <td className="p-2 text-center border">아이디</td>
                    <td className="p-2 text-center border">이름</td>
                    <td className="p-2 text-center border">구분</td>
                    <td className="p-2 text-center border">연락처</td>
                    <td className="p-2 text-center border">시간</td>
                    <td className="p-2 text-center border">ip주소</td>
                  </tr>
                </thead>
                <tbody>
                  {loginLogList.map((log, idx) => (
                    <tr
                      key={idx}
                      className={`${idx % 2 === 1 ? "bg-yellow-50" : null}`}
                    >
                      <td className="p-2 text-center border">{log.id}</td>
                      <td className="p-2 text-center border">{log.name}</td>
                      <td className="p-2 text-center border">{log.role}</td>
                      <td className="p-2 text-center border">{log.phone}</td>
                      <td className="p-2 text-center border">
                        {dayjs(log.date).format(
                          "YYYY년 MM월 DD일 HH시 mm분 ss초"
                        )}
                      </td>
                      <td className="p-2 text-center border">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagenate
                pagenate={pagenate}
                page={Number(page)}
                totalPage={Number(totalPage)}
                pathName={pathName}
                keyword={keyword}
                startDate={startDate}
                endDate={endDate}
              />
            </>
          ) : (
            <Sorry message={"조회된 내역이 없습니다"} />
          )}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default LoginLog;
