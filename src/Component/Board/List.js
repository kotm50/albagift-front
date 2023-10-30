import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../Layout/Loading";

function List() {
  const navi = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [list, setList] = useState([]);
  const user = useSelector(state => state.user);
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const boardId = parsed.boardId || "B00";

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
        res.data.code === "E403" && alert(res.data.message);
        res.data.code === "C000" ? setLoaded(true) : console.log("에러");

        setList(res.data.postList ?? [{ postId: "없음" }]);
      })
      .catch(e => {
        alert("알 수 없는 오류가 발생했습니다");
        navi(-1);
      });
  };
  return (
    <>
      {loaded ? (
        <div className="mt-2 container mx-auto">
          <h2 className="p-4 text-center font-neoheavy text-3xl">
            {boardId === "B02" ? "지급 신청 내역" : "게시판"}
          </h2>
          <>
            {list.length > 0 ? (
              <>
                <table className="mx-auto">
                  <thead>
                    <tr>
                      <td className="border bg-orange-600 text-white text-center p-2">
                        날짜
                      </td>
                      <td className="border bg-orange-600 text-white text-center p-2">
                        시간
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((doc, idx) => (
                      <tr
                        key={idx}
                        className="hover:cursor-pointer hover:text-rose-500"
                        onClick={e =>
                          navi(
                            `/board/detail/${doc.postId}?boardId=${boardId}`,
                            {
                              state: {
                                boardId: boardId,
                                token: user.accessToken,
                              },
                            }
                          )
                        }
                      >
                        <td className="border p-2">{doc.intvDate}</td>
                        <td className="border p-2">
                          {doc.intvTime}시 {doc.intvMin}분
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div>목록을 불러오지 못했습니다.</div>
            )}
          </>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default List;
