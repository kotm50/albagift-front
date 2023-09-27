import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../Layout/Loading";

function Write() {
  const [loaded, setLoaded] = useState(false);
  const { pid } = useParams();
  const user = useSelector(state => state.user);
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const boardId = parsed.boardId || "B01";
  const navi = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hour, setHour] = useState("0");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    setLoaded(false);
    let postId = pid || "";
    if (postId !== "") {
      getPost();
    }
    if (user.accessToken !== "") {
      setLoaded(true);
    } else {
      let goLogin = window.confirm(
        "로그인이 필요합니다, 로그인을 진행해 주세요"
      );
      if (goLogin) {
        navi("/login");
      } else {
        navi(-1);
      }
    }
    //eslint-disable-next-line
  }, [location]);

  const getPost = async () => {
    const data = {
      boardId: boardId,
      postId: pid,
    };
    await axios
      .post("/api/v1/board/get/pnt/posts", data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        const detail = res.data.post;
        if (res.data.code === "C000") {
          setDate(detail.intvDate);
          setHour(detail.intvTime);
          setMinute(detail.intvMin);
        }
        setLoaded(true);
      })
      .catch(e => {
        alert("알 수 없는 오류가 발생했습니다");
        navi(-1);
      });
  };

  const handleDateChange = event => {
    setDate(event.target.value);
  };

  const submit = async () => {
    let data = {
      boardId: boardId,
      intvDate: date,
      intvTime: hour,
      intvMin: minute,
    };
    if (boardId === "B01") {
      let isBefore = await isBeforeNow();
      if (!isBefore) {
        return alert("면접일시는 현재시간보다 이전이어야 합니다.");
      }
    }
    let postId = pid || "";
    if (postId !== "") {
      data.postId = postId;
      await axios
        .patch("/api/v1/board/upt/pnt/posts", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          if (res.data.code === "C000") {
            alert("등록되었습니다");
            navi(`/board/list?boardId=${boardId}`);
          } else {
            alert(
              `오류가 발생했습니다.관리자에게 문의해 주세요.\n(오류코드 : ${res.data.code})`
            );
          }
        })
        .catch(e => {
          alert("오류가 발생했습니다.\n관리자에게 문의해 주세요");
        });
    } else {
      await axios
        .post("/api/v1/board/pnt/posts", data, {
          headers: { Authorization: user.accessToken },
        })
        .then(res => {
          if (res.data.code === "C000") {
            alert("등록되었습니다");
            navi(`/board/list?boardId=${boardId}`);
          } else {
            alert(
              `오류가 발생했습니다.관리자에게 문의해 주세요.\n(오류코드 : ${res.data.code})`
            );
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const isBeforeNow = async () => {
    const hhh = await addZero(hour);
    const intv = `${date}T${hhh}:${minute}:00`;
    const interview = new Date(intv);
    const currentDate = new Date();
    return interview < currentDate;
  };

  const addZero = str => {
    // 문자열의 길이가 1인 경우에만 앞에 0을 붙입니다.
    if (str.length === 1) {
      return "0" + str;
    }
    // 그 외의 경우에는 원래 문자열을 그대로 반환합니다.
    return str;
  };
  return (
    <div className="w-1/2 p-2 mx-auto bg-white my-2">
      {loaded ? (
        <>
          {boardId === "B01" ? (
            <>
              <h2 className="text-lg xl:text-2xl font-neobold mb-3">
                면접포인트 신청하기
              </h2>
              <div className="grid grid-cols-6 xl:grid-cols-10 gap-1 bg-gray-50 p-2 xl:mb-3">
                <div className="col-span-2 font-neobold text-right bg-indigo-50 p-2">
                  이름
                </div>
                <div className="col-span-4 xl:col-span-8 p-2 bg-white">
                  {user.userName}
                </div>
                <div className="col-span-2 font-neobold text-right bg-indigo-50 p-2">
                  <label htmlFor="inputDate">면접날짜</label>
                </div>
                <div className="col-span-4 xl:col-span-8 p-2 bg-white">
                  <input
                    id="inputDate"
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                  />
                </div>

                <div className="col-span-2 font-neobold text-right bg-indigo-50 p-2">
                  <label htmlFor="inputTime">면접시간</label>
                </div>
                <div className="col-span-4 xl:col-span-8 bg-white grid grid-cols-2 gap-2 px-1">
                  <div className="grid grid-cols-4 gap-1 py-1">
                    {/* 시간 선택 */}
                    <select
                      className="col-span-3 p-1 border border-gray-500 rounded"
                      value={hour}
                      onChange={e => setHour(e.target.value)}
                    >
                      {Array.from({ length: 24 }).map((_, idx) => (
                        <option key={idx} value={String(idx)}>
                          {String(idx)}
                        </option>
                      ))}
                    </select>
                    <div className="p-1">시</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 py-1">
                    {/* 분 선택 */}
                    <select
                      className="col-span-3 p-1 border border-gray-500 rounded"
                      value={minute}
                      onChange={e => setMinute(e.target.value)}
                    >
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <option
                          key={idx}
                          value={String(idx * 10).padStart(2, "0")}
                        >
                          {String(idx * 10).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    <div className="p-1">분</div>
                  </div>
                </div>

                <div className="col-span-2 font-neobold text-right p-2 hidden xl:block"></div>
                <div className="col-span-4 xl:col-span-8 text-xs p-2 hidden xl:block">
                  24시간 단위로 선택해 주세요. 예시) 오후 3시 &gt;{" "}
                  <span className="font-neoextra text-rose-500">15</span>시
                </div>
              </div>
              <div className="px-2 pb-2 text-xs xl:hidden">
                24시간 단위로 선택해 주세요. 예시) 오후 3시 &gt;{" "}
                <span className="font-neoextra text-rose-500">15</span>시
              </div>
              <button
                className="w-full p-2 bg-teal-500 hover:bg-teal-700 text-white"
                onClick={e => submit()}
              >
                포인트 지급 신청
              </button>
            </>
          ) : (
            <div className="text-center">
              "다른 게시판은 현재 준비중 입니다"
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Write;
