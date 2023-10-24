import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loading from "../Layout/Loading";
import PayList from "./PayList";
import queryString from "query-string";
import Pagenate from "../Layout/Pagenate";
import AlertModal from "../Layout/AlertModal";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import PayModal from "./PayModal";
import { logoutAlert } from "../LogoutUtil";
import { clearUser, getNewToken } from "../../Reducer/userSlice";
import Sorry from "../doc/Sorry";

function Payhistory() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);

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

  const loadList = async (p, s) => {
    let data = {
      boardId: "B02",
      page: p || 1,
      size: 20,
    };
    if (s !== "") {
      data.status = s;
    }
    await axios
      .post("/api/v1/board/get/pnt/posts/list", data, {
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
        setList(res.data.postList ?? [{ postId: "없음" }]);
      })
      .catch(e => {
        console.log(e);
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

  const listModal = doc => {
    if (doc.status === "S") {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <PayModal
              onClose={onClose}
              doc={doc}
              editIt={editIt}
              deleteIt={deleteIt}
            />
          );
        },
      });
    } else {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"면접날짜 수정/삭제"} // 제목
              message={
                doc.status === "Y"
                  ? "이미 지급처리가 된 내용은\n수정/삭제가 불가능 합니다"
                  : "이미 불가처리가 된 내용은\n수정/삭제가 불가능 합니다"
              } // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
    }
  };

  const doLogout = async m => {
    logoutAlert(null, null, dispatch, clearUser, navi, user, m);
  };

  const editIt = async (doc, date, hour, minute) => {
    let data = {
      boardId: "B02",
      postId: doc.postId,
      intvDate: date,
      intvTime: hour,
      intvMin: minute,
    };
    await axios
      .patch("/api/v1/board/upt/pnt/posts", data, {
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
        if (res.data.code === "E999") {
          doLogout(res.data.message);
          return false;
        }
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
        if (res.headers.authorization === user.accessToken) {
          loadList(page, select);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteIt = async doc => {
    const data = { boardId: "B02", postId: doc.postId };
    await axios
      .patch("/api/v1/board/del/posts", data, {
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
        if (res.headers.authorization === user.accessToken) {
          loadList(page);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleChangeSelect = e => {
    setSelectReason(e.currentTarget.value);
    navi(`/mypage/payhistory?select=${e.currentTarget.value}`);
  };

  return (
    <>
      {loaded ? (
        <>
          <div className="flex justify-between my-2">
            <div className="text-xs xl:text-sm container mx-auto xl:text-left text-sky-500 text-center items-center">
              내역을 <span className="hidden xl:inline">클릭</span>
              <span className="inline xl:hidden">탭</span>하면 수정/삭제가
              가능합니다.
            </div>
            <select
              className="p-2 bg-white border font-medium text-sm hidden xl:block"
              onChange={handleChangeSelect}
              value={selectReason}
            >
              <option value="">처리결과</option>
              <option value="S">심사중</option>
              <option value="Y">지급완료</option>
              <option value="N">지급불가</option>
            </select>
          </div>
          <select
            className="p-2 bg-white border font-medium text-sm  xl:hidden block mb-3"
            onChange={handleChangeSelect}
            value={selectReason}
          >
            <option value="">처리결과</option>
            <option value="S">심사중</option>
            <option value="Y">지급완료</option>
            <option value="N">지급불가</option>
          </select>
          {list.length > 0 ? (
            <>
              <div className="text-sm xl:text-base grid grid-cols-3 xl:grid-cols-4 py-2 bg-blue-50 divide-x">
                <div className="font-neoextra text-center hidden xl:block">
                  입력일
                </div>
                <div className="font-neoextra text-center">면접날짜</div>
                <div className="font-neoextra text-center">처리결과</div>
                <div className="font-neoextra text-center">
                  지급액/사유
                  <span className="text-sm font-neo hidden xl:inline">
                    (불가시)
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1">
                {list.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`hover:cursor-pointer hover:text-orange-500 text-sm xl:text-base grid grid-cols-3 xl:grid-cols-4 py-2 gap-y-3 ${
                      idx % 2 === 1
                        ? "bg-green-50 hover:bg-green-100"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={e => listModal(doc)}
                  >
                    <PayList
                      doc={doc}
                      loadList={loadList}
                      page={page}
                      user={user}
                    />
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
      <div
        className={`xl:pr-0 container mx-auto flex ${
          list.length > 0 ? "justify-end my-2" : "justify-center mt-5"
        }`}
      >
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
          onClick={e => navi("/mypage/pointrequest")}
        >
          지급신청하기
        </button>
      </div>
      <Pagenate
        pagenate={pagenate}
        page={Number(page)}
        totalPage={Number(totalPage)}
        pathName={pathName}
        keyword={keyword}
        select={select}
      />
    </>
  );
}

export default Payhistory;
