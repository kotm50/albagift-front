import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { RiCustomerService2Fill } from "react-icons/ri";

import logo from "../../Asset/albaseonmul_mono.svg";
import homepage from "../../Asset/sns/homepage.png";
import facebook from "../../Asset/sns/facebook.png";
import instagram from "../../Asset/sns/instagram.png";
import kakaotalk from "../../Asset/sns/kakaotalk.png";

import Modal from "../doc/Modal";
import { path } from "../../path/path";

function Footer() {
  const [footless, setFootless] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);
  const thisLocation = useLocation();
  useEffect(() => {
    setFootless(path.some(chkBg));
    // eslint-disable-next-line
  }, [thisLocation]);

  const chkBg = (element, index, array) => {
    return thisLocation.pathname.startsWith(element);
  };
  useEffect(() => {
    if (modalOn) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // eslint-disable-next-line
  }, [thisLocation, modalOn]);

  return (
    <>
      {!footless && (
        <>
          <div className="bg-white py-2 border-y border-gray-300 w-full lg:container mx-auto">
            <div className="flex justify-around text-sm">
              <div
                className="text-center hover:cursor-pointer"
                onClick={e => {
                  setModalCount(1);
                  setModalOn(true);
                }}
              >
                개인정보처리방침
              </div>
              <div
                className="text-center hover:cursor-pointer"
                onClick={e => {
                  setModalCount(2);
                  setModalOn(true);
                }}
              >
                이용약관
              </div>
              <div
                className="text-center hover:cursor-pointer"
                onClick={e => {
                  setModalCount(3);
                  setModalOn(true);
                }}
              >
                e메일 무단수집거부
              </div>
            </div>
          </div>
          {modalOn ? (
            <Modal
              modalCount={modalCount}
              setModalOn={setModalOn}
              setModalCount={setModalCount}
            />
          ) : null}
          <footer
            id="footer"
            className="bg-white w-full lg:container mx-auto mb-3 xl:mb-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 py-2">
              <div className="flex flex-col justify-center my-auto">
                <h1 className="w-1/2 mx-auto mb-5 lg:mb-0">
                  <Link to="/">
                    <img src={logo} className="logoImg mx-auto" alt="logo" />
                  </Link>
                </h1>
                <div className="text-gray-500 font-bold w-1/2 mx-auto">
                  <Link to="/">
                    <span className="text-gray-400">No.1</span> 채용포털
                    코리아티엠
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-start gap-1 text-gray-500 pl-2 xl:pl-0">
                <div className="text-left font-bold">주식회사 코리아티엠</div>
                <div className="text-left">서울 중구 다산로 153 코리아티엠</div>
                <div className="text-left">사업자등록번호: 789-81-02395</div>
              </div>
              <div className="flex flex-col justify-start gap-1 text-gray-500 pl-2 xl:pl-0">
                <div className="text-left font-bold">취업상담 / 채용문의 </div>
                <div className="text-2xl flex flex-row flex-nowrap gap-2">
                  <RiCustomerService2Fill size={32} />
                  <span className="text-indigo-500 font-bold">1644-4223</span>
                </div>
                <div className="font-normal text-sm">
                  영업시간 : 09:00 ~ 18:00
                </div>
                <div className="font-normal text-sm">
                  점심시간 : 12:00 ~ 13:00
                </div>
              </div>
              <div className="flex flex-col justify-center gap-1 text-gray-500 pl-2 xl:pl-0">
                <div className="text-left pb-2 mb-2">
                  코리아티엠의 다양한 소식들을 만나보세요!
                </div>
                <div className="flex justify-start gap-2   mb-5 lg:mb-0">
                  <a
                    href="http://코리아티엠.kr"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={homepage} alt="홈페이지" />
                  </a>
                  <a
                    href="//pf.kakao.com/_Jdxexcb"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={kakaotalk} alt="카톡채널" />
                  </a>
                  <a
                    href="//www.facebook.com/KoTI.recruit"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={facebook} alt="페이스북" />
                  </a>
                  <a
                    href="//www.instagram.com/koti.recruit/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={instagram} alt="인스타그램" />
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center py-1 text-sm bg-gray-500 text-white">
              Copyright ⓒ Korea<i className="font-bold">TM</i>. All rights
              reserved
            </div>
          </footer>
        </>
      )}
    </>
  );
}

export default Footer;
