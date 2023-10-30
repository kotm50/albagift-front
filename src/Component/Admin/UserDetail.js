import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loading from "../Layout/Loading";
import queryString from "query-string";
import Pagenate from "../Layout/Pagenate";
import { logoutAlert } from "../LogoutUtil";
import { clearUser, getNewToken } from "../../Reducer/userSlice";
import UserDetailList from "./UserDetailList";
import Sorry from "../doc/Sorry";
import AlertModal from "../Layout/AlertModal";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

function UserDetail() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const userId = parsed.userId || "";
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);

  useEffect(() => {
    if (userId !== "") {
      setList([]);
      setTotalPage(1);
      setPagenate([]);
      setLoaded(false);
      loadList(page, userId);
    } else {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"오류"} // 제목
              message={"잘못된 접근입니다"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
              doIt={goBack} // 확인시 실행할 함수
            />
          );
        },
      });
    }
    //eslint-disable-next-line
  }, [location, user.accessToken]);

  const goBack = () => {
    navi(-1);
  };

  const loadList = async (p, u) => {
    let data = {
      userId: u,
      page: p || 1,
      size: 20,
    };
    console.log(data);
    await axios
      .post("/api/v1/user/admin/usrpnt/history", data, {
        headers: {
          Authorization: user.accessToken,
        },
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
          <div className="container mx-auto text-left">
            <Link to={-1}>{"< "}이전으로</Link>
          </div>
          <div className="container mx-auto xl:text-2xl my-2 font-neo text-center">
            <span className="font-neoextra">{userId}</span>
            님의 포인트내역
          </div>
          {list.length > 0 ? (
            <div className="container mx-auto">
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
                    <UserDetailList doc={doc} page={page} user={user} />
                  </div>
                ))}
              </div>
            </div>
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
        userId={userId}
      />
    </>
  );
}

export default UserDetail;
