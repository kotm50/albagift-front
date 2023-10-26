import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import queryString from "query-string";
import Pagenate from "../Layout/Pagenate";
import Sorry from "../doc/Sorry";
import Loading from "../Layout/Loading";
import { getNewToken } from "../../Reducer/userSlice";

function DailyPoint() {
  const dispatch = useDispatch();
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

  useEffect(() => {
    getLog(page, startDate);
    //eslint-disable-next-line
  }, [location]);

  const getLog = async (p, s) => {
    setLoaded(false);
    let data = {
      page: p,
      size: 20,
    };
    if (s !== "") {
      data.startDate = s;
    }
    console.log(data);
    await axios
      .post("/api/v1/user/admin/search/todayPnt", data, {
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
            <Link to={"/admin"}>{"< "}이전으로</Link>
          </div>
          <h2 className="p-4 text-center font-neoheavy text-3xl">
            {startDate} 포인트 내역
          </h2>
          {dataList.length > 0 ? (
            <>
              <div className="text-xs xl:text-base grid grid-cols-4 xl:grid-cols-5 py-2 bg-green-50 divide-x">
                <div className="font-neoextra text-center">구분</div>
                <div className="font-neoextra text-center hidden xl:block ">
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
                    className="text-xs xl:text-base grid grid-cols-4 xl:grid-cols-5 py-2 gap-y-3 border-b hover:bg-gray-100"
                  >
                    <div
                      className={`text-center p-1 flex flex-col justify-center font-neoextra ${
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
                    <div className="text-center p-1 hidden xl:block truncate">
                      {doc.regDate}
                    </div>
                    <div className="text-center p-1 flex flex-col justify-center">
                      {doc.userId || "탈퇴회원"}
                    </div>
                    <div
                      className={`text-center p-1 flex flex-col justify-center font-neoextra ${
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
                    <div className="text-center p-1 flex flex-col justify-center truncate">
                      {doc.logType === "CP"
                        ? doc.goodsName
                        : doc.logType === "PR"
                        ? "가입 지급"
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
                        : "확인불가"}
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
      />
    </>
  );
}

export default DailyPoint;
