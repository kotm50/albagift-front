import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loading from "../Layout/Loading";
import queryString from "query-string";
import Pagenate from "../Layout/Pagenate";
import { logoutAlert } from "../LogoutUtil";
import { clearUser, getNewToken } from "../../Reducer/userSlice";
import PointHistoryList from "./PointHistoryList";
import Sorry from "../doc/Sorry";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import PointHistoryModal from "./PointHistoryModal";

function PointHistory() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [expire, setExpire] = useState("");
  const [selectReason, setSelectReason] = useState("");

  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const select = parsed.select || "";
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);

  useEffect(() => {
    setList([]);
    setTotalPage(1);
    setPagenate([]);
    setLoaded(false);
    setSelectReason(select);
    loadList(page, select);
    //eslint-disable-next-line
  }, [location, user.accessToken]);

  const handleChangeSelect = e => {
    setSelectReason(e.currentTarget.value);
    navi(`/mypage/pointhistory?select=${e.currentTarget.value}`);
  };

  const loadList = async (p, r) => {
    let data = {
      page: p || 1,
      size: 20,
    };
    if (r !== "") {
      data.gubun = r;
    }
    await axios
      .post("/api/v1/user/mypage/pnt/log", data, {
        headers: {
          Authorization: user.accessToken,
        },
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
        if (res.data.code === "C000") {
          const totalP = res.data.totalPages;
          setTotalPage(res.data.totalPages);
          const pagenate = generatePaginationArray(p, totalP);
          setPagenate(pagenate);
        } else {
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
        }
        setList(res.data.logList ?? [{ currPoint: "없음" }]);

        setExpire(res.data.pointExpiryDate ?? "");
      })
      .catch(e => {
        setList([]);
        setLoaded(true);
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

  const detailChk = doc => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <PointHistoryModal
            onClose={onClose} // 닫기
            title={"상세정보"} // 제목
            message={`일시 : ${doc.regDate}\n구분 : ${
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

  return (
    <>
      {loaded ? (
        <>
          <div className="lg:text-2xl mt-2 font-neo">
            <span className="font-neoextra">{user.userId}</span>
            님의 포인트 :{" "}
            <span className="font-neoextra text-rose-500">
              {user.point.toLocaleString()}
            </span>
            p
          </div>
          <div className="flex justify-between">
            {expire ? (
              <div className="text-xs lg:text-sm mb-2 font-neo leading-5">
                <span className="text-sm lg:text-base font-neobold">
                  만료일 : {expire}
                </span>{" "}
                <br />
                <span className="hidden lg:inline">(</span>포인트는 획득일로부터{" "}
                <span className="text-rose-500 font-neobold">
                  6개월 뒤 소멸됩니다
                </span>
                . <br className="lg:hidden" />
                <span className="text-xs lg:text-sm">
                  단, 포인트 추가 획득시 소멸기한이 갱신됩니다.
                </span>
                <span className="hidden lg:inline">)</span>
              </div>
            ) : (
              <div className="text-xs lg:text-sm mb-2 font-neo leading-5">
                <span className="hidden lg:inline">(</span>면접포인트는
                획득일로부터{" "}
                <span className="text-rose-500">6개월 뒤 소멸됩니다</span>.{" "}
                <br className="lg:hidden" />
                <span className="text-xs lg:text-sm">
                  단, 포인트 추가 획득시 소멸기한이 갱신됩니다.
                </span>
                <span className="hidden lg:inline">)</span>
              </div>
            )}

            <select
              className="p-2 bg-white border font-medium text-sm hidden lg:block mb-2"
              onChange={handleChangeSelect}
              value={selectReason}
            >
              <option value="">구분</option>
              <option value="B">구매</option>
              <option value="P">지급</option>
              <option value="D">차감</option>
            </select>
          </div>
          <select
            className="p-2 bg-white border font-medium text-sm block lg:hidden mb-2"
            onChange={handleChangeSelect}
            value={selectReason}
          >
            <option value="">구분</option>
            <option value="B">구매</option>
            <option value="P">지급</option>
            <option value="D">차감</option>
          </select>

          <div className="text-xs lg:text-sm container mx-auto lg:text-right text-sky-500 text-center items-center">
            내역을 <span className="hidden lg:inline">클릭</span>
            <span className="inline lg:hidden">탭</span>하면 수정/삭제가
            가능합니다.
          </div>
          {list.length > 0 ? (
            <>
              <div className="text-xs lg:text-base grid grid-cols-4 lg:grid-cols-5 py-2 bg-blue-50 divide-x">
                <div className="font-neoextra text-center hidden lg:block ">
                  일시
                </div>
                <div className="font-neoextra text-center">구분</div>
                <div className="font-neoextra text-center">변동포인트</div>
                <div className="font-neoextra text-center">잔여포인트</div>
                <div className="font-neoextra text-center">설명</div>
              </div>
              <div className="grid grid-cols-1">
                {list.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`text-xs lg:text-base grid grid-cols-4 lg:grid-cols-5 py-2 gap-y-3 hover:text-orange-500 hover:cursor-pointer ${
                      idx % 2 === 1
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={e => detailChk(doc)}
                  >
                    <PointHistoryList doc={doc} page={page} user={user} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Sorry message={"조회된 내역이 없습니다"} />
          )}
        </>
      ) : (
        <Loading />
      )}
      <Pagenate
        pagenate={pagenate}
        page={Number(page)}
        totalPage={Number(totalPage)}
        pathName={pathName}
        keyword={keyword}
      />
    </>
  );
}

export default PointHistory;
