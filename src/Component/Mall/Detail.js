import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { buyGift } from "../../Reducer/userSlice";

import axios from "axios";

import dompurify from "dompurify";

function Detail() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const sanitizer = dompurify.sanitize;
  let navi = useNavigate();
  const { goodscode } = useParams();
  const [goods, setGoods] = useState("");
  const [content, setContent] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    getGoods();
    //eslint-disable-next-line
  }, []);

  const getGoods = async () => {
    await axios
      .get(`/api/v1/shop/goods/detail/${goodscode}`, {
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
        setGoods(res.data.goods);
        contentForm(res.data.goods.content);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const contentForm = c => {
    const regex = // eslint-disable-next-line
      /(^|[^\w\/])(https?:\/\/[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
    let contentText = c;
    let contentWB = contentText.replace(/(?:\r\n|\r|\n)/g, " <br />");
    let replacedText = contentWB.replace(
      regex,
      '<a href="$2" rel="noopener noreferrer" class="text-indigo-500 hover:cursor-pointer hover:underline-offset-2">$2</a>'
    );
    setContent(replacedText);
  };

  const buyIt = async () => {
    let data = {
      goodsCode: goodscode,
    };
    let buy = Number(user.point) - Number(goods.realPrice);
    await axios
      .post("/api/v1/shop/goods/send", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          alert("구매 완료!");
          dispatch(
            buyGift({
              point: buy,
            })
          );
          navi(`/result`);
        } else {
          alert(res.data.message);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
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
          <div className="xl:container w-11/12 mx-auto bg-white p-2 flex flex-col xl:flex-row xl:justify-center gap-3">
            <div className="xl:basis-4/12 p-1">
              <img
                src={goods.goodsImgB}
                alt={goods.goodsName}
                className="border bg-gray-100 mx-auto w-3/4"
              />
            </div>
            <div className="xl:basis-6/12 p-1 flex flex-col justify-start">
              <div className="xl:text-lg">{goods.brandName}</div>
              <h2 className="text-lg xl:text-2xl font-bold">
                {goods.goodsName}
              </h2>
              <div className="mt-5">
                <span className="text-2xl xl:text-4xl font-bold text-indigo-500">
                  {goods.realPrice}
                </span>
                <span className="text-xl xl:text-2xl ml-1">Point</span>
              </div>
              <div className="mt-5 ">
                <span className="xl:text-lg font-bold basis-1/4 xl:basis-1/6">
                  교환처
                </span>
                <span className="xl:text-lg basis-3/4 xl:basis-5/6">
                  {goods.affiliate}
                </span>
              </div>
              <div className="mt-5 ">
                <span className="xl:text-lg font-bold basis-1/4 xl:basis-1/6">
                  유효기간
                </span>
                <span className="xl:text-lg basis-3/4 xl:basis-5/6">
                  {goods.limitDay}일/유효기간 만료 후 연장 및 환불 불가
                </span>
              </div>
              <div className="mt-5 ">
                <span className="xl:text-lg font-bold basis-1/4 xl:basis-1/6">
                  구매방식
                </span>
                <span className="xl:text-lg basis-3/4 xl:basis-5/6">
                  모바일 쿠폰 발송
                </span>
              </div>
              <div className="mt-5 flex flex-col lg:flex-row justify-start gap-3">
                <button
                  className="block text-center w-full lg:w-1/2 transition-all duration-150 ease-in-out bg-indigo-500 text-white py-2 px-5 rounded hover:bg-indigo-700 font-medium"
                  onClick={buyIt}
                >
                  포인트로 구입하기
                </button>
              </div>
            </div>
          </div>
          <div className="xl:container w-11/12 mx-auto bg-white mt-3 p-2">
            <h3 className="xl:pl-32 p-3 xl:text-2xl font-bold mb-3 pb-3 border-y">
              상품 상세정보 및 유의사항
            </h3>
            <div
              className="xl:w-5/6 mx-auto"
              dangerouslySetInnerHTML={{
                __html: sanitizer(content).replace(
                  /href/g,
                  "target='_blank' href"
                ),
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="xl:container w-11/12 mx-auto bg-white p-2 flex flex-col xl:grid xl:grid-cols-12 gap-3">
            <div className="hidden xl:block col-span-2"></div>
            <div className="xl:col-span-4 p-1 w-96 h-96 animate-pulse bg-slate-200"></div>
            <div className="xl:col-span-4 p-1 flex flex-col justify-start">
              <div className="xl:text-lg bg-slate-200 animate-pulse h-10"></div>
              <div className="text-lg xl:text-2xl font-bold bg-slate-200 animate-pulse h-10"></div>
              <div className="mt-5 bg-slate-200 animate-pulse h-10"></div>
              <div className="mt-5 bg-slate-200 animate-pulse h-10"></div>
              <div className="mt-5 bg-slate-200 animate-pulse h-10"></div>
              <div className="mt-5 bg-slate-200 animate-pulse h-10"></div>
            </div>
            <div className="hidden xl:block col-span-2"></div>
            <div className="xl:container w-11/12 mx-auto bg-slate-200 animate-pulse h-10 mt-3 p-2 col-span-12"></div>
          </div>
        </>
      )}
    </>
  );
}

export default Detail;
