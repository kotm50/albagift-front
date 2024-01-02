import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyGift, getNewToken } from "../../Reducer/userSlice";

import { clearUser } from "../../Reducer/userSlice";
import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import dompurify from "dompurify";

import UserSection from "../User/UserSection";

import { RiKakaoTalkFill } from "react-icons/ri";
import RecomMall from "./RecomMall";
import AlertModal from "../Layout/AlertModal";
import { logoutAlert } from "../LogoutUtil";

// kakao 기능 동작을 위해 넣어준다.
const { Kakao } = window;

function Detail() {
  const location = useLocation();
  // 재랜더링시에 실행되게 해준다.
  useEffect(() => {
    // init 해주기 전에 clean up 을 해준다.
    Kakao.cleanup();
    // 자신의 js 키를 넣어준다.
    Kakao.init("9c2b5fe0dd73c70670ee80bef1b17937");
  }, []);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const sanitizer = dompurify.sanitize;
  let navi = useNavigate();
  const { goodscode } = useParams();
  const [goods, setGoods] = useState({});
  const [content, setContent] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isShare, setIsShare] = useState(false);
  useEffect(() => {
    getGoods();
    //eslint-disable-next-line
  }, [location]);

  const getGoods = async () => {
    setImgLoaded(false);
    await axios
      .get(`/api/v1/shop/goods/detail/${goodscode}`)
      .then(async res => {
        if (res.headers.authorization) {
          await dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        setGoods(res.data.goods);
        contentForm(res.data.goods.content);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const contentForm = c => {
    const regexLink =
      /(^|[^\w/])(https?:\/\/[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
    const regexParentheses = /([({[])(.*?)([)}\]])/g;

    let contentText = c;

    // Process parentheses first
    contentText = contentText.replace(
      regexParentheses,
      (match, open, content, close) => {
        return `${open} ${content} ${close}`;
      }
    );

    let contentWB = contentText.replace(/(?:\r\n|\r|\n)/g, " <br />");

    // Replace links
    let replacedText = contentWB.replace(
      regexLink,
      '<a href="$2" rel="noopener noreferrer" class="text-indigo-500 hover:cursor-pointer hover:text-indigo-700 hover:border-b-2 border-indigo-700">$2</a>'
    );

    setContent(replacedText);
  };

  const loginAlert = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"구매 오류"} // 제목
            message={"상품을 구매하려면 로그인 해주세요"} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"로그인 하기"} // 확인버튼 제목
            doIt={goLogin} // 확인시 실행할 함수
          />
        );
      },
    });
  };
  const goLogin = () => {
    navi("/login");
  };

  const buyIt = async () => {
    if (user.accessToken === "") {
      loginAlert();
      return false;
    }

    let buy = Number(user.point) - Number(goods.realPrice);
    if (buy < 0) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"구매 오류"} // 제목
              message={"포인트가 부족합니다"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      return false;
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"기프티콘을 구매하시겠습니까?"} // 제목
            message={`${goods.realPrice}포인트가 차감됩니다`} // 내용
            type={"confirm"} // 타입 confirm, alert
            yes={"네"} // 확인버튼 제목
            no={"아니요"} // 취소버튼 제목
            doIt={doBuy} // 확인시 실행할 함수
            doNot={doNotBuy} // 취소시 실행할 함수
          />
        );
      },
    });
  };

  const doBuy = async () => {
    const currentDomain = window.location.href;
    let data = {
      goodsCode: goodscode,
    };
    let url = "/api/v1/shop/goods/send";
    const isLocalhost = currentDomain.includes("albagift");
    if (!isLocalhost) {
      url = "/api/v1/shop/local/goods/send";
    }
    await axios
      .post(url, data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.headers.authorization) {
          await dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        if (res.data.code === "E999") {
          logoutAlert(null, null, dispatch, clearUser, navi, user);
          setGoods("");
          return false;
        }
        if (res.data.code === "C000") {
          dispatch(
            buyGift({
              point: res.data.point,
            })
          );
          goResult();
        } else {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"구매 실패"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          return false;
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  const doNotBuy = () => {
    return false;
  };
  const goResult = () => {
    navi(`/result`);
  };

  const shareKakao = () => {
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: goods.goodsName,
        description: goods.srchKeyword,
        imageUrl: goods.goodsImgS,
        link: {
          mobileWebUrl: `https://albagift.shop/detail/${goods.goodsCode}`,
          webUrl: `https://albagift.shop/detail/${goods.goodsCode}`,
        },
      },
      buttons: [
        {
          title: "상품보러가기",
          link: {
            mobileWebUrl: `https://albagift.shop/detail/${goods.goodsCode}`,
            webUrl: `https://albagift.shop/detail/${goods.goodsCode}`,
          },
        },
      ],
    });
  };
  return (
    <>
      {goods !== "" ? (
        <Helmet>
          <title>{`${goods.goodsName} - ${goods.brandName} | 알바선물`}</title>
          <meta
            name="description"
            content={`${goods.goodsName} - ${goods.brandName}  | 알바선물`}
          />
          <meta property="og:image" content={goods.goodsImgB} />
        </Helmet>
      ) : (
        <Helmet>
          <title>{"상세페이지 | 알바선물"}</title>
          <meta name="description" content="상세페이지  | 알바선물" />
        </Helmet>
      )}
      <div className="lg:container mx-auto">
        <UserSection />
        {goods !== undefined && (
          <img
            src={goods.goodsImgB}
            alt={goods.goodsName}
            className="fixed top-0 left-0 w-0 h-0 opacity-0"
            onLoad={e => setImgLoaded(true)}
          />
        )}

        {imgLoaded ? (
          <>
            <div className="lg:container w-11/12 mx-auto bg-white p-2 flex flex-col lg:flex-row lg:justify-center gap-3">
              <div className="lg:basis-4/12 p-1">
                <img
                  src={goods.goodsImgB}
                  alt={goods.goodsName}
                  className="border bg-gray-100 mx-auto w-3/4"
                />
              </div>
              <div className="lg:basis-6/12 p-1 flex flex-col justify-start">
                <div className="lg:text-lg">{goods.brandName}</div>
                <h2 className="text-lg lg:text-2xl font-bold">
                  {goods.goodsName}
                </h2>
                <div className="mt-5">
                  <span className="text-2xl lg:text-4xl font-bold text-indigo-500">
                    {Number(goods.realPrice).toLocaleString()}
                  </span>
                  <span className="text-xl lg:text-2xl ml-1">Point</span>
                </div>
                <div className="mt-5 flex flex-row gap-3">
                  <span className="lg:text-lg font-bold basis-1/4 lg:basis-1/6">
                    교환처
                  </span>
                  <span className="lg:text-lg basis-3/4 lg:basis-5/6">
                    {goods.affiliate}
                  </span>
                </div>
                <div className="mt-5 flex flex-row gap-3">
                  <span className="lg:text-lg font-bold basis-1/4 lg:basis-1/6">
                    유효기간
                  </span>
                  <span className="lg:text-lg basis-3/4 lg:basis-5/6">
                    {goods.limitDay}일/유효기간 만료 후 연장 및 환불 불가
                  </span>
                </div>
                <div className="mt-5 flex flex-row gap-3">
                  <span className="lg:text-lg font-bold basis-1/4 lg:basis-1/6">
                    구매방식
                  </span>
                  <span className="lg:text-lg basis-3/4 lg:basis-5/6">
                    모바일 쿠폰 발송
                  </span>
                </div>
                <div className="mt-5 flex flex-col lg:flex-row justify-start gap-3 relative">
                  <div className="grid grid-cols-3 gap-2 lg:w-2/3">
                    <button
                      className="col-span-2 block text-center w-full transition-all duration-150 ease-in-out bg-indigo-500 text-white py-2 px-5 rounded hover:bg-indigo-700"
                      onClick={buyIt}
                    >
                      포인트로 구입하기
                    </button>
                    <button
                      className="block text-center w-full transition-all duration-150 ease-in-out bg-yellow-300  py-2 px-5 rounded hover:bg-yellow-500"
                      onClick={e => {
                        setIsShare(!isShare);
                      }}
                    >
                      공유<span className="hidden lg:inline">하기</span>
                    </button>
                  </div>
                  {isShare && (
                    <div className="absolute top-12 right-0 lg:right-1/3 min-w-1/2 py-3 px-2 border shadow-md bg-white z-10">
                      <h3 className="text-center mb-3 text-sm p-2 bg-gray-200 rounded">
                        공유하기
                      </h3>
                      <div className="flex flex-row justify-center gap-2">
                        <div className="text-center grid grid-cols-1 gap-y-2">
                          <button
                            className="block w-14 h-14 rounded-full kakaobtn p-2"
                            onClick={e => shareKakao()}
                          >
                            <RiKakaoTalkFill size={32} className="mx-auto" />
                          </button>
                          <span className="text-center text-xs">카카오톡</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:container w-11/12 mx-auto bg-white mt-3 p-2">
              <h3 className="lg:pl-32 p-3 lg:text-2xl font-bold mb-3 pb-3 border-y">
                상품 상세정보 및 유의사항
              </h3>
              <div
                className="lg:w-5/6 mx-auto leading-7"
                dangerouslySetInnerHTML={{
                  __html: sanitizer(content).replace(
                    /href/g,
                    "target='_blank' href"
                  ),
                }}
              />
            </div>
            <RecomMall category={goods.category1Seq} />
          </>
        ) : (
          <>
            <div className="lg:container w-11/12 mx-auto bg-white p-2 flex flex-col lg:grid lg:grid-cols-12 gap-3">
              <div className="hidden lg:block col-span-2"></div>
              <div className="lg:col-span-4 p-1 w-96 h-96 animate-pulse bg-slate-200"></div>
              <div className="lg:col-span-4 p-1 flex flex-col justify-start">
                <div className="lg:text-lg bg-slate-200 animate-pulse h-10"></div>
                <div className="text-lg lg:text-2xl font-bold bg-slate-200 animate-pulse h-10"></div>
                <div className="mt-5 bg-slate-200 animate-pulse h-10"></div>
                <div className="mt-5 bg-slate-200 animate-pulse h-10"></div>
                <div className="mt-5 bg-slate-200 animate-pulse h-10"></div>
                <div className="mt-5 bg-slate-200 animate-pulse h-10"></div>
              </div>
              <div className="hidden lg:block col-span-2"></div>
              <div className="lg:container w-11/12 mx-auto bg-slate-200 animate-pulse h-10 mt-3 p-2 col-span-12"></div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Detail;
