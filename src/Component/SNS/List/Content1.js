import React, { useEffect, useState } from "react";
import { WiStars } from "react-icons/wi";
import { FaCheck } from "react-icons/fa";
import { RiKakaoTalkFill } from "react-icons/ri";

import starbucks from "../../../Asset/Event/starbucks_big.png";
import banner from "../../../Asset/Event/banner.jpg";

import PopupDom from "../../Kakao/PopupDom";
import PopupPostCode from "../../Kakao/PopupPostCode";
import Modal from "../../doc/Modal";
import axios from "axios";
// kakao 기능 동작을 위해 넣어준다.
const { Kakao } = window;

function Content1() {
  const [answer, setAnswer] = useState(0);
  const [isResult, setIsResult] = useState(false);
  const [mainAddr, setMainAddr] = useState("주소찾기를 눌러주세요");

  const [isAgree, setIsAgree] = useState(false);

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);

  const [complete, setComplete] = useState(false);
  const [result, setResult] = useState("");
  // 재랜더링시에 실행되게 해준다.
  useEffect(() => {
    // init 해주기 전에 clean up 을 해준다.
    Kakao.cleanup();
    // 자신의 js 키를 넣어준다.
    Kakao.init("9c2b5fe0dd73c70670ee80bef1b17937");
  }, []);

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

  const shareKakao = () => {
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "내게 맞는 직업 추천받기",
        description:
          "내 업무 성향에 따라 직업추천도 받고, 커피쿠폰도 받아가세요!",
        imageUrl: banner,
        link: {
          mobileWebUrl: `https://albagift.com/sns/jobrecommend`,
          webUrl: `https://albagift.com/sns/jobrecommend`,
        },
      },
      buttons: [
        {
          title: "내게 맞는 직업 추천받기",
          link: {
            mobileWebUrl: `https://albagift.com/sns/jobrecommend`,
            webUrl: `https://albagift.com/sns/jobrecommend`,
          },
        },
      ],
    });
  };

  const certToBack = async d => {
    let data = d;
    data.gubun = "event";
    await axios
      .post("/api/v1/user/nice/dec/result", data)
      .then(res => {
        inputData(res.data.tempId);
      })
      .catch(e => console.log(e));
  };

  const inputData = async t => {
    const data = {
      tempId: t,
      address: mainAddr,
    };
    await axios
      .post("/api/v1/user/applicants/add", data)
      .then(res => {
        console.log(res);
        setResult(res.data.message);
        setComplete(true);
      })
      .catch(e => console.log(e));
  };

  return (
    <>
      <div className="fixed w-full max-w-[1000px] h-screen overflow-x-hidden overflow-y-auto top-0 left-1/2 -translate-x-1/2 bg-white z-10 border">
        <>
          {complete ? (
            <div className="relative w-full h-full bg-[#1a60fe] text-white">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[90%]">
                <h3 className="ppbold text-2xl lg:text-4xl mb-5">
                  이용해 주셔서 감사합니다
                </h3>
                <div className="text-xl lg:text-3xl mb-5 ppbold text-[#ff0]">
                  {result}
                </div>
                <div className="text-lg lg:text-3xl mb-10 pplight">
                  커피쿠폰은 영업일 기준 2일 안으로 <br />
                  발송하여 드리겠습니다.
                </div>
                <button
                  className="bg-yellow-300 text-black px-10 py-2 flex-center gap-x-2 text-sm lg:text-2xl mx-auto hidden"
                  onClick={() => shareKakao()}
                >
                  <RiKakaoTalkFill size={48} className="hidden lg:block" />
                  <RiKakaoTalkFill size={28} className="lg:hidden block" />
                  <div className="flex flex-col justify-center h-[28px] lg:h-[48px]">
                    카카오톡으로 공유하기
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <>
              {!isResult ? (
                <>
                  <div className="w-full px-4 py-8 lg:px-10 lg:py-20 bg-[#1a60fe] text-white flex flex-col justify-center gap-y-2 lg:gap-y-5 relative">
                    <div className="pplight text-xl lg:text-6xl">
                      나한테 딱 맞는
                    </div>
                    <div className="ppbold text-3xl lg:text-7xl">
                      추천 직업 확인하고
                    </div>
                    <div className="ppbold text-3xl lg:text-7xl relative z-10">
                      커피 쿠폰 받아가기
                    </div>

                    <div className="absolute right-0 botom-0 w-fit h-fit translate-x-[10px] lg:translate-x-[20px] translate-y-[100px] lg:translate-y-[200px]">
                      <img
                        src={starbucks}
                        alt="스타벅스"
                        className="rotate-[30deg] w-[100px] lg:w-[320px] h-auto"
                      />
                    </div>
                    <div className="absolute w-8 h-8 lg:w-16 lg:h-16 bg-[#1a60fe] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 z-0"></div>
                  </div>
                  <div className="px-4 lg:px-10 relative w-full pt-10 lg:pt-16">
                    <button onClick={() => setComplete(true)}>테스트</button>
                    <div className="text-xl lg:text-3xl mb-4">
                      당신은 일을 할 때 <br className="lg:hidden" />
                      어떤 스타일이신가요?
                    </div>
                    <div className="bg-blue-50 border-2 border-[#1a60fe] grid grid-cols-1 divide-y-2 divide-[#1a60fe] text-sm lg:text-xl">
                      <div
                        className={`p-2 lg:p-4 hover:cursor-pointer ${
                          answer === 1
                            ? "bg-[#1a60fe] text-white"
                            : "bg-blue-50 lg:hover:bg-blue-200"
                        }`}
                        onClick={() => {
                          if (answer === 1) {
                            setAnswer(0);
                          } else {
                            setAnswer(1);
                          }
                        }}
                      >
                        계획적이고 체계적인 실행
                      </div>
                      <div
                        className={`p-2 lg:p-4 hover:cursor-pointer ${
                          answer === 2
                            ? "bg-[#1a60fe] text-white"
                            : "bg-blue-50 hover:bg-blue-200"
                        }`}
                        onClick={() => {
                          if (answer === 2) {
                            setAnswer(0);
                          } else {
                            setAnswer(2);
                          }
                        }}
                      >
                        변화와 도전을 통한 효과적인 업무 실행
                      </div>
                      <div
                        className={`p-2 lg:p-4 hover:cursor-pointer ${
                          answer === 3
                            ? "bg-[#1a60fe] text-white"
                            : "bg-blue-50 hover:bg-blue-200"
                        }`}
                        onClick={() => {
                          if (answer === 3) {
                            setAnswer(0);
                          } else {
                            setAnswer(3);
                          }
                        }}
                      >
                        타인과 소통하고 협동을 통한 업무 실행
                      </div>
                      <div
                        className={`p-2 lg:p-4 hover:cursor-pointer ${
                          answer === 4
                            ? "bg-[#1a60fe] text-white"
                            : "bg-blue-50 hover:bg-blue-200"
                        }`}
                        onClick={() => {
                          if (answer === 4) {
                            setAnswer(0);
                          } else {
                            setAnswer(4);
                          }
                        }}
                      >
                        미래를 예측하고 계획 수립을 통한 업무 실행
                      </div>
                    </div>
                    <button
                      className="w-full rounded-full bg-[#1a60fe] hover:bg-blue-700 p-4 text-white mt-10 text-lg lg:text-3xl"
                      onClick={() => {
                        if (answer === 0) {
                          alert("업무스타일을 선택하세요");
                        } else {
                          setIsResult(true);
                        }
                      }}
                    >
                      나의 성향분석 결과 확인
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full px-4 py-8 lg:px-10 lg:py-20 bg-[#1a60fe] text-white flex flex-col justify-center gap-y-2 lg:gap-y-5 relative">
                    <div className="flex justify-center gap-x-3 lg:gap-x-10">
                      <WiStars size={64} className="hidden lg:block" />
                      <WiStars size={40} className="lg:hidden block" />
                      <div className="text-3xl lg:text-6xl ppbold items-center">
                        {answer === 1
                          ? "전 략 가"
                          : answer === 2
                          ? "모 험 가"
                          : answer === 3
                          ? "사 회 자"
                          : answer === 4
                          ? "분 석 가"
                          : null}
                      </div>
                      <WiStars size={64} className="hidden lg:block" />
                      <WiStars size={40} className="lg:hidden block" />
                    </div>
                    <div className="text-center pplight text-lg lg:text-3xl">
                      {answer === 1 ? (
                        <>
                          "문제해결 능력과 전략적 사고를 가진 전략가 유형입니다.{" "}
                          <br className="hidden lg:block" />
                          변화에 대한 높은 적응력을 가지고 있습니다"
                        </>
                      ) : answer === 2 ? (
                        <>
                          "새로운 도전과 행동을 즐기며, 활기찬 환경에서{" "}
                          <br className="hidden lg:block" />
                          효과적으로 업무를 수행할 수 있을 것입니다."
                        </>
                      ) : answer === 3 ? (
                        <>
                          "팀워크와 인간 관계 구축에 뛰어나며 커뮤니케이션
                          능력으로 <br className="hidden lg:block" />
                          다양한 분야에서 성과를 이뤄낼 수 있습니다."
                        </>
                      ) : answer === 4 ? (
                        <>
                          "당신은 문제에 대한 해결책을 찾는 데{" "}
                          <br className="hidden lg:block" />
                          뛰어난 능력을 가지고 있습니다"
                        </>
                      ) : null}
                    </div>
                    <div className="absolute w-8 h-8 lg:w-16 lg:h-16 bg-[#1a60fe] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 z-0"></div>
                  </div>
                  <div className="px-4 lg:px-10 relative w-full pt-10 lg:pt-16">
                    <div className="bg-blue-50 border-2 border-[#1a60fe] grid grid-cols-4 lg:grid-cols-5 divide-y-2 divide-[#1a60fe] text-sm lg:text-xl">
                      <input
                        type="text"
                        className="p-2 lg:p-4 col-span-3 lg:col-span-4"
                        value={mainAddr}
                        onChange={e => setMainAddr(e.currentTarget.value)}
                        onBlur={e => setMainAddr(e.currentTarget.value)}
                        disabled
                      />

                      <button
                        className="w-full h-full p-2 text-white bg-[#1a60fe] hover:bg-blue-700 text-sm lg:text-xl"
                        onClick={e => {
                          e.preventDefault();
                          openPostCode();
                        }}
                      >
                        주소찾기
                      </button>
                    </div>
                    <button
                      className="w-full rounded-full bg-[#1a60fe] hover:bg-blue-700 p-4 text-white my-5 lg:my-10 text-lg lg:text-3xl"
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
                      본인인증 하고 커피쿠폰 받기
                    </button>
                    <div className="flex justify-start gap-x-2 hover:cursor-pointer">
                      <div
                        className={`border border-[#1a60fe] ${
                          isAgree ? "bg-blue-500 text-white" : "text-gray-300"
                        } p-2 items-center rounded-lg`}
                        onClick={() => setIsAgree(!isAgree)}
                      >
                        <FaCheck size={20} className="hidden lg:block" />
                        <FaCheck size={16} className="block lg:hidden" />
                      </div>
                      <div className="items-center lg:text-xl flex flex-col justify-center">
                        <div>
                          <span
                            className="text-[#1a60fe] border-b-2 border-[#1a60fe] font-neoextra"
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

                  <div className="absolute bottom-0 left-0 w-full bg-[#1a60fe] text-white px-4 lg:px-8 py-8 flex flex-col lg:flex-row justify-start gap-y-3 lg:gap-x-6">
                    <h4 className="text-lg lg:text-xl font-neoheavy">
                      유의사항
                    </h4>
                    <ul className="flex flex-col justify-start gap-y-3 font-neo pl-4">
                      <li className="text-sm lg:text-lg list-disc">
                        중복 응모는 무효 처리될 수 있으며, 하나의 핸드폰 번호로
                        한 번만 참여 가능합니다.
                      </li>
                      <li className="text-sm lg:text-lg list-disc">
                        쿠폰은 영업일 기준(월~금) 2일 이내로 발송됩니다.
                      </li>
                      <li className="text-sm lg:text-lg list-disc">
                        본 이벤트는 당사 사정에 따라 예고없이 중단 또는 변경될
                        수 있습니다
                      </li>
                      <li className="text-sm lg:text-lg list-disc">
                        경품은 당사의 사정에 의해 예고 없이 변경될 수 있습니다.
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </>
          )}
        </>
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

export default Content1;
