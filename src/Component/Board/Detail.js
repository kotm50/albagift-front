import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import queryString from "query-string";

import Loading from "../Layout/Loading";
import AlertModal from "../Layout/AlertModal";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import { getNewToken } from "../../Reducer/userSlice";
function Detail() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const boardId = parsed.boardId || "B02";
  const { pid } = useParams();
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    let boardId;
    if (location.state) {
      boardId = location.state.boardId;
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
              doIt={goMain} // 확인시 실행할 함수
            />
          );
        },
      });
    }
    getDetail(boardId);
    //eslint-disable-next-line
  }, []);

  const goMain = () => {
    navi("/");
  };

  const getDetail = async boardId => {
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
      .then(async res => {
        if (res.headers.authorization) {
          await dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        res.data.code === "C000" && setDetail(res.data.post);
        setLoading(false);
      })
      .catch(e => {
        navi(-1);
      });
  };
  return (
    <>
      {loading ? <Loading /> : null}
      <h2 className="text-center text-3xl py-2 font-neoheavy">면접상세내용</h2>
      <div className="container mx-auto grid grid-cols-1 gap-1">
        {boardId === "B02" ? (
          <>
            <div className="w-1/2 mx-auto grid grid-cols-4 border">
              <div className="bg-sky-500 p-2 text-white text-center">
                면접날짜
              </div>
              <div className="bg-gray-50 p-2 col-span-3">{detail.intvDate}</div>
            </div>
            <div className="w-1/2 mx-auto grid grid-cols-4 border">
              <div className="bg-sky-500 p-2 text-white text-center">
                면접시간
              </div>
              <div className="bg-gray-50 p-2 col-span-3">
                {detail.intvTime}시 {detail.intvMin}분
              </div>
            </div>
            <div className="w-1/2 mx-auto grid grid-cols-4 border">
              <div className="bg-sky-500 p-2 text-white text-center">
                포인트 지급여부
              </div>
              <div className="bg-gray-50 p-2 col-span-3">
                {detail.status === "S" ? (
                  <span className="text-blue-500">지급대기</span>
                ) : detail.status === "N" ? (
                  <span className="text-red-500">지급불가</span>
                ) : detail.status === "Y" ? (
                  <span className="text-green-500">지급완료</span>
                ) : (
                  "오류"
                )}
              </div>
            </div>
            {detail.status !== "S" && (
              <div className="w-1/2 mx-auto grid grid-cols-4 border">
                <div className="bg-sky-500 p-2 text-white text-center">
                  {detail.status === "Y" ? "지급 포인트" : "지급 불가 사유"}
                </div>
                <div className="bg-gray-50 p-2 col-span-3">{detail.result}</div>
              </div>
            )}
          </>
        ) : (
          "현재 다른 게시판은 준비중 입니다."
        )}
      </div>
      <div className="container mx-auto text-center mt-2 flex justify-center gap-2">
        <button
          className="p-2 w-60 bg-sky-500 hover:bg-sky-700 text-white rounded"
          onClick={e => navi(`/board/list?boardId=${boardId}`)}
        >
          목록으로
        </button>
        {detail.status === "S" && (
          <button
            className="p-2 w-60 bg-green-500 hover:bg-green-700 text-white rounded"
            onClick={e => navi(`/board/write/${pid}`)}
          >
            수정하기
          </button>
        )}
      </div>
    </>
  );
}

export default Detail;
