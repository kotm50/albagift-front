import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import { useSelector } from "react-redux";

function List() {
  const navi = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [list, setList] = useState([]);
  const { id } = useParams();
  const user = useSelector(state => state.user);
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const boardId = parsed.boardId || "B01";

  useEffect(() => {
    loadList();
    //eslint-disable-next-line
  }, [location]);

  const loadList = async () => {
    const data = {
      boardId: boardId,
    };
    await axios
      .post("/api/v1/board/get/pnt/posts/list", data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        console.log(res);
        res.data.code === "C000" ? setLoaded(true) : setLoaded(false);
        setList(res.data.postList ?? [{ postId: "없음" }]);
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      <h2 className="p-4 text-center font-neoheavy text-3xl">
        {boardId === "B01" ? "지급 신청 목록" : "게시판"}
      </h2>
    </>
  );
}

export default List;
