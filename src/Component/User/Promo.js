import React, { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import AOS from "aos";
import "aos/dist/aos.css";
import "./Promo.css";

import { BsChevronDoubleDown } from "react-icons/bs";
import { FaHouseUser } from "react-icons/fa";

import title1 from "../../Asset/Promo/title_1.png";
import title2 from "../../Asset/Promo/title_2.png";
import title1m from "../../Asset/Promo/title_1_m.png";
import title2m from "../../Asset/Promo/title_2_m.png";
import title3m from "../../Asset/Promo/title_3_m.png";

import starbucks from "../../Asset/Promo/starbucks.png";
import chicken from "../../Asset/Promo/chicken.png";
import lotte from "../../Asset/Promo/lotte.png";
import happycon from "../../Asset/Promo/happycon.png";
import br from "../../Asset/Promo/br.png";
//import coupon from "../../Asset/Promo/1000p.png";
import couponM from "../../Asset/Promo/1000pM.png";

import explain1 from "../../Asset/Promo/explain1.png";
import explain2 from "../../Asset/Promo/explain2.png";
import explain3 from "../../Asset/Promo/explain3.png";
import explain4 from "../../Asset/Promo/explain4.png";

import Recommend from "../Main/Recommend";

function Promo() {
  const { id } = useParams();
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  useEffect(() => {
    AOS.init();
    if (user.accessToken !== "") {
      alert("이미 가입하셨습니다.\n메인으로 이동합니다");
      navi("/");
    }
  });
  return (
    <>
      <div
        id="promo_1"
        className="relative w-full min-h-screen bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden"
      >
        <div className="absolute hidden lg:block top-5 w-fit left-1/2 -translate-x-1/2 z-20">
          <img src={title1} alt="면접만 봐도" data-aos="fade-up" />
          <img src={title2} alt="100% 선물증정" data-aos="fade-up" />
        </div>
        <div className="absolute block lg:hidden top-12 w-10/12 px-2 left-1/2 -translate-x-1/2 z-20">
          <img src={title1m} alt="면접만 봐도" data-aos="fade-up" />
          <img src={title2m} alt="100%" data-aos="fade-up" />
          <img src={title3m} alt="선물증정" data-aos="fade-up" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center w-fit h-fit rounded-xl border-x-2 border-white px-3 z-40">
          <span className="font-bold text-sm">SCROLL</span>
          <BsChevronDoubleDown
            className="mx-auto animate-bounce mt-3"
            size={32}
          />
        </div>
        <div className="w-full lg:w-fit h-fit left-1/2 -translate-x-1/2 text-center z-20 promoStarbucks">
          <img src={starbucks} alt="스타벅스" />
        </div>
        <img src={chicken} alt="교촌치킨" className="z-20 promoChicken img" />
        <img
          src={happycon}
          alt="해피콘 금액권"
          className="z-20 promoHappycon img"
        />
        <img src={lotte} alt="롯데리아" className="z-20 promoLotte img" />

        <img src={br} alt="배스킨라빈스" className="z-20 promoBr img" />
        <div className="absolute hidden lg:block -bottom-1/2 lg:-bottom-36 whiteCircle bg-white rounded-full z-0"></div>
        <div className="absolute lg:hidden bottom-0 w-full h-32 bg-white rounded-t-full z-0"></div>
      </div>
      <div id="promo_2" className="bg-gray-700 p-2">
        <div className="hidden container mx-auto lg:grid grid-cols-2 py-10">
          <div className="flex flex-col justify-center h-full gap-5">
            <div
              className="text-5xl font-normal text-white text-right"
              data-aos="fade-up"
            >
              면접만 봐도 쌓이는 포인트로
            </div>
            <div
              className="text-5xl font-neoextra text-white text-right"
              data-aos="fade-up"
            >
              <span className="font-bold text-green">알바선물</span> 면접몰에서
            </div>
            <div
              className="text-5xl font-normal text-white text-right"
              data-aos="fade-up"
            >
              다양한 상품을 구매하세요
            </div>
          </div>
          <div className="flex flex-col justify-center h-full">
            <div className="bg-white w-96 h-96 max-w-full rounded-full mx-auto translate-x-1/6 flex flex-col justify-start">
              <img
                src={couponM}
                alt=""
                className="img max-w-full -translate-x-3"
                data-aos="fade-up"
              />
              <div className="w-full text-center text-xl font-neoextra">
                가입시 <span className="text-rose-500 font-bold">1000p</span>{" "}
                지급!
              </div>
              <div className="w-full mt-2">
                <button
                  className="block py-2 mx-auto bg-indigo-500 text-white hover:animate-bounce rounded-full px-4"
                  onClick={e =>
                    navi("/cert", {
                      state: {
                        promo: id ? id : null,
                      },
                    })
                  }
                >
                  가입하기
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden container mx-auto grid grid-cols-1 py-10">
          <div className="flex flex-col justify-center h-full gap-2 mb-2">
            <div
              className="text-2xl font-normal text-white text-center"
              data-aos="fade-up"
            >
              면접만 봐도 쌓이는 포인트로
            </div>
            <div
              className="text-2xl font-neoextra text-white text-center"
              data-aos="fade-up"
            >
              <span className="font-bold text-green">알바선물</span> 면접샵에서
            </div>
            <div
              className="text-2xl font-normal text-white text-center"
              data-aos="fade-up"
            >
              다양한 상품을 구매하세요
            </div>
          </div>
          <div className="flex flex-col justify-center h-full">
            <img src={couponM} alt="" className="img" data-aos="fade-up" />
            <div className="bg-white p-2 mt-2 rounded">
              <div className="w-full text-center text-xl font-neoextra bg-white p-2">
                가입시 <span className="text-rose-500 font-bold">1000p</span>{" "}
                무료지급!
              </div>
              <div className="w-full my-2">
                <button
                  className="block py-2 mx-auto bg-indigo-500 text-white hover:animate-bounce rounded-full px-4"
                  onClick={e => navi("/cert")}
                >
                  가입하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="promo_3" className="bg-gray-700 p-2">
        <div className="w-11/12 lg:container mx-auto p-2 rounded-full text-center text-white text-xl lg:text-3xl font-neoextra bg-gradient-to-r from-blue-500 to-blue-600">
          면접샵 이용방법
        </div>
        <div className="w-11/12 container mx-auto grid grid-cols-1 lg:grid-cols-4 mb-10 lg:mb-16 mt-5 gap-2">
          <div
            className="bg-white drop-shadow-lg p-2 rounded"
            data-aos="flip-down"
            data-aos-duration="300"
          >
            <div className="text-base lg:text-xl">
              1. 로그인 후 프로필 입력(1회 한정)
            </div>
            <div className="w-full p-1 bg-indigo-50 my-2">
              <img src={explain1} alt="1번 설명" className="w-full" />
            </div>
            <div className="text-sm lg:text-base">
              이미 입력하셨다면 다시 입력하지 않으셔도 됩니다
            </div>
          </div>
          <div
            className="bg-white drop-shadow-lg p-2 rounded"
            data-aos="flip-down"
            data-aos-duration="300"
          >
            <div className="text-base lg:text-xl">
              2. 구직활동을 통해 포인트 적립
            </div>
            <div className="w-full p-1 bg-indigo-50 my-2">
              <img src={explain2} alt="2번 설명" className="w-full" />
            </div>
            <div className="text-sm lg:text-base">
              적립되는 포인트는 제휴사별로 다를 수 있습니다.
            </div>
          </div>
          <div
            className="bg-white drop-shadow-lg p-2 rounded"
            data-aos="flip-down"
            data-aos-duration="300"
          >
            <div className="text-base lg:text-xl">
              3. 포인트를 이용해 원하는 상품 구매
            </div>
            <div className="w-full p-1 bg-indigo-50 my-2">
              <img src={explain3} alt="3번 설명" className="w-full" />
            </div>
            <div className="text-sm lg:text-base">
              상품은 기프티콘 형태로 제공됩니다.
            </div>
          </div>
          <div
            className="bg-white drop-shadow-lg p-2 rounded"
            data-aos="flip-down"
            data-aos-duration="300"
          >
            <div className="text-base lg:text-xl">
              4. 구매한 기프티콘을 매장에서 사용
            </div>
            <div className="w-full p-1 bg-indigo-50 my-2">
              <img src={explain4} alt="4번 설명" className="w-full" />
            </div>
            <div className="text-sm lg:text-base">
              쿠폰함에서 쿠폰을 바로 사용할 수 있습니다
            </div>
          </div>
        </div>
      </div>
      <div
        id="promo_4"
        className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-2"
      >
        <div className="container mx-auto lg:grid grid-cols-1 py-5">
          <div className="text-2xl lg:text-3xl text-center text-white mb-2">
            포인트를 모아 <br className="block lg:hidden" />
            아래의 상품들을 받아보세요
          </div>
        </div>
      </div>
      <Recommend category={1} />
      <div id="promo_5" className="bg-gray-700 p-2">
        <div className="py-20 container mx-auto w-full  flex-col justify-start gap-y-4 hidden lg:flex font-neolight">
          <div className="font-neoheavy lg:text-3xl text-white">유의사항</div>
          <div className="text-white lg:text-2xl">
            본 이벤트는 당사 사정에 따라 예고없이 중단 또는 변경될 수 있습니다
          </div>
          <div className="text-white lg:text-2xl">
            경품은 당사의 사정에 의해 예고없이 변경될 수 있습니다
          </div>
          <div className="text-white lg:text-2xl">
            포인트는 알바선물 내에서만 사용할 수 있습니다
          </div>
          <div className="text-white lg:text-2xl">
            회원가입 후 마케팅 수신동의 이벤트에 참여하시면 포인트가 지급됩니다.
          </div>
          <div className="text-white lg:text-2xl">
            본 행사는 일부 행사와 중복 적용이 불가능합니다
          </div>
        </div>
        <div className="py-10 px-4 container mx-auto w-full  flex flex-col justify-start gap-y-4 lg:hidden font-neolight">
          <div className="font-neoheavy lg:text-3xl text-white">유의사항</div>
          <div className="text-white lg:text-2xl">
            본 이벤트는 당사 사정에 따라 예고없이 중단 또는 변경될 수 있습니다
          </div>
          <div className="text-white lg:text-2xl">
            경품은 당사의 사정에 의해 예고없이 변경될 수 있습니다
          </div>
          <div className="text-white lg:text-2xl">
            포인트는 알바선물 내에서만 사용할 수 있습니다
          </div>
          <div className="text-white lg:text-2xl">
            회원가입 후 마케팅 수신동의 이벤트에 참여하시면 포인트가 지급됩니다.
          </div>
          <div className="text-white lg:text-2xl">
            본 행사는 일부 행사와 중복 적용이 불가능합니다
          </div>
        </div>
      </div>
      <div className="fixed top-0 right-1 lg:right-20 z-40 min-w-fit min-h-fit p-2 bg-black text-white rounded-b-lg drop-shadow-md text-lg font-neoextra">
        <Link to="/">
          <FaHouseUser size={28} className="inline-block mr-3" />
          메인으로 이동
        </Link>
      </div>
    </>
  );
}

export default Promo;
