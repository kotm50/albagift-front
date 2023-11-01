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

  return (
    <>
      {loaded ? (
        <>
          <div className="xl:text-2xl mt-2 font-neo">
            <span className="font-neoextra">{user.userId}</span>
            님의 잔여포인트 :{" "}
            <span className="font-neoextra text-rose-500">
              {user.point.toLocaleString()}
            </span>
            p
          </div>

          <div className="flex justify-between">
            {expire ? (
              <div className="text-xs xl:text-sm mb-2 font-neo leading-5">
                <span className="text-sm xl:text-base font-neobold">
                  만료일 : {expire}
                </span>{" "}
                <br />
                <span className="hidden xl:inline">(</span>면접포인트는
                획득일로부터{" "}
                <span className="text-rose-500 font-neobold">
                  6개월 뒤 소멸됩니다
                </span>
                . <br className="xl:hidden" />
                <span className="text-xs xl:text-sm">
                  단, 포인트 추가 획득시 소멸기한이 갱신됩니다.
                </span>
                <span className="hidden xl:inline">)</span>
              </div>
            ) : (
              <div className="text-xs xl:text-sm mb-2 font-neo leading-5">
                <span className="hidden xl:inline">(</span>면접포인트는
                획득일로부터{" "}
                <span className="text-rose-500">6개월 뒤 소멸됩니다</span>.{" "}
                <br className="xl:hidden" />
                <span className="text-xs xl:text-sm">
                  단, 포인트 추가 획득시 소멸기한이 갱신됩니다.
                </span>
                <span className="hidden xl:inline">)</span>
              </div>
            )}

            <select
              className="p-2 bg-white border font-medium text-sm hidden xl:block mb-2"
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
            className="p-2 bg-white border font-medium text-sm block xl:hidden mb-2"
            onChange={handleChangeSelect}
            value={selectReason}
          >
            <option value="">구분</option>
            <option value="B">구매</option>
            <option value="P">지급</option>
            <option value="D">차감</option>
          </select>
          {list.length > 0 ? (
            <>
              <div className="text-xs xl:text-base grid grid-cols-4 xl:grid-cols-5 py-2 bg-blue-50 divide-x">
                <div className="font-neoextra text-center hidden xl:block ">
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
                    className={`text-xs xl:text-base grid grid-cols-4 xl:grid-cols-5 py-2 gap-y-3 ${
                      idx % 2 === 1
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "hover:bg-gray-200"
                    }`}
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
