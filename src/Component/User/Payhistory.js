import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../Layout/Loading";
import PayList from "./PayList";

function Payhistory() {
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    getList();
    //eslint-disable-next-line
  }, [location]);

  const getList = async () => {
    console.log(user);
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
        console.log(res.data);
        res.data.code === "E403" && alert(res.data.message);
        res.data.code === "C000" && setLoaded(true);
        setList(res.data.postList ?? [{ postId: "없음" }]);
      })
      .catch(e => {
        alert("알 수 없는 오류가 발생했습니다");
      });
  };

  return (
    <>
      {loaded ? (
        <>
          {list.length > 0 ? (
            <>
              <div className="grid grid-cols-7 py-2 bg-blue-50 divide-x">
                <div className="font-neoextra text-center">면접날짜</div>
                <div className="font-neoextra text-center">면접시간</div>
                <div className="font-neoextra text-center">지급결과</div>
                <div className="font-neoextra text-center col-span-2">
                  지급액/사유<span className="text-sm font-neo">(불가시)</span>
                </div>
                <div className="font-neoextra text-center col-span-2">
                  수정/취소
                </div>
              </div>
              <div className="grid grid-cols-1">
                {list.map((doc, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-7 py-2 gap-y-3 ${
                      idx % 2 === 1
                        ? "bg-green-50 hover:bg-green-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <PayList doc={doc} getList={getList} />
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Payhistory;
