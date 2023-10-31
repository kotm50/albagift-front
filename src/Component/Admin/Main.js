import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import queryString from "query-string";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import dayjs from "dayjs";
import "dayjs/locale/ko";

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
  const startDate = parsed.startDate || "";
  const endDate = parsed.endDate || "";
  const [loaded, setLoaded] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");

  const [apPntTotal, setApPntTotal] = useState(0);
  const [trPntTotal, setTrPntTotal] = useState(0);
  const [prPntTotal, setPrPntTotal] = useState(0);
  const [abPntTotal, setAbPntTotal] = useState(0);
  const [plusPntTotal, setPlusPntTotal] = useState(0);
  const [exPntTotal, setExPntTotal] = useState(0);
  const [adPntTotal, setAdPntTotal] = useState(0);
  const [cpPntTotal, setCpPntTotal] = useState(0);
  const [miunsPntTotal, setMinusPntTotal] = useState(0);
  const [bizPntTotal, setBizPntTotal] = useState(0);
  useEffect(() => {
    setDataList([]);
    if (startDate !== "") {
      setInputStartDate(startDate);
    }
    if (endDate !== "") {
      setInputEndDate(endDate);
    }
    if (startDate !== "" && endDate !== "") {
      getData(startDate, endDate);
    } else {
      getMonthandLoadList();
    }
    //eslint-disable-next-line
  }, [location, user.accessToken]);

  const getMonthandLoadList = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0부터 시작하므로 0~11 사이의 값

    // 현재 달의 첫째 날 계산
    const firstDay = new Date(currentYear, currentMonth, 1);

    const firstDayFormat = dayjs(firstDay).format("YYYY-MM-DD");
    const toDayFormat = dayjs(today).format("YYYY-MM-DD");
    setInputStartDate(firstDayFormat);
    setInputEndDate(toDayFormat);
    getData(firstDayFormat, toDayFormat);
  };
  const getData = async (s, e) => {
    setLoaded(false);
    let data = {
      startDate: s,
      endDate: e,
    };
    await axios
      .post("/api/v1/user/admin/search/datePnt", data, {
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
        if (res.data.pointList.length === 0) {
          return false;
        }
        let apPntTotal = 0;
        let trPntTotal = 0;
        let prPntTotal = 0;
        let abPntTotal = 0;
        let plusPntTotal = 0;
        let exPntTotal = 0;
        let adPntTotal = 0;
        let cpPntTotal = 0;
        let miunsPntTotal = 0;
        let bizPntTotal = 0;
        res.data.pointList.forEach(doc => {
          apPntTotal = apPntTotal + doc.apPnt;
          trPntTotal = trPntTotal + doc.trPnt;
          prPntTotal = prPntTotal + doc.prPnt;
          abPntTotal = abPntTotal + doc.abPnt;
          plusPntTotal = plusPntTotal + doc.plusPnt;
          exPntTotal = exPntTotal + doc.exPnt;
          adPntTotal = adPntTotal + doc.adPnt;
          cpPntTotal = cpPntTotal + doc.cpPnt;
          miunsPntTotal = miunsPntTotal + doc.miunsPnt;
          bizPntTotal = bizPntTotal + doc.bizPnt;
        });

        setApPntTotal(apPntTotal);
        setTrPntTotal(trPntTotal);
        setPrPntTotal(prPntTotal);
        setAbPntTotal(abPntTotal);
        setPlusPntTotal(plusPntTotal);
        setExPntTotal(exPntTotal);
        setAdPntTotal(adPntTotal);
        setCpPntTotal(cpPntTotal);
        setMinusPntTotal(miunsPntTotal);
        setBizPntTotal(bizPntTotal);

        setDataList(res.data.pointList);
      })
      .catch(e => {
        console.log(e);
        setLoaded(true);
      });
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
                      관리자 지급 포인트
                    </td>
                    <td className="p-2 text-center border bg-green-700">
                      이관 포인트
                    </td>
                    <td className="p-2 text-center border bg-green-700">
                      프로모션 포인트
                    </td>
                    <td className="p-2 text-center border bg-green-700">
                      면접 포인트
                    </td>
                    <td className="p-2 text-center border bg-green-700">
                      총 지급 포인트
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
                    <td className="p-2 text-center border bg-rose-700">
                      총 차감 포인트
                    </td>
                    <td className="p-2 text-center border bg-gray-500">
                      기프티쇼 실제 사용 금액
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-sky-50 border-b-2 border-stone-700">
                    <td className="p-2 text-center border">합계</td>
                    <td className="p-2 text-center border">
                      {apPntTotal.toLocaleString()}p
                    </td>
                    <td className="p-2 text-center border">
                      {trPntTotal ? trPntTotal.toLocaleString() : 0}p
                    </td>
                    <td className="p-2 text-center border">
                      {prPntTotal.toLocaleString()}p
                    </td>
                    <td className="p-2 text-center border">
                      {abPntTotal.toLocaleString()}p
                    </td>
                    <td className="p-2 text-center border">
                      {plusPntTotal.toLocaleString()}p
                    </td>
                    <td className="p-2 text-center border">
                      {exPntTotal.toLocaleString()}p
                    </td>
                    <td className="p-2 text-center border">
                      {adPntTotal.toLocaleString()}p
                    </td>
                    <td className="p-2 text-center border">
                      {cpPntTotal.toLocaleString()}p
                    </td>
                    <td className="p-2 text-center border">
                      {miunsPntTotal.toLocaleString()}p
                    </td>
                    <td className="p-2 text-center border">
                      {bizPntTotal.toLocaleString()}원
                    </td>
                  </tr>
                  {dataList.map((log, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 1 ? "bg-yellow-50" : null
                      } hover:cursor-pointer hover:text-orange-500`}
                      onClick={e =>
                        navi(`/admin/dailypoint?startDate=${log.regDate}`, {
                          state: { log: log },
                        })
                      }
                    >
                      <td className="p-2 text-center border">{log.regDate}</td>
                      <td className="p-2 text-center border">
                        {log.apPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.trPnt ? log.trPnt.toLocaleString() : 0}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.prPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.abPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.plusPnt.toLocaleString()}p
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
                        {log.miunsPnt.toLocaleString()}p
                      </td>
                      <td className="p-2 text-center border">
                        {log.bizPnt.toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
