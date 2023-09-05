import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";
import Loading from "../Layout/Loading";
function Detail() {
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const location = useLocation();
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
    console.log(detail);
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
        console.log(res);
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
      <h2 className="text-center text-3xl py-2 font-neoheavy">면접상세내용</h2>
    </>
  );
}

export default Detail;
