import React, { useEffect, useState } from "react";

import start1 from "../../../Asset/Content2/start.jpg";
import start2 from "../../../Asset/Content2/start2.jpg";
import q1 from "../../../Asset/Content2/q1.jpg";
import q2 from "../../../Asset/Content2/q2.jpg";
import q3 from "../../../Asset/Content2/q3.jpg";
import q4 from "../../../Asset/Content2/q4.jpg";
import q5 from "../../../Asset/Content2/q5.jpg";
import ra from "../../../Asset/Content2/a.jpg";
import rb from "../../../Asset/Content2/b.jpg";
import rc from "../../../Asset/Content2/c.jpg";
import rd from "../../../Asset/Content2/d.jpg";

import PopupDom from "../../Kakao/PopupDom";
import PopupPostCode from "../../Kakao/PopupPostCode";
import Modal from "../../doc/Modal";
import axios from "axios";
import { Helmet } from "react-helmet";
import { GridLoader } from "react-spinners";
import { FaCheck } from "react-icons/fa";
// kakao 기능 동작을 위해 넣어준다.
const { Kakao } = window;

function Content2() {
  const [start, setStart] = useState(false);
  const [grade, setGrade] = useState(0);
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const [answer5, setAnswer5] = useState("");
  const [isResult, setIsResult] = useState(false);
  const [mainAddr, setMainAddr] = useState("주소찾기를 눌러주세요");

  const [buttonOn, setButtonOn] = useState(false);

  const [isAgree, setIsAgree] = useState(false);

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);

  const [complete, setComplete] = useState(false);
  const [resultMsg, setResultMsg] = useState("");
  const [result, setResult] = useState("");
  // 재랜더링시에 실행되게 해준다.
  useEffect(() => {
    // init 해주기 전에 clean up 을 해준다.
    Kakao.cleanup();
    // 자신의 js 키를 넣어준다.
    Kakao.init("9c2b5fe0dd73c70670ee80bef1b17937");
  }, []);
  useEffect(() => {
    if (grade > 4 && answer5 !== "") {
      chkAnswer();
    }
    //eslint-disable-next-line
  }, [grade, answer5]);

  const chkAnswer = async () => {
    let answerList = [];
    answerList.push(answer1);
    answerList.push(answer2);
    answerList.push(answer3);
    answerList.push(answer4);
    answerList.push(answer5);
    const result = await chkList(answerList);
    setResult(result);
    setTimeout(() => {
      setIsResult(true);
    }, 3000); // 3000밀리초 = 3초
  };

  const chkList = list => {
    const countMap = {};
    let maxCount = 0;
    let mostFrequentString = null;

    for (const string of list) {
      if (countMap[string]) {
        countMap[string]++;
      } else {
        countMap[string] = 1;
      }

      if (countMap[string] > maxCount) {
        maxCount = countMap[string];
        mostFrequentString = string;
      }
    }

    return mostFrequentString;
  };
  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  const doCert = () => {
    window.open(
      "/certification",
      "본인인증팝업",
      "toolbar=no, width=480, height=900, directories=no, status=no, scrollorbars=no, resizable=no"
    );

    window.parentCallback = d => {
      certToBack(d);
    };
  };

  const certToBack = async d => {
    let data = d;
    data.gubun = "event";
    data.jobType = 2;
    await axios
      .post("/api/v1/user/nice/dec/result", data)
      .then(res => {
        if (res.data.code === "C000") {
          inputData(res.data.tempId);
        } else {
          setResultMsg(res.data.message);
          setComplete(true);
        }
      })
      .catch(e => console.log(e));
  };

  const inputData = async t => {
    const data = {
      tempId: t,
      address: mainAddr,
      jobType: 2,
    };
    await axios
      .post("/api/v1/user/applicants/add", data)
      .then(res => {
        setResultMsg(res.data.message);
        setComplete(true);
      })
      .catch(e => console.log(e));
  };
  return (
    <>
      <Helmet>
        <title>나의 직업 DNA는? || 커피쿠폰 증정!</title>
        <meta
          name="Description"
          content="나의 직업DNA 확인하고 커피쿠폰 받아가세요!"
        />
      </Helmet>
      <div className="fixed w-full max-w-[500px] h-screen overflow-x-hidden overflow-y-auto top-0 left-1/2 -translate-x-1/2 bg-white z-10 border">
        {complete ? (
          <div className="relative w-full h-full bg-[#5d55ff] text-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[90%]">
              <h3 className="ppbold text-2xl lg:text-4xl mb-5">
                이용해 주셔서 감사합니다
              </h3>
              <div className="text-xl lg:text-3xl mb-5 ppbold text-[#ff0]">
                {resultMsg}
              </div>
              <div className="text-lg lg:text-3xl mb-10 pplight">
                빠른 시일내로 알맞은 채용정보를 <br />
                전해드리겠습니다
              </div>
            </div>
          </div>
        ) : (
          <>
            {!start ? (
              <div
                className="w-fit bg-[#ecff6f] lg:bg-white hover:cursor-pointer"
                onMouseEnter={() => setButtonOn(true)}
                onMouseLeave={() => setButtonOn(false)}
                onClick={() => setStart(true)}
                style={{ height: "calc(100vh - 10px)" }}
              >
                {buttonOn ? (
                  <img src={start2} alt="내 직업 DNA 찾기" />
                ) : (
                  <img src={start1} alt="내 직업 DNA 찾기" />
                )}
              </div>
            ) : (
              <>
                {!isResult ? (
                  <>
                    <div className="h-[10px] w-full bg-gray-200">
                      <div
                        className="transition-all duration-300 h-full bg-[#ecff6f]"
                        style={{
                          width: `${grade < 5 ? (grade + 1) * 20 : 100}%`,
                        }}
                      />
                    </div>
                    {grade === 0 ? (
                      <div
                        className="w-fit relative flex flex-col justify-between lg:justify-start"
                        style={{ height: "calc(100vh - 10px)" }}
                      >
                        <img src={q1} alt="당신이 선호하는 일의 환경은?" />
                        <div className="flex flex-col justify-start gap-y-3 px-5 lg:px-10 pb-20 lg:pb-0">
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer1("a");
                              setGrade(grade + 1);
                            }}
                          >
                            a. 조용하고 개인 작업이 가능한 환경
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer1("b");
                              setGrade(grade + 1);
                            }}
                          >
                            b. 창의적인 자극과 함께 하는 열린 환경
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer1("c");
                              setGrade(grade + 1);
                            }}
                          >
                            c. 활발하게 소통하며 팀과 혐업하는 환경
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer1("d");
                              setGrade(grade + 1);
                            }}
                          >
                            d. 숙고하며 전략적으로 일하는 환경
                          </button>
                        </div>
                      </div>
                    ) : grade === 1 ? (
                      <div
                        className="w-fit relative flex flex-col justify-between lg:justify-start"
                        style={{ height: "calc(100vh - 10px)" }}
                      >
                        <img
                          src={q2}
                          alt="스트레스 상황에서 당신의 대처 방식은?"
                        />
                        <div className="flex flex-col justify-start gap-y-3 px-5 lg:px-10 pb-20 lg:pb-0">
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer2("a");
                              setGrade(grade + 1);
                            }}
                          >
                            a. 논리적으로 문제를 해결하고 분석
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer2("b");
                              setGrade(grade + 1);
                            }}
                          >
                            b. 창의적인 해결책을 찾아냄
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer2("c");
                              setGrade(grade + 1);
                            }}
                          >
                            c. 동료들과 함께 이야기하고 해결책 모색
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer2("d");
                              setGrade(grade + 1);
                            }}
                          >
                            d. 상황을 잘 파악하고 전략을 세움
                          </button>
                        </div>
                      </div>
                    ) : grade === 2 ? (
                      <div
                        className="w-fit relative flex flex-col  justify-between lg:justify-start"
                        style={{ height: "calc(100vh - 10px)" }}
                      >
                        <img src={q3} alt="가장 중요하게 생각하는 가치는?" />
                        <div className="flex flex-col justify-start gap-y-3 px-5 lg:px-10 pb-20 lg:pb-0">
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer3("a");
                              setGrade(grade + 1);
                            }}
                          >
                            a. 성과와 성장
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer3("b");
                              setGrade(grade + 1);
                            }}
                          >
                            b. 창의성과 자유
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer3("c");
                              setGrade(grade + 1);
                            }}
                          >
                            c. 팀워크와 사회적 기여
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer3("d");
                              setGrade(grade + 1);
                            }}
                          >
                            d. 지적 자극과 지식의 증진
                          </button>
                        </div>
                      </div>
                    ) : grade === 3 ? (
                      <div
                        className="w-fit relative flex flex-col justify-between lg:justify-start"
                        style={{ height: "calc(100vh - 10px)" }}
                      >
                        <img src={q4} alt="당신이 흥미를 가지는 분야는?" />
                        <div className="flex flex-col justify-start gap-y-3 px-5 lg:px-10 pb-20 lg:pb-0">
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer4("a");
                              setGrade(grade + 1);
                            }}
                          >
                            a. 데이터 분석 및 과학
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer4("b");
                              setGrade(grade + 1);
                            }}
                          >
                            b. 금융 및 보험 분야
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer4("c");
                              setGrade(grade + 1);
                            }}
                          >
                            c. 경영, 팀 리더십
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer4("d");
                              setGrade(grade + 1);
                            }}
                          >
                            d. 영업 및 전략 개발
                          </button>
                        </div>
                      </div>
                    ) : grade === 4 ? (
                      <div
                        className="w-fit relative flex flex-col justify-between lg:justify-start"
                        style={{ height: "calc(100vh - 10px)" }}
                      >
                        <img
                          src={q5}
                          alt="미래에 대한 비전 중 어떤 것이 당신에게 더 부합하다고 생각하나요?"
                        />
                        <div className="flex flex-col justify-start gap-y-3 px-5 lg:px-10 pb-20 lg:pb-0">
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer5("a");
                              setGrade(grade + 1);
                            }}
                          >
                            a. 전문 기술 분야에서 성장
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer5("b");
                              setGrade(grade + 1);
                            }}
                          >
                            b. 금융 및 보험 분야에서의 경력 향상
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer5("c");
                              setGrade(grade + 1);
                            }}
                          >
                            c. 팀과 협업하며 조직 내에서 승진
                          </button>
                          <button
                            className="bg-[#5d55ff] lg:hover:bg-[#ecff6f] text-white lg:hover:text-[#5d55ff] py-3 lg:py-4 rounded text-sm lg:text-xl"
                            onClick={() => {
                              setAnswer5("d");
                              setGrade(grade + 1);
                            }}
                          >
                            d. 금융 분야에서 전략적으로 일하기
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative"
                        style={{ height: "calc(100vh - 10px)" }}
                      >
                        <div className="absolute text-center w-full h-auto top-20 left-0 text-2xl lg:text-4xl pplight text-[#5d55ff]">
                          결과를 확인하고 있습니다.
                          <br />
                          잠시만 기다려 주세요...
                        </div>
                        <GridLoader
                          color="#5d55ff"
                          size={20}
                          cssOverride={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-full h-fit mb-0">
                      {result === "a" ? (
                        <>
                          <img src={ra} alt="데이터 마스터" />
                          <div className="w-0 h-0 overflow-hidden opacity-0">
                            당신은 논리적이고 분석적인 사고를 가진 데이터 마스터
                            입니다. 숫자와 데이터 분석에 뛰어나며 데이터
                            사이언티스트, 비즈니스 애널리스트, 금융 분석가와
                            같은 분야에서 높은 성과를 거둘 수 있을 것입니다.
                          </div>
                        </>
                      ) : result === "b" ? (
                        <>
                          <img src={rb} alt="금융 전문가" />
                          <div className="w-0 h-0 overflow-hidden opacity-0">
                            당신은 금융 및 보험 분야에서의 경력 향상을
                            중요시하는 사람입니다. 보험영업직이나 금융
                            컨설턴트로서 높은 업적을 이룰 수 있을 것입니다.
                          </div>
                        </>
                      ) : result === "c" ? (
                        <>
                          <img src={rc} alt="팀 협업가" />
                          <div className="w-0 h-0 overflow-hidden opacity-0">
                            당신은 팀워크와 소통을 중요시하는 팀 협업가 입니다.
                            주변 사람들과의 소통을 통해 문제를 해결하고,
                            영업리더, 프로젝트 매니저, 커뮤니케이션 전문가와
                            같은 직업이 당신에게 어울릴 것입니다.
                          </div>
                        </>
                      ) : result === "d" ? (
                        <>
                          <img src={rd} alt="데이터 마스터" />
                          <div className="w-0 h-0 overflow-hidden opacity-0">
                            당신은 논리적이고 분석적인 사고를 가진 데이터 마스터
                            입니다. 숫자와 데이터 분석에 뛰어나며 데이터
                            사이언티스트, 비즈니스 애널리스트, 금융 분석가와
                            같은 분야에서 높은 성과를 거둘 수 있을 것입니다.
                          </div>
                        </>
                      ) : null}
                    </div>

                    <div className="px-4 lg:px-10 relative w-full pt-3 pb-10 bg-[#5d55ff]">
                      <div className="bg-white grid grid-cols-3 lg:grid-cols-4 text-sm lg:text-xl drop-shadow-lg rounded-lg">
                        <input
                          type="text"
                          className="p-2 lg:p-4 col-span-2 lg:col-span-3"
                          value={mainAddr}
                          onChange={e => setMainAddr(e.currentTarget.value)}
                          onBlur={e => setMainAddr(e.currentTarget.value)}
                          disabled
                        />

                        <button
                          className="w-full h-full p-2 text-[#5d55ff] bg-[#ecff6f] lg:hover:bg-white text-sm lg:text-lg rounded-e-lg"
                          onClick={e => {
                            e.preventDefault();
                            openPostCode();
                          }}
                        >
                          주소찾기
                        </button>
                      </div>
                      <button
                        className="w-full rounded-lg bg-white lg:hover:bg-[#ecff6f] p-2 lg:p-4 text-[#5d55ff] my-3 lg:my-5 text-base lg:text-xl drop-shadow-lg"
                        onClick={() => {
                          if (mainAddr === "주소찾기를 눌러주세요") {
                            alert("주소찾기를 눌러 주소를 입력해 주세요");
                          } else if (!isAgree) {
                            alert(
                              "개인정보 처리방침에 동의해 주셔야 이용 가능합니다"
                            );
                          } else {
                            doCert();
                          }
                        }}
                      >
                        본인인증 하고 내 주변 채용정보 받아보기
                      </button>
                      <div className="flex justify-start gap-x-2 hover:cursor-pointer">
                        <div
                          className={`border border-[#5d55ff] ${
                            isAgree
                              ? "bg-[#ecff6f] text-[#5d55ff]"
                              : "bg-white text-gray-300"
                          } p-2 items-center rounded-lg`}
                          onClick={() => setIsAgree(!isAgree)}
                        >
                          <FaCheck size={20} className="hidden lg:block" />
                          <FaCheck size={12} className="block lg:hidden" />
                        </div>
                        <div className="items-center text-base lg:text-xl flex flex-col justify-center text-white">
                          <div>
                            <span
                              className="text-[#ecff6f] border-b-2 border-[#ecff6f] font-neoextra"
                              onClick={e => {
                                e.preventDefault();
                                setModalCount(6);
                                setModalOn(true);
                              }}
                            >
                              개인정보 처리방침
                            </span>
                            <span onClick={() => setIsAgree(!isAgree)}>
                              에 동의합니다
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-white px-4 lg:px-8 py-8 flex flex-col justify-start gap-y-3">
                      <h4 className="text-lg font-neoheavy">유의사항</h4>
                      <ul className="flex flex-col justify-start gap-y-3 font-neo pl-4">
                        <li className="text-sm lg:text-base list-disc">
                          중복 응모는 무효 처리될 수 있으며, 하나의 핸드폰
                          번호로 한 번만 참여 가능합니다.
                        </li>
                        <li className="text-sm lg:text-base list-disc">
                          본 이벤트는 당사 사정에 따라 예고없이 중단 또는 변경될
                          수 있습니다
                        </li>
                        <li className="text-sm lg:text-base list-disc">
                          경품은 당사의 사정에 의해 예고 없이 변경될 수
                          있습니다.
                        </li>
                        <li className="text-sm lg:text-base list-disc">
                          쿠폰은 상담 후 지급됩니다
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div id="popupDom" className={isPopupOpen ? "popupModal" : ""}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode onClose={closePostCode} setMainAddr={setMainAddr} />
          </PopupDom>
        )}
      </div>
      {modalOn ? (
        <Modal
          modalCount={modalCount}
          setModalOn={setModalOn}
          setModalCount={setModalCount}
        />
      ) : null}
    </>
  );
}

export default Content2;
