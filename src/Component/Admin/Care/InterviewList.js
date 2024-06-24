import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import html2canvas from "html2canvas";

function InterviewList() {
  const [OriginData, setOriginData] = useState("");
  const [Array, setArray] = useState(null);
  const [Array2, setArray2] = useState(null);
  const [Array3, setArray3] = useState(null);
  const [Array4, setArray4] = useState(null);
  const [Array5, setArray5] = useState(null);
  const [ArrOn, setArrOn] = useState(false);
  const [ArrOn2, setArrOn2] = useState(false);
  const [ArrOn3, setArrOn3] = useState(false);
  const [ArrOn4, setArrOn4] = useState(false);
  const [ArrOn5, setArrOn5] = useState(false);
  const [Today, setToday] = useState("");
  let now = dayjs();
  const inputSheet = useRef();

  useEffect(() => {
    document.body.className = "basic";
    setToday(now.format("YYYY년 MM월 DD일"));
    // eslint-disable-next-line
  }, []);
  //const [JsonData, setJsonData] = useState([])
  const convertJson = e => {
    setArrOn(false);
    setArrOn2(false);
    setArrOn3(false);
    setArrOn4(false);
    setArrOn5(false);
    setArray(null);
    setArray2(null);
    setArray3(null);
    setArray4(null);
    setArray5(null);
    let jsonA = OriginData.split("\n");
    let jsonB = [];
    let jsonC = [];
    let jsonD = [];
    let jsonE = [];
    let jsonF = [];
    let jsonG = [];
    let jsonETC = [];
    let body = {};
    jsonA.forEach((row, index) => {
      jsonB = row.split("\t");
      if (row.length === 0) return;
      body = {
        id: index,
        num: jsonB[0],
        interview: jsonB[1],
        comp: jsonB[2],
        name: jsonB[3],
        age: jsonB[4],
        gender: jsonB[5],
        contact: jsonB[6],
        result: jsonB[8],
        stat: jsonB[9],
      };
      if (index < 20) {
        jsonC.push(body);
      } else if (index < 40) {
        jsonD.push(body);
      } else if (index < 60) {
        jsonE.push(body);
      } else if (index < 80) {
        jsonF.push(body);
      } else if (index < 100) {
        jsonG.push(body);
      } else {
        jsonETC.push(body);
      }
    });
    if (jsonC.length > 0 && jsonC.length < 20) {
      let i;
      for (i = jsonC.length; i < 20; i++) {
        body = {
          id: i,
        };
        jsonC.push(body);
      }
    }

    if (jsonD.length > 0 && jsonD.length < 20) {
      let i;
      for (i = jsonD.length; i < 20; i++) {
        body = {
          id: i + 20,
        };
        jsonD.push(body);
      }
    }

    if (jsonE.length > 0 && jsonE.length < 20) {
      let i;
      for (i = jsonE.length; i < 20; i++) {
        body = {
          id: i + 40,
        };
        jsonE.push(body);
      }
    }
    if (jsonF.length > 0 && jsonF.length < 20) {
      let i;
      for (i = jsonF.length; i < 20; i++) {
        body = {
          id: i + 60,
        };
        jsonF.push(body);
      }
    }
    if (jsonG.length > 0 && jsonG.length < 20) {
      let i;
      for (i = jsonG.length; i < 20; i++) {
        body = {
          id: i + 80,
        };
        jsonG.push(body);
      }
    }
    if (jsonC.length > 0) {
      setArray(jsonC);
      setArrOn(true);
    }
    if (jsonD.length > 0) {
      setArray2(jsonD);
      setArrOn2(true);
    }
    if (jsonE.length > 0) {
      setArray3(jsonE);
      setArrOn3(true);
    }
    if (jsonF.length > 0) {
      setArray4(jsonF);
      setArrOn4(true);
    }

    if (jsonG.length > 0) {
      setArray5(jsonG);
      setArrOn5(true);
    }
  };

  useEffect(() => {
    convertJson();
    // eslint-disable-next-line
  }, [OriginData]);

  const onSaveToImgAll = () => {
    onSaveToImg(1);
    setTimeout(() => {
      if (ArrOn2) onSaveToImg(2);
    }, 500);
    setTimeout(() => {
      if (ArrOn3) onSaveToImg(3);
    }, 1000);
    setTimeout(() => {
      if (ArrOn4) onSaveToImg(4);
    }, 1500);
    setTimeout(() => {
      if (ArrOn5) onSaveToImg(5);
    }, 2000);
  };

  const onClipToImg = c => {
    const { ClipboardItem } = window;
    let capture;
    //클릭 이벤트
    if (c === 1) {
      capture = document.querySelector("#capture1"); //이미지 저장 영역
    } else if (c === 2) {
      capture = document.querySelector("#capture2"); //이미지 저장 영역
    } else if (c === 3) {
      capture = document.querySelector("#capture3"); //이미지 저장 영역
    } else if (c === 4) {
      capture = document.querySelector("#capture4"); //이미지 저장 영역
    } else if (c === 5) {
      capture = document.querySelector("#capture5"); //이미지 저장 영역
    }
    html2canvas(capture).then(canvas => {
      canvas.toBlob(blob =>
        navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      );
    });
  };

  const onSaveToImg = c => {
    let capture;
    //클릭 이벤트
    if (c === 1) {
      capture = document.querySelector("#capture1"); //이미지 저장 영역
    } else if (c === 2) {
      capture = document.querySelector("#capture2"); //이미지 저장 영역
    } else if (c === 3) {
      capture = document.querySelector("#capture3"); //이미지 저장 영역
    } else if (c === 4) {
      capture = document.querySelector("#capture4"); //이미지 저장 영역
    } else if (c === 5) {
      capture = document.querySelector("#capture5"); //이미지 저장 영역
    }
    let captureTime = now.format("YYYYMMDDHHmm");
    html2canvas(capture).then(canvas => {
      if (c === 1) {
        saveAs(canvas.toDataURL("image/jpg"), "공유_1_" + captureTime + ".jpg");
      } else if (c === 2) {
        saveAs(canvas.toDataURL("image/jpg"), "공유_2_" + captureTime + ".jpg");
      } else if (c === 3) {
        saveAs(canvas.toDataURL("image/jpg"), "공유_3_" + captureTime + ".jpg");
      } else if (c === 4) {
        saveAs(canvas.toDataURL("image/jpg"), "공유_4_" + captureTime + ".jpg");
      } else if (c === 5) {
        saveAs(canvas.toDataURL("image/jpg"), "공유_5_" + captureTime + ".jpg");
      }
    });
  };

  const saveAs = (uri, filename) => {
    let link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  };

  return (
    <>
      <div className="position-fixed bg-white bottom-0 start-0 border-t w-full p-3 text-center">
        {!ArrOn ? (
          <span onClick={e => inputSheet.current.focus()}>
            시트에서 내용을 복사하여 붙여넣기 해주세요
          </span>
        ) : (
          <>
            <button
              className="bg-blue-500 text-white mr-2 p-2"
              onClick={e => onClipToImg(1)}
            >
              1번 이미지 캡쳐
            </button>
            {!ArrOn2 ? null : (
              <button
                className="bg-blue-500 text-white mr-2 p-2"
                onClick={e => onClipToImg(2)}
              >
                2번 이미지 캡쳐
              </button>
            )}
            {!ArrOn3 ? null : (
              <button
                className="bg-blue-500 text-white mr-2 p-2"
                onClick={e => onClipToImg(3)}
              >
                3번 이미지 캡쳐
              </button>
            )}
            {!ArrOn4 ? null : (
              <button
                className="bg-blue-500 text-white mr-2 p-2"
                onClick={e => onClipToImg(4)}
              >
                4번 이미지 캡쳐
              </button>
            )}

            {!ArrOn5 ? null : (
              <button
                className="bg-blue-500 text-white p-2"
                onClick={e => onClipToImg(5)}
              >
                5번 이미지 캡쳐
              </button>
            )}
          </>
        )}
      </div>
      <div className="p-2 container mx-auto">
        <h6 className="hidden">
          기본 리스트{" "}
          <Link to="/careon" className="bg-blue-500 text-white p-2">
            케어여부 포함 리스트 페이지로
          </Link>{" "}
          <Link to="/ftf" className="bg-blue-500 text-white p-2">
            대면영업 리스트페이지로
          </Link>
        </h6>
        <textarea
          ref={inputSheet}
          className="mb-2 border rounded-lg mx-auto"
          value={OriginData}
          onChange={e => {
            setOriginData(e.currentTarget.value);
          }}
          style={{ width: "100%", height: "48px" }}
          placeholder="2번째 줄 부터 원하는 영역까지 복사(ctrl+c) 하신 다음 여기에 붙여넣기(ctrl+v) 해주세요"
        />
        <div className="mb-3 text-center">
          {!ArrOn ? null : (
            <div className="mb-3">
              <button
                className="bg-green-500 text-white p-2"
                onClick={e => onSaveToImgAll()}
              >
                전부 이미지로 저장
              </button>
            </div>
          )}
          {!ArrOn ? null : (
            <>
              <div
                id="capture1"
                className="bg-white p-3 border mt-2"
                style={{
                  width: "700px",
                  height: "700px",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <h5 className="fw-bold">면접자 리스트 - {Today}</h5>
                <table style={{ fontSize: "0.8em" }}>
                  <thead
                    className="bg-yellow-400"
                    style={{
                      borderBottomWidth: "2px",
                      borderBottomColor: "rgba(0, 0, 0, 0.075)",
                    }}
                  >
                    <tr>
                      <td className="border-l border-r border-t border-stone-500">
                        순서
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접일시
                      </td>
                      <td className="border-r border-t border-stone-500">
                        이름
                      </td>
                      <td className="border-r border-t border-stone-500">
                        나이
                      </td>
                      <td className="border-r border-t border-stone-500">
                        성별
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접결과
                      </td>
                      <td className="border-r border-t border-stone-500">
                        진행상황
                      </td>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#ffe" }}>
                    {Array.map(array => {
                      return (
                        <tr
                          key={array.id}
                          style={
                            array.id % 2 === 0
                              ? { backgroundColor: "#fafafa" }
                              : { backgroundColor: "#fff" }
                          }
                        >
                          <td className="border-l border-r">{array.id + 1}</td>
                          <td className="border-r">{array.interview}</td>
                          <td className="border-r">{array.name}</td>
                          <td className="border-r">{array.age}</td>
                          <td className="border-r">
                            {array.gender === "여자" ? (
                              <span style={{ color: "red" }}>
                                {array.gender}
                              </span>
                            ) : (
                              <span style={{ color: "blue" }}>
                                {array.gender}
                              </span>
                            )}
                          </td>
                          <td
                            className="border-r"
                            style={
                              array.result === "" ||
                              array.result === null ||
                              array.result === undefined
                                ? {
                                    backgroundColor: "#fce5cd",
                                  }
                                : array.result === "입과"
                                ? { backgroundColor: "#c9daf8" }
                                : null
                            }
                          >
                            {array.result === "합격" ? (
                              <span style={{ color: "red" }}>합격</span>
                            ) : array.result === "진행중" ? (
                              <span style={{ color: "blue" }}>진행중</span>
                            ) : array.result === "입과" ? (
                              <span style={{ color: "blue" }}>입과</span>
                            ) : (
                              <span>{array.result}</span>
                            )}
                          </td>
                          <td className="border-r">{array.stat}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div>
                  <p className="text-center">코리아티엠 채용연구소</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mb-3 text-center">
          {!ArrOn2 ? null : (
            <>
              <div
                id="capture2"
                className="bg-white p-3 border mt-2"
                style={{
                  width: "700px",
                  height: "700px",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <h5 className="fw-bold">면접자 리스트 - {Today}</h5>
                <table style={{ fontSize: "0.8em" }}>
                  <thead
                    className="bg-yellow-400"
                    style={{ borderBottomWidth: "2px" }}
                  >
                    <tr>
                      <td className="border-l border-r border-t border-stone-500">
                        순서
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접일시
                      </td>
                      <td className="border-r border-t border-stone-500">
                        이름
                      </td>
                      <td className="border-r border-t border-stone-500">
                        나이
                      </td>
                      <td className="border-r border-t border-stone-500">
                        성별
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접결과
                      </td>
                      <td className="border-r border-t border-stone-500">
                        진행상황
                      </td>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#ffe" }}>
                    {Array2.map(array => {
                      return (
                        <tr
                          key={array.id}
                          style={
                            array.id % 2 === 0
                              ? { backgroundColor: "#fafafa" }
                              : { backgroundColor: "#fff" }
                          }
                        >
                          <td className="border-l border-r">{array.id + 1}</td>
                          <td className="border-r">{array.interview}</td>
                          <td className="border-r">{array.name}</td>
                          <td className="border-r">{array.age}</td>
                          <td className="border-r">
                            {array.gender === "여자" ? (
                              <span style={{ color: "red" }}>
                                {array.gender}
                              </span>
                            ) : (
                              <span style={{ color: "blue" }}>
                                {array.gender}
                              </span>
                            )}
                          </td>
                          <td
                            className="border-r"
                            style={
                              array.result === "" ||
                              array.result === null ||
                              array.result === undefined
                                ? {
                                    backgroundColor: "#fce5cd",
                                  }
                                : array.result === "입과"
                                ? { backgroundColor: "#c9daf8" }
                                : null
                            }
                          >
                            {array.result === "합격" ? (
                              <span style={{ color: "red" }}>합격</span>
                            ) : array.result === "진행중" ? (
                              <span style={{ color: "blue" }}>진행중</span>
                            ) : array.result === "입과" ? (
                              <span style={{ color: "blue" }}>입과</span>
                            ) : (
                              <span>{array.result}</span>
                            )}
                          </td>
                          <td className="border-r">{array.stat}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div>
                  <p className="text-center">코리아티엠 채용연구소</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="text-center" style={{ marginBottom: "100px" }}>
          {!ArrOn3 ? null : (
            <>
              <div
                id="capture3"
                className="bg-white p-3 border mt-2"
                style={{
                  width: "700px",
                  height: "700px",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <h5 className="fw-bold">면접자 리스트 - {Today}</h5>
                <table style={{ fontSize: "0.8em" }}>
                  <thead
                    className="bg-yellow-400"
                    style={{ borderBottomWidth: "2px" }}
                  >
                    <tr>
                      <td className="border-l border-r border-t border-stone-500">
                        순서
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접일시
                      </td>
                      <td className="border-r border-t border-stone-500">
                        이름
                      </td>
                      <td className="border-r border-t border-stone-500">
                        나이
                      </td>
                      <td className="border-r border-t border-stone-500">
                        성별
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접결과
                      </td>
                      <td className="border-r border-t border-stone-500">
                        진행상황
                      </td>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#ffe" }}>
                    {Array3.map(array => {
                      return (
                        <tr
                          key={array.id}
                          style={
                            array.id % 2 === 0
                              ? { backgroundColor: "#fafafa" }
                              : { backgroundColor: "#fff" }
                          }
                        >
                          <td className="border-l border-r">{array.id + 1}</td>
                          <td className="border-r">{array.interview}</td>
                          <td className="border-r">{array.name}</td>
                          <td className="border-r">{array.age}</td>
                          <td className="border-r">
                            {array.gender === "여자" ? (
                              <span style={{ color: "red" }}>
                                {array.gender}
                              </span>
                            ) : (
                              <span style={{ color: "blue" }}>
                                {array.gender}
                              </span>
                            )}
                          </td>
                          <td
                            className="border-r"
                            style={
                              array.result === "" ||
                              array.result === null ||
                              array.result === undefined
                                ? {
                                    backgroundColor: "#fce5cd",
                                  }
                                : array.result === "입과"
                                ? { backgroundColor: "#c9daf8" }
                                : null
                            }
                          >
                            {array.result === "합격" ? (
                              <span style={{ color: "red" }}>합격</span>
                            ) : array.result === "진행중" ? (
                              <span style={{ color: "blue" }}>진행중</span>
                            ) : array.result === "입과" ? (
                              <span style={{ color: "blue" }}>입과</span>
                            ) : (
                              <span>{array.result}</span>
                            )}
                          </td>
                          <td className="border-r">{array.stat}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div>
                  <p className="text-center">코리아티엠 채용연구소</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="text-center" style={{ marginBottom: "100px" }}>
          {!ArrOn4 ? null : (
            <>
              <div
                id="capture4"
                className="bg-white p-3 border mt-2"
                style={{
                  width: "700px",
                  height: "700px",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <h5 className="fw-bold">면접자 리스트 - {Today}</h5>
                <table style={{ fontSize: "0.8em" }}>
                  <thead
                    className="bg-yellow-400"
                    style={{ borderBottomWidth: "2px" }}
                  >
                    <tr>
                      <td className="border-l border-r border-t border-stone-500">
                        순서
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접일시
                      </td>
                      <td className="border-r border-t border-stone-500">
                        이름
                      </td>
                      <td className="border-r border-t border-stone-500">
                        나이
                      </td>
                      <td className="border-r border-t border-stone-500">
                        성별
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접결과
                      </td>
                      <td className="border-r border-t border-stone-500">
                        진행상황
                      </td>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#ffe" }}>
                    {Array4.map(array => {
                      return (
                        <tr
                          key={array.id}
                          style={
                            array.id % 2 === 0
                              ? { backgroundColor: "#fafafa" }
                              : { backgroundColor: "#fff" }
                          }
                        >
                          <td className="border-l border-r">{array.id + 1}</td>
                          <td className="border-r">{array.interview}</td>
                          <td className="border-r">{array.name}</td>
                          <td className="border-r">{array.age}</td>
                          <td className="border-r">
                            {array.gender === "여자" ? (
                              <span style={{ color: "red" }}>
                                {array.gender}
                              </span>
                            ) : (
                              <span style={{ color: "blue" }}>
                                {array.gender}
                              </span>
                            )}
                          </td>
                          <td
                            className="border-r"
                            style={
                              array.result === "" ||
                              array.result === null ||
                              array.result === undefined
                                ? {
                                    backgroundColor: "#fce5cd",
                                  }
                                : array.result === "입과"
                                ? { backgroundColor: "#c9daf8" }
                                : null
                            }
                          >
                            {array.result === "합격" ? (
                              <span style={{ color: "red" }}>합격</span>
                            ) : array.result === "진행중" ? (
                              <span style={{ color: "blue" }}>진행중</span>
                            ) : array.result === "입과" ? (
                              <span style={{ color: "blue" }}>입과</span>
                            ) : (
                              <span>{array.result}</span>
                            )}
                          </td>
                          <td className="border-r">{array.stat}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div>
                  <p className="text-center">코리아티엠 채용연구소</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="text-center" style={{ marginBottom: "100px" }}>
          {!ArrOn5 ? null : (
            <>
              <div
                id="capture5"
                className="bg-white p-3 border mt-2"
                style={{
                  width: "700px",
                  height: "700px",
                  overflow: "hidden",
                  margin: "0 auto",
                }}
              >
                <h5 className="fw-bold">면접자 리스트 - {Today}</h5>
                <table style={{ fontSize: "0.8em" }}>
                  <thead
                    className="bg-yellow-400"
                    style={{ borderBottomWidth: "2px" }}
                  >
                    <tr>
                      <td className="border-l border-r border-t border-stone-500">
                        순서
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접일시
                      </td>
                      <td className="border-r border-t border-stone-500">
                        이름
                      </td>
                      <td className="border-r border-t border-stone-500">
                        나이
                      </td>
                      <td className="border-r border-t border-stone-500">
                        성별
                      </td>
                      <td className="border-r border-t border-stone-500">
                        면접결과
                      </td>
                      <td className="border-r border-t border-stone-500">
                        진행상황
                      </td>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#ffe" }}>
                    {Array5.map(array => {
                      return (
                        <tr
                          key={array.id}
                          style={
                            array.id % 2 === 0
                              ? { backgroundColor: "#fafafa" }
                              : { backgroundColor: "#fff" }
                          }
                        >
                          <td className="border-l border-r">{array.id + 1}</td>
                          <td className="border-r">{array.interview}</td>
                          <td className="border-r">{array.name}</td>
                          <td className="border-r">{array.age}</td>
                          <td className="border-r">
                            {array.gender === "여자" ? (
                              <span style={{ color: "red" }}>
                                {array.gender}
                              </span>
                            ) : (
                              <span style={{ color: "blue" }}>
                                {array.gender}
                              </span>
                            )}
                          </td>
                          <td
                            className="border-r"
                            style={
                              array.result === "" ||
                              array.result === null ||
                              array.result === undefined
                                ? {
                                    backgroundColor: "#fce5cd",
                                  }
                                : array.result === "입과"
                                ? { backgroundColor: "#c9daf8" }
                                : null
                            }
                          >
                            {array.result === "합격" ? (
                              <span style={{ color: "red" }}>합격</span>
                            ) : array.result === "진행중" ? (
                              <span style={{ color: "blue" }}>진행중</span>
                            ) : array.result === "입과" ? (
                              <span style={{ color: "blue" }}>입과</span>
                            ) : (
                              <span>{array.result}</span>
                            )}
                          </td>
                          <td className="border-r">{array.stat}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div>
                  <p className="text-center">코리아티엠 채용연구소</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default InterviewList;
