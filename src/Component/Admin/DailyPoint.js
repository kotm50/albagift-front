import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import queryString from "query-string";
import Pagenate from "../Layout/Pagenate";
import Sorry from "../doc/Sorry";
import Loading from "../Layout/Loading";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import PointHistoryModal from "../User/PointHistoryModal";
import axiosInstance from "../../Api/axiosInstance";

function DailyPoint() {
  const location = useLocation();
  const user = useSelector(state => state.user);
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const startDate = parsed.startDate || 1;
  const [loaded, setLoaded] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [log, setLog] = useState("");

  useEffect(() => {
    if (location.state) {
      setLog(location.state.log);
    } else {
      setLog("");
    }
    getLog(page, startDate);
    //eslint-disable-next-line
  }, [location]);

  const detailChk = doc => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <PointHistoryModal
            onClose={onClose} // 닫기
            title={"상세정보"} // 제목
            message={`아이디 : ${doc.userId || "탈퇴회원"}\n일시 : ${
              doc.regDate
            }\n구분 : ${
              doc.gubun === "B"
                ? "구매"
                : doc.gubun === "P"
                ? "지급"
                : doc.gubun === "D"
                ? "차감"
                : "확인불가"
            }\n변동포인트 : ${doc.point.toLocaleString()}\n잔여포인트 : ${doc.currPoint.toLocaleString()}\n설명 : ${
              doc.logType === "CP"
                ? doc.goodsName
                : doc.logType === "PR"
                ? "이벤트 지급"
                : doc.logType === "EX"
                ? "기간 만료"
                : doc.logType === "AP"
                ? "관리자 지급"
                : doc.logType === "AD"
                ? "관리자 차감"
                : doc.logType === "AB"
                ? "면접 지급"
                : doc.logType === "PO"
                ? "포인트 이관"
                : doc.logType === "CE"
                ? "구매취소"
                : "확인불가"
            }`} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
          />
        );
      },
    });
    return false;
  };

  const getLog = async (p, s) => {
    setLoaded(false);
    let data = {
      page: p,
      size: 20,
    };
    if (s !== "") {
      data.startDate = s;
    }
    await axiosInstance
      .post("/api/v1/user/admin/search/todayPnt", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        setLoaded(true);
        if (res.data.logList.length === 0) {
          return false;
        }
        const totalP = res.data.totalPages;
        setTotalPage(res.data.totalPages);
        const pagenate = generatePaginationArray(p, totalP);
        setPagenate(pagenate);

        setDataList(res.data.logList);
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

  return (
    <>
      {loaded ? (
        <div className="mt-2 container p-4 mx-auto bg-white rounded-lg">
          <div className="text-left">
            <Link to={-1} className="hover:text-orange-500">
              {"< "}이전으로
            </Link>
          </div>
          <h2 className="p-4 text-center font-neoheavy text-3xl">
            {startDate} 포인트 내역
          </h2>
          {log !== "" ? (
            <div className="grid grid-cols-11 divide-x border mb-3">
              <div className="p-2 text-center bg-green-700 text-white text-sm">
                관리자 지급 포인트
              </div>
              <div className="p-2 text-center bg-green-700 text-white text-sm">
                이관 포인트
              </div>
              <div className="p-2 text-center bg-green-700 text-white text-sm">
                프로모션 포인트
              </div>
              <div className="p-2 text-center bg-green-700 text-white text-sm">
                면접 포인트
              </div>
              <div className="p-2 text-center bg-green-700 text-white text-sm">
                취소 포인트
              </div>
              <div className="p-2 text-center bg-green-700 text-white text-sm">
                총 지급 포인트
              </div>
              <div className="p-2 text-center bg-rose-700 text-white text-sm">
                소멸 포인트
              </div>
              <div className="p-2 text-center bg-rose-700 text-white text-sm">
                관리자 차감 포인트
              </div>
              <div className="p-2 text-center bg-rose-700 text-white text-sm">
                쿠폰 사용 포인트
              </div>
              <div className="p-2 text-center bg-rose-700 text-white text-sm">
                총 차감 포인트
              </div>
              <div className="p-2 text-center bg-gray-700 text-white text-sm">
                실제 사용액
              </div>
              <div className="p-2 text-center">
                {log.apPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.trPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.prPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.abPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.cePnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.plusPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.exPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.adPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.cpPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.miunsPnt.toLocaleString()}p
              </div>
              <div className="p-2 text-center">
                {log.bizPnt.toLocaleString()}원
              </div>
            </div>
          ) : null}

          {dataList.length > 0 ? (
            <>
              <div className="text-xs lg:text-base grid grid-cols-4 lg:grid-cols-5 py-2 bg-green-50 divide-x">
                <div className="font-neoextra text-center">구분</div>
                <div className="font-neoextra text-center hidden lg:block ">
                  일시
                </div>
                <div className="font-neoextra text-center">아이디</div>
                <div className="font-neoextra text-center">변동포인트</div>
                <div className="font-neoextra text-center">설명</div>
              </div>
              <div className="grid grid-cols-1">
                {dataList.map((doc, idx) => (
                  <div
                    key={idx}
                    className="text-xs lg:text-base grid grid-cols-4 lg:grid-cols-5 py-2 gap-y-3 border-b hover:bg-gray-100 hover:text-orange-500 hover:cursor-pointer group"
                    onClick={e => detailChk(doc)}
                  >
                    <div
                      className={`text-center p-1 flex flex-col justify-center font-neoextra group-hover:text-orange-500 ${
                        doc.gubun === "B"
                          ? "text-rose-500"
                          : doc.gubun === "P"
                          ? "text-green-500"
                          : doc.gubun === "D"
                          ? "text-rose-500"
                          : ""
                      }`}
                    >
                      {doc.gubun === "B"
                        ? "구매"
                        : doc.gubun === "P"
                        ? "지급"
                        : doc.gubun === "D"
                        ? "차감"
                        : "확인불가"}
                    </div>
                    <div className="text-center p-1 hidden lg:block truncate">
                      {doc.regDate}
                    </div>
                    <div className="text-center p-1 flex flex-col justify-center">
                      {doc.userId || "탈퇴회원"}
                    </div>
                    <div
                      className={`text-center p-1 flex flex-col justify-center font-neoextra group-hover:text-orange-500 ${
                        doc.gubun === "B"
                          ? "text-rose-500"
                          : doc.gubun === "P"
                          ? "text-green-500"
                          : doc.gubun === "D"
                          ? "text-rose-500"
                          : ""
                      }`}
                    >
                      {doc.gubun === "B" || doc.gubun === "D" ? "-" : null}
                      {doc.point.toLocaleString()}p
                    </div>
                    <div
                      className="text-center py-1 px-4 flex flex-col justify-center truncate"
                      title={doc.logType === "CP" ? doc.goodsName : ""}
                    >
                      <div className="w-full truncate">
                        {doc.logType === "CP"
                          ? doc.goodsName
                          : doc.logType === "PR"
                          ? "프로모션 지급"
                          : doc.logType === "EX"
                          ? "기간 만료"
                          : doc.logType === "AP"
                          ? "관리자 지급"
                          : doc.logType === "AD"
                          ? "관리자 차감"
                          : doc.logType === "AB"
                          ? "면접 지급"
                          : doc.logType === "TR"
                          ? "포인트 이관"
                          : doc.logType === "CE"
                          ? "구매 취소"
                          : "확인불가"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Sorry message={"조회된 내역이 없습니다"} />
          )}
        </div>
      ) : (
        <Loading />
      )}
      <Pagenate
        pagenate={pagenate}
        page={Number(page)}
        totalPage={Number(totalPage)}
        pathName={pathName}
        startDate={startDate}
        log={log}
      />
    </>
  );
}

export default DailyPoint;
