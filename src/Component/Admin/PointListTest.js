import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import queryString from "query-string";

import dayjs from "dayjs";
import "dayjs/locale/ko";

import Loading from "../Layout/Loading";
import Pagenate from "../Layout/Pagenate";
import AlertModal from "../Layout/AlertModal";
import Sorry from "../doc/Sorry";
import { logoutAlert } from "../LogoutUtil";
import axios from "axios";
//import axiosInstance from "../../Api/axiosInstance";

import { MdMenu, MdOutlineGridOn } from "react-icons/md";

function PointListTest() {
  const companyRef = useRef();
  const navi = useNavigate();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [list, setList] = useState([]);
  const user = useSelector(state => state.user);
  const [selectedDocs, setSelectedDocs] = useState(null);
  const [selectedDocsId, setSelectedDocsId] = useState(null);
  const location = useLocation();
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const startDate = parsed.startDate || "";
  const endDate = parsed.endDate || "";
  const select = parsed.select || "";
  const agree = parsed.agree || "";
  const sType = parsed.sType || "";
  const [point, setPoint] = useState(0);
  const [reason, setReason] = useState("");
  const [selectReason, setSelectReason] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [company, setCompany] = useState("");
  const [isAgree, setIsAgree] = useState(false);
  const [searchType, setSearchType] = useState("");

  const [listType, setListType] = useState(0);

  useEffect(() => {
    setList([]);
    setTotalPage(1);
    setPagenate([]);
    if (keyword !== "") {
      setSearchKeyword(keyword);
    }
    if (startDate !== "") {
      setInputStartDate(startDate);
    }
    if (endDate !== "") {
      setInputEndDate(endDate);
    }
    if (select !== "") {
      setSelectReason(select);
    }
    if (agree !== "") {
      if (agree === "Y") {
        setIsAgree(true);
      } else {
        setIsAgree(false);
      }
    } else {
      setIsAgree(false);
    }
    if (sType !== "") {
      setSearchType(sType);
    } else {
      setSearchType("");
    }
    loadList(page, keyword, startDate, endDate, select, agree, sType);
    //eslint-disable-next-line
  }, [location, user.accessToken]);

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

  //셀렉트박스or체크박스 변경
  useEffect(() => {
    searchIt();
    //eslint-disable-next-line
  }, [selectReason, isAgree]);

  /*
  const checkDocs = (doc, checked) => {
    if (checked) {
      // 체크박스가 선택된 경우, 아이템을 배열에 추가
      setSelectedDocs([
        ...selectedDocs,
        { postId: doc.postId, phone: doc.phone, name: doc.userName },
      ]);
      setSelectedDocsId([
        ...selectedDocsId,
        { postId: doc.postId, boardId: "B02" },
      ]);
    } else {
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedDocs(selectedDocs.filter(item => item.postId !== doc.postId));
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedDocsId(
        selectedDocsId.filter(item => item.postId !== doc.postId)
      );
    }
  };
  */

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchIt();
    }
  };

  const handleReasonSelect = e => {
    setSelectReason(e.currentTarget.value);
  };

  const handleNumberKeyDown = e => {
    const allowedKeys = ["Tab", "Delete", "Backspace", "Enter"];
    if (!((e.key >= "0" && e.key <= "9") || allowedKeys.includes(e.key))) {
      e.preventDefault();
    }
  };

  const pointSubmit = async b => {
    if (b && point === 0) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"오류"} // 제목
              message={"지급 포인트를 입력해 주세요"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      return false;
    }
    if (!b && reason === "") {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"오류"} // 제목
              message={"지급불가 사유를 입력해 주세요"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      return false;
    }
    if (company === "" || company.length < 4) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"오류"} // 제목
              message={"고객사번호를 정확히 입력해 주세요"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      return false;
    }
    const postList = [
      {
        postId: selectedDocsId, // 문자열이어야 함
        boardId: selectedDocs?.info?.[0]?.boardId || "B02", // boardId 추출 필요
        companyCode: company,
        status: b ? "Y" : "N",
        result: b ? undefined : reason,
      },
    ];

    const request = { postList };
    console.log(request);
    await axios
      .patch("/api/v1/board/admin/paymt/sts", request, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"완료"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
        }
        loadList(page, keyword, startDate, endDate, select, agree, sType);
        setPoint(0);
        setSelectedDocs(null);
        setSelectedDocsId(null);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const loadList = async (p, k, s, e, r, a, t) => {
    //p=페이지,k=키워드,s=시작일,e=종료일,r=셀렉트,a=동의,t=검색타입
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
    if (r !== "") {
      data.status = r;
    }
    if (a === "Y") {
      data.agreeYn = a;
    }
    if (t !== "") {
      data.searchType = Number(t);
    }
    await axios
      .get("/api/v1/board/admin/posts", {
        params: data,
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        if (res.data.code === "E999") {
          logoutAlert(
            null,
            null,
            dispatch,
            clearUser,
            navi,
            user,
            res.data.message
          );
          return false;
        }
        setLoaded(true);
        if (res.data.code === "C000") {
          const totalP = res.data.totalPages;
          setTotalPage(res.data.totalPages);
          const pagenate = generatePaginationArray(p, totalP);
          setPagenate(pagenate);
        }
        const postList = res.data.postList;

        if (postList && postList.length > 0) {
          postList.sort((a, b) => {
            // "S" 상태인 경우 우선순위를 높여서 먼저 정렬
            if (a.status === "S" && b.status !== "S") {
              return -1; // a를 b보다 앞에 배치
            } else if (a.status !== "S" && b.status === "S") {
              return 1; // b를 a보다 앞에 배치
            } else {
              return 0; // a와 b의 상태가 같거나 "S"가 아닌 경우 순서 유지
            }
          });
        }
        setList(postList ?? [{ postId: "없음" }]);
      })
      .catch(e => {
        console.log(e);
        setLoaded(true);
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={"알 수 없는 오류가 발생했습니다"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
                doIt={goBack} // 확인시 실행할 함수
              />
            );
          },
        });
        return false;
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

  const goBack = () => {
    navi(-1);
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
    }${searchStartDate !== "" ? "&" : ""}${
      selectReason !== "" ? `select=${selectReason}` : ""
    }${selectReason !== "" ? "&" : ""}${isAgree ? "agree=Y" : ""}${
      isAgree ? "&" : ""
    }${searchType !== "" ? `sType=${searchType}` : ""}`;
    navi(domain);
  };
  const dateReset = () => {
    setSearchKeyword("");
    setInputStartDate("");
    setInputEndDate("");
  };
  const getPhone = str => {
    if (str.length !== 11) {
      // 문자열이 11자리가 아닌 경우에 대한 예외 처리
      return "미입력";
    }

    const firstPart = str.substring(0, 3); // 1, 2, 3번째 문자열
    const secondPart = str.substring(3, 7); // 4, 5, 6, 7번째 문자열은 '*'로 대체
    const thirdPart = str.substring(7, 11); // 8, 9, 10, 11번째 문자열

    // 조합하여 원하는 형식의 문자열을 만듭니다.
    const transformedString = `${firstPart}-${secondPart}-${thirdPart}`;
    return transformedString;
  };
  const handleChangeSelect = e => {
    setReason(e.currentTarget.value);
  };

  const handleSearchType = e => {
    setSearchType(e.currentTarget.value);
  };
  /*
  const payments = (p, b) => {
    let payArr = [];

    p.forEach(p => {
      p.companyCode = company;
      if (b) {
        p.status = "Y";
        p.result = point;
      } else {
        p.status = "N";
        p.result = reason;
      }
      payArr.push(p);
    });
    return payArr;
  };
  */

  const handleDocClick = async doc => {
    try {
      const res = await fetch(
        `/adapi/check?name=${encodeURIComponent(
          doc.userName
        )}&phone=${encodeURIComponent(getPhone(doc.phone))}`
      );
      const data = await res.json();

      if (
        !data.exists ||
        !Array.isArray(data.matched) ||
        data.matched.length === 0
      ) {
        alert("해당 지원자는 면접 대상자가 아닙니다.");
        return;
      }

      setSelectedDocs({
        name: doc.userName,
        phone: doc.phone,
        info: data.matched,
      });
      setSelectedDocsId([doc.postId]); // ← 이거 빠지면 지급처리 실패
    } catch (err) {
      console.error("검사 실패:", err);
      alert("서버 오류로 확인에 실패했습니다.");
    }
  };

  return (
    <>
      {loaded ? (
        <>
          <h2 className="p-4 text-center font-neoheavy text-3xl relative container mx-auto">
            지급 신청 목록
            <div className="grid grid-cols-2 gap-2 absolute top-1/2 right-2 -translate-y-1/2 ">
              <div className="flex justify-end gap-2 text-sm font-neoextra container mx-auto pr-4">
                <div className="flex items-center">
                  <input
                    id="agreeUser"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={isAgree}
                    onChange={e => setIsAgree(!isAgree)}
                  />
                  <label
                    htmlFor="agreeUser"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    동의회원만 보기
                  </label>
                </div>
              </div>
              <select
                className="p-2 bg-white border font-medium text-sm hidden lg:block font-neobold lg:w-60"
                onChange={handleReasonSelect}
                value={selectReason}
              >
                <option value="">구분</option>
                <option value="S">지급대기</option>
                <option value="Y">지급완료</option>
                <option value="N">지급불가</option>
              </select>
            </div>
          </h2>
          <div className="flex justify-between container mx-auto pl-2 pr-2 mb-4">
            <div className="flex flex-row justify-start gap-3">
              <div className="font-neo text-lg">
                <select
                  className="p-2 bg-white border font-medium"
                  onChange={handleSearchType}
                  value={searchType}
                >
                  <option value="">검색항목</option>
                  <option value="1">이름/연락처</option>
                  <option value="2">고객사번호</option>
                </select>
              </div>
              <div>
                <input
                  value={searchKeyword}
                  className="border border-gray-300 p-2 w-80 block rounded-lg font-neo"
                  placeholder="이름/연락처/고객사번호를 입력해 주세요"
                  onChange={e => setSearchKeyword(e.currentTarget.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-start">
                <div className="font-neoextra text-lg p-2">조회 시작일</div>
                <input
                  type="date"
                  value={inputStartDate}
                  className="border border-gray-300 p-2 w-64 block rounded-lg font-neo"
                  placeholder="이름 또는 연락처를 입력해 주세요"
                  onChange={e => setInputStartDate(e.currentTarget.value)}
                />
              </div>
              <div className="flex justify-start">
                <div className="font-neoextra text-lg p-2">조회 종료일</div>
                <input
                  type="date"
                  value={inputEndDate}
                  className="border border-gray-300 p-2 w-64 block rounded-lg font-neo"
                  placeholder="이름 또는 연락처를 입력해 주세요"
                  onChange={e => setInputEndDate(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
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
          </div>
          {list && list.length > 0 ? (
            <>
              <div className="my-2 grid grid-cols-2 gap-x-2 bg-gray-100 rounded p-1 container mx-auto">
                <button
                  className={`p-2 ${
                    listType === 0
                      ? "bg-green-600 text-white"
                      : "bg-white hover:bg-green-100 hover:text-green-600"
                  } border `}
                  onClick={() => setListType(0)}
                >
                  <MdMenu size={32} className="block mx-auto" />
                </button>
                <button
                  className={`p-2 ${
                    listType === 1
                      ? "bg-green-600 text-white"
                      : "bg-white hover:bg-green-100 hover:text-green-600"
                  } border `}
                  onClick={() => setListType(1)}
                >
                  <MdOutlineGridOn size={32} className="block mx-auto" />
                </button>
              </div>
              {listType === 1 ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-2 bg-white p-2 container mx-auto">
                  {list.map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleDocClick(doc)}
                      className="cursor-pointer p-3 bg-white hover:bg-green-50 border rounded-md shadow-sm"
                    >
                      <div>
                        <strong>이름:</strong> {doc.userName}
                      </div>
                      <div>
                        <strong>연락처:</strong> {getPhone(doc.phone)}
                      </div>
                      <div>
                        <strong>고객사:</strong> {doc.companyCode || "미입력"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="container mx-auto grid grid-cols-1 divide-y">
                  <div className="grid grid-cols-8 px-2 py-4 border gap-x-4 text-center bg-gray-100">
                    <div>고객사</div>
                    <div>이름</div>
                    <div className="col-span-2">연락처</div>
                    <div className="col-span-2">면접일시</div>
                    <div className="col-span-2">지급여부</div>
                  </div>

                  {list.map((doc, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-8 px-2 py-4 gap-x-4 text-center border cursor-pointer ${
                        doc.status === "S"
                          ? "bg-teal-50 hover:bg-teal-200"
                          : "bg-gray-50 hover:bg-gray-200"
                      }`}
                      onClick={() => handleDocClick(doc)}
                    >
                      <div className="flex flex-col justify-center">
                        {doc.companyCode || "미입력"}
                      </div>
                      <div className="flex flex-col justify-center">
                        {doc.userName}
                      </div>
                      <div className="flex flex-col justify-center col-span-2">
                        {doc.phone ? getPhone(doc.phone) : " "}
                      </div>
                      <div
                        className="flex flex-col justify-center col-span-2"
                        title={doc.intvDate}
                      >
                        {doc.intvDate} {doc.intvTime}시 {doc.intvMin}분
                      </div>
                      <div className="flex flex-col justify-center col-span-2">
                        {doc.status === "S" ? (
                          <span className="text-blue-500">지급대기</span>
                        ) : doc.status === "N" ? (
                          <span className="text-red-500">
                            지급불가 ({doc.result})
                          </span>
                        ) : doc.status === "Y" ? (
                          <span className="text-green-500">
                            지급완료 ({Number(doc.result).toLocaleString()}p)
                          </span>
                        ) : (
                          "오류"
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Sorry message={"조회된 내역이 없습니다"} />
          )}

          <Pagenate
            pagenate={pagenate}
            page={Number(page)}
            totalPage={Number(totalPage)}
            pathName={pathName}
            keyword={keyword}
            startDate={startDate}
            endDate={endDate}
            select={select}
            agree={agree}
            sType={sType}
          />

          {selectedDocs && (
            <div className="fixed container left-1/2 -translate-x-1/2 bottom-0 bg-white border-t p-4 rounded-t-xl drop-shadow-xl z-50">
              <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-lg">✅ 면접 대상자 정보</div>
                <button
                  onClick={() => {
                    setSelectedDocs(null);
                    setSelectedDocsId(null);
                  }}
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-black px-4 py-1 rounded"
                >
                  닫기
                </button>
              </div>

              <div className="mb-2">이름: {selectedDocs.name}</div>
              <div className="mb-4">연락처: {getPhone(selectedDocs.phone)}</div>

              <div className="space-y-2 mb-4">
                {selectedDocs.info.map((item, idx) => (
                  <div
                    key={idx}
                    className="border p-2 rounded-md bg-gray-50 flex flex-col gap-x-2"
                  >
                    <div>
                      {item.apply_status} | {item.interview_time} |{" "}
                      {item.com_name} {item.com_area}
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ 지급/불가 처리 및 고객사 입력 UI */}
              <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
                {/* 포인트 지급처리 */}
                <div className="grid grid-cols-1 gap-2 bg-blue-50 p-2">
                  <div className="text-lg font-neoextra">포인트 지급처리</div>
                  <input
                    type="number"
                    className="p-2 bg-white border font-medium"
                    value={point}
                    onChange={e => setPoint(e.currentTarget.value)}
                    onBlur={e => setPoint(e.currentTarget.value)}
                  />
                  <button
                    className="transition duration-150 ease-out p-2 bg-sky-500 hover:bg-sky-700 text-white rounded-lg font-medium hover:animate-wiggle"
                    onClick={() => {
                      pointSubmit(true, selectedDocs);
                      setSelectedDocs(null);
                      setSelectedDocsId(null);
                    }}
                  >
                    지급처리
                  </button>
                </div>

                {/* 포인트 지급불가처리 */}
                <div className="grid grid-cols-1 gap-2 bg-rose-50 p-2">
                  <div className="text-lg font-neoextra">
                    포인트 지급불가처리
                  </div>
                  <select
                    className="p-2 bg-white border font-medium"
                    onChange={handleChangeSelect}
                    value={reason}
                  >
                    <option value="">불가사유를 선택해 주세요</option>
                    <option value="중복신청">중복신청</option>
                    <option value="면접기록없음">면접기록없음</option>
                    <option value="지점에서지급">지점에서지급</option>
                  </select>
                  <button
                    className="transition duration-150 ease-out p-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-700 hover:animate-wiggle"
                    onClick={() => {
                      pointSubmit(false, selectedDocs);
                      setSelectedDocs(null);
                      setSelectedDocsId(null);
                    }}
                  >
                    지급불가처리
                  </button>
                </div>

                {/* 고객사 코드 입력 */}
                <div className="grid grid-cols-1 gap-2 bg-emerald-50 p-2">
                  <div className="text-lg font-neoextra">고객사 입력</div>
                  <input
                    ref={companyRef}
                    type="text"
                    className="p-2 bg-white border font-medium"
                    maxLength={4}
                    value={company}
                    onKeyDown={handleNumberKeyDown}
                    onChange={e => setCompany(e.currentTarget.value)}
                    onBlur={e => setCompany(e.currentTarget.value)}
                  />
                  <div className="transition duration-150 ease-out p-2 bg-gray-500 text-white rounded-lg font-medium text-center">
                    지급처리 or 지급불가처리를 눌러주세요
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default PointListTest;
