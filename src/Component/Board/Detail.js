import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";
import queryString from "query-string";

import Loading from "../Layout/Loading";
function Detail() {
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const boardId = parsed.boardId || "B01";
  const { pid } = useParams();
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    let boardId;
    if (location.state) {
      boardId = location.state.boardId;
    } else {
      alert("잘못된 접근입니다");
      navi("/");
    }
    getDetail(boardId);
    //eslint-disable-next-line
  }, []);

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
      .then(res => {
        console.log(res.data.post);
        res.data.code === "C000" && setDetail(res.data.post);
        setLoading(false);
      })
      .catch(e => {
        alert("알 수 없는 오류가 발생했습니다");
        navi(-1);
      });
  };
  return (
    <>
      {loading ? <Loading /> : null}
      {}
      <h2 className="text-center text-3xl py-2 font-neoheavy">면접상세내용</h2>
      <div className="container mx-auto grid grid-cols-1 gap-1">
        {boardId === "B01" ? (
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
      <div className="container mx-auto text-center mt-2">
        <button className="p-2 w-60 mx-auto bg-green-500 text-white rounded">
          수정하기
        </button>
      </div>
    </>
  );
}

export default Detail;
