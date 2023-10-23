import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import queryString from "query-string";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import dayjs from "dayjs";
import "dayjs/locale/ko";
import Pagenate from "../Layout/Pagenate";

import axios from "axios";
import { getNewToken } from "../../Reducer/userSlice";
import Sorry from "../doc/Sorry";
import Loading from "../Layout/Loading";
import AlertModal from "../Layout/AlertModal";

function Main() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const startDate = parsed.startDate || "";
  const endDate = parsed.endDate || "";
  const [loaded, setLoaded] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  useEffect(() => {
    setDataList([]);
    if (startDate !== "") {
      setInputStartDate(startDate);
    } else {
      setInputStartDate("");
      setSearchStartDate("");
    }
    if (endDate !== "") {
      setInputEndDate(endDate);
    } else {
      setInputEndDate("");
      setSearchEndDate("");
    }
    getData(page, startDate, endDate);
    //eslint-disable-next-line
  }, [location]);
  const getData = async (p, s, e) => {
    setLoaded(false);
    let data = {
      page: p,
      size: 20,
    };
    if (s !== "") {
      data.startDate = s;
    }
    if (e !== "") {
      data.endDate = e;
    }
    await axios
      .post("/api/v1/user/admin/search/datePnt", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res);
        if (res.headers.authorization) {
          dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        setLoaded(true);
        if (res.data.pointList.length === 0) {
          return false;
        }
        const totalP = res.data.totalPages;
        setTotalPage(res.data.totalPages);
        const pagenate = generatePaginationArray(p, totalP);
        setPagenate(pagenate);

        setDataList(res.data.pointList);
      })
      .catch(e => {
        console.log(e);
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

  const searchIt = () => {
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
      searchStartDate !== "" && searchEndDate !== ""
        ? `?startDate=${searchStartDate}&endDate=${searchEndDate}`
        : ""
    }`;
    navi(domain);
  };

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

  const dateReset = () => {
    setInputStartDate("");
    setInputEndDate("");
  };

  return (
    <>
      {loaded ? (
        <div className="mt-2 container p-4 mx-auto bg-white rounded-lg">
          <h2 className="p-4 text-center font-neoheavy text-3xl">
            포인트 내역
          </h2>
          <div className="flex flex-row justify-start gap-3 mb-4">
            <div className="font-neoextra text-lg p-2">기간검색</div>
            <div className="grid grid-cols-2">
              <div className="flex justify-start">
                <div className="font-neoextra text-lg p-2">조회 시작일</div>
                <input
                  type="date"
                  value={inputStartDate}
                  className="border border-gray-300 p-2 w-80 block rounded-lg font-neo"
                  placeholder="이름 또는 연락처를 입력해 주세요"
                  onChange={e => setInputStartDate(e.currentTarget.value)}
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
                setInputStartDate("");
                setInputEndDate("");
              }}
            >
              초기화
            </button>
          </div>
          {dataList.length > 0 ? (
            <>
              <table className="w-full">
                <thead>
                  <tr className=" text-white font-neoextra">
                    <td className="p-2 text-center border bg-gray-500">날짜</td>
                    <td className="p-2 text-center border bg-green-700">
                      지급 포인트
                    </td>
                    <td className="p-2 text-center border bg-green-700">
                      관리자 지급 포인트
                    </td>
                    <td className="p-2 text-center border bg-green-700">
                      프로모션 포인트
                    </td>
                    <td className="p-2 text-center border bg-green-700">
                      게시판 신청 포인트
                    </td>
                    <td className="p-2 text-center border bg-rose-700">
                      차감 포인트
                    </td>
                    <td className="p-2 text-center border bg-rose-700">
                      소멸 포인트
                    </td>
                    <td className="p-2 text-center border bg-rose-700">
                      관리자 차감 포인트
                    </td>
                    <td className="p-2 text-center border bg-rose-700">
                      쿠폰 사용 포인트
                    </td>
                    <td className="p-2 text-center border bg-gray-500">
                      기프티쇼 실제 사용 금액
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((log, idx) => (
                    <tr
                      key={idx}
                      className={`${idx % 2 === 1 ? "bg-yellow-50" : null}`}
                    >
                      <td className="p-2 text-center border">{log.regDate}</td>
                      <td className="p-2 text-center border">
                        {log.plusPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.apPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.prPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.abPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.miunsPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.exPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.adPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.cpPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.bizPnt.toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagenate
                pagenate={pagenate}
                page={Number(page)}
                totalPage={Number(totalPage)}
                pathName={pathName}
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

export default Main;
