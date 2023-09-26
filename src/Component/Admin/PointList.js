import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../Reducer/userSlice";
import Loading from "../Layout/Loading";

function PointList() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [list, setList] = useState([]);
  const user = useSelector(state => state.user);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedDocsId, setSelectedDocsId] = useState([]);
  const location = useLocation();
  const [point, setPoint] = useState("");

  useEffect(() => {
    loadList();
    //eslint-disable-next-line
  }, [location]);

  const checkDocs = (doc, checked) => {
    console.log(doc);
    if (checked) {
      // 체크박스가 선택된 경우, 아이템을 배열에 추가
      setSelectedDocs([
        ...selectedDocs,
        { postId: doc.postId, phone: doc.phone, name: doc.userName },
      ]);
      setSelectedDocsId([...selectedDocsId, { postId: doc.postId }]);
    } else {
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedDocs(selectedDocs.filter(item => item.postId !== doc.postId));
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedDocsId(
        selectedDocsId.filter(item => item.postId !== doc.postId)
      );
    }
  };

  const incPoint = async () => {
    const request = {
      idList: selectedDocsId,
      point: point,
    };
    console.log(request.idList);
    console.log(request.point);
    await axios
      .post("/api/v1/user/admin/manage/point/P", request, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.headers.authorization) {
          if (res.headers.authorization !== user.accessToken) {
            dispatch(
              getNewToken({
                accessToken: res.headers.authroiztion,
              })
            );
          }
        }
        console.log(res.data);
        console.log(res.headers);
        if (res.data.code === "C000") {
          loadList();
          setPoint(0);
          setSelectedDocs([]);
          setSelectedDocsId([]);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const decPoint = async () => {
    const request = {
      idList: selectedDocsId,
      point: point,
    };
    console.log(request.docList);
    console.log(request.point);
    await axios
      .post("/api/v1/user/admin/manage/point/D", request, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.headers.authorization) {
          if (res.headers.authorization !== user.accessToken) {
            dispatch(
              getNewToken({
                accessToken: res.headers.authroiztion,
              })
            );
          }
        }
        console.log(res.data);
        console.log(res.headers);
        if (res.data.code === "C000") {
          loadList();
          setPoint(0);
          setSelectedDocs([]);
          setSelectedDocsId([]);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const loadList = async () => {
    const data = {
      boardId: "B02",
    };
    await axios
      .get("/api/v1/board/admin/posts", {
        params: data,
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
        alert("알 수 없는 오류가 발생했습니다");
      });
  };

  const formatPhoneNumber = phoneNumber => {
    if (phoneNumber && phoneNumber.length === 11) {
      const formattedNumber = phoneNumber.replace(
        /(\d{3})(\d{4})(\d{4})/,
        "$1-$2-$3"
      );
      return formattedNumber;
    }
    return phoneNumber;
  };

  return (
    <>
      {loaded ? (
        <>
          <h2 className="p-4 text-center font-neoheavy text-3xl">
            지급 신청 목록
          </h2>
          {list.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 mt-2 bg-white p-2 container mx-auto">
              {list.map((doc, idx) => (
                <div key={idx}>
                  <input
                    type="checkbox"
                    value={doc.postId}
                    className="hidden peer"
                    id={doc.postId}
                    onChange={e => checkDocs(doc, e.target.checked)}
                  />
                  <label
                    htmlFor={doc.postId}
                    className="block p-2 bg-teal-50 hover:bg-teal-200 text-black rounded-lg border-2 border-teal-50 hover:border-teal-200 peer-checked:border-teal-500 peer-checked:hover:border-teal-500"
                  >
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="font-medium flex flex-col justify-center text-right">
                        이름
                      </div>
                      <div className="font-normal col-span-2 flex flex-col justify-center">
                        {doc.userName}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="font-medium flex flex-col justify-center text-right">
                        연락처
                      </div>
                      <div className="font-normal col-span-2 flex flex-col justify-center">
                        {formatPhoneNumber(doc.phone)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="font-medium flex flex-col justify-center text-right">
                        면접일시
                      </div>
                      <div
                        className="font-normal col-span-2 flex flex-col justify-center"
                        title={doc.intvDate}
                      >
                        {doc.intvDate} {doc.intvTime}시 {doc.intvMin}분
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div>목록을 불러오지 못했습니다.</div>
          )}

          {selectedDocs.length > 0 && (
            <>
              <div className="fixed container bottom-0 left-1/2 -translate-x-1/2 bg-white p-3 rounded-t-xl drop-shadow-xl">
                <div className="test-xl xl:text-2xl font-medium text-left">
                  포인트 지급(차감)대상
                </div>
                <div className="mt-2 flex flex-row flex-wrap gap-2">
                  {selectedDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-yellow-50 rounded-xl flex flex-col gap-2 justify-center"
                    >
                      <p>이름 : {doc.name}</p>
                      <p>연락처 : {doc.phone}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 bg-rose-50 p-2 grid grid-cols-1 xl:grid-cols-2 gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                      onClick={e => setPoint(Number(point) + 1000)}
                    >
                      +1000
                    </button>
                    <button
                      className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                      onClick={e => setPoint(Number(point) + 5000)}
                    >
                      + 5000
                    </button>
                    <button
                      className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                      onClick={e => setPoint(Number(point) + 10000)}
                    >
                      + 10000
                    </button>
                    <button
                      className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                      onClick={e => setPoint(Number(point) - 1000)}
                    >
                      - 1000
                    </button>
                    <button
                      className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                      onClick={e => setPoint(Number(point) - 5000)}
                    >
                      - 5000
                    </button>
                    <button
                      className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                      onClick={e => setPoint(0)}
                    >
                      0 으로
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="number"
                      className="p-2 bg-white border font-medium"
                      value={point}
                      onChange={e => setPoint(e.currentTarget.value)}
                      onBlur={e => setPoint(e.currentTarget.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="transition duration-150 ease-out p-2 bg-sky-500 hover:bg-sky-700 text-white rounded-lg font-medium hover:animate-wiggle"
                        onClick={incPoint}
                      >
                        포인트 지급
                      </button>
                      <button
                        className="transition duration-150 ease-out p-2 bg-white  border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 hover:border-red-700 hover:text-red-700  hover:animate-wiggle"
                        onClick={decPoint}
                      >
                        포인트 차감
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default PointList;
