import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

function MyMain() {
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [meeting, setMeeting] = useState(0);

  useEffect(() => {
    getMeet();
    //eslint-disable-next-line
  }, [location]);

  const getMeet = async () => {
    const data = {
      boardId: "B02",
    };
    await axios
      .post("/api/v1/board/get/pnt/posts/list", data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        setMeeting(res.data.postList.length);
      })
      .catch(e => {
        alert("알 수 없는 오류가 발생했습니다");
      });
  };
  return (
    <div className="container mx-auto p-2 ">
      <div className="border p-2 bg-white drop-shadow-lg mb-3">
        안녕하세요! <span className="font-neoextra">{user.userName}</span> 님
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="border p-2 bg-white drop-shadow-lg">
          <div>면접 본 횟수</div>
          <div>{meeting}회</div>
        </div>
        <div className="border p-2 bg-white drop-shadow-lg">
          {user.userName} 님
        </div>
        <div className="border p-2 bg-white drop-shadow-lg">
          {user.userName} 님
        </div>
      </div>
    </div>
  );
}

export default MyMain;
