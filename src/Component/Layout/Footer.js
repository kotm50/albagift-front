import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { RiCustomerService2Fill } from "react-icons/ri";

import logo from "../../Asset/albaseonmul_mono.svg";
import homepage from "../../Asset/sns/homepage.png";
import facebook from "../../Asset/sns/facebook.png";
import instagram from "../../Asset/sns/instagram.png";
import kakaotalk from "../../Asset/sns/kakaotalk.png";

import Modal from "../doc/Modal";
import First from "../Main/First";

function Footer(props) {
  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPromo, setIsPromo] = useState(true);
  const [isEmploy, setIsEmploy] = useState(false);
  const thisLocation = useLocation();
  useEffect(() => {
    if (modalOn) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // eslint-disable-next-line
  }, [thisLocation, modalOn]);

  useEffect(() => {
    const parts = thisLocation.pathname.split("/");
    parts[1] === "sns" ? setIsPromo(true) : setIsPromo(false);
    // eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    setIsAdmin(/^\/admin(\/|$)/.test(thisLocation.pathname));
  }, [thisLocation]);

  useEffect(() => {
    const parts = thisLocation.pathname.split("/");

    parts[1] === "employ"
      ? setIsEmploy(true)
      : parts[1] === "renew"
      ? setIsPromo(true)
      : setIsEmploy(false);
    // eslint-disable-next-line
  }, [thisLocation]);

  return (
    <>
      {!isPromo ? (
        <>
          {!isEmploy ? <div className="container mx-auto h-10"></div> : null}

          <>
            {!isAdmin ? <First /> : null}
            <div className="bg-gray-200 py-2 border-y border-gray-300 w-full">
              <div className="lg:container mx-auto">
                <div className="flex justify-around text-sm">
                  <div
                    className="text-center hover:cursor-pointer hover:text-rose-500"
                    onClick={e => {
                      setModalCount(1);
                      setModalOn(true);
                    }}
                  >
                    개인정보처리방침1
                  </div>
                  <div
                    className="text-center hover:cursor-pointer hover:text-rose-500"
                    onClick={e => {
                      setModalCount(2);
                      setModalOn(true);
                    }}
                  >
                    이용약관
                  </div>
                  <div
                    className="text-center hover:cursor-pointer hover:text-rose-500"
                    onClick={e => {
                      setModalCount(3);
                      setModalOn(true);
                    }}
                  >
                    e메일 무단수집거부
                  </div>
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
              className={`bg-gray-200 w-full mb-3 md:mb-0 ${
                props.isMobile && "pb-20"
              }`}
            >
              <div className="lg:container mx-auto footer-top">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 py-2">
                  <div className="flex flex-col justify-center lg:my-auto mt-10">
                    <h1 className="w-1/2 mx-auto mb-5 lg:mb-0">
                      <Link to="/">
                        <img
                          src={logo}
                          className="logoImg mx-auto h-16"
                          alt="logo"
                        />
                      </Link>
                    </h1>
                  </div>
                  <div className="flex flex-col justify-start gap-1 text-gray-700 pl-2 lg:pl-0 text-sm my-10">
                    <div className="text-left font-neoextra">
                      코리아밸리 유한회사
                    </div>
                    <div className="text-left font-neo">
                      개인정보보호책임자 : 이건영
                    </div>
                    <div className="text-left font-neo">
                      경기도 남양주시 별내중앙로 26,10층
                      1002-에이74호(별내동,진영엔타워)
                    </div>
                    <div className="text-left font-neo">
                      사업자등록번호: 227-87-02579
                    </div>
                    <div className="text-left font-neo">
                      Copyright ⓒ Albagift.com All rights reserved
                    </div>
                  </div>
                  <div className="flex flex-col justify-start gap-1 text-gray-700 pl-2 lg:pl-0 text-sm my-10">
                    <div className="text-left font-neoextra">문의전화</div>
                    <div className="text-2xl flex flex-row flex-nowrap gap-2">
                      <RiCustomerService2Fill size={32} />
                      <span className="text-indigo-500 font-neoextra">
                        1644-4223
                      </span>
                    </div>
                    <div className="font-neo text-sm">
                      영업시간 : 09:00 ~ 18:00
                    </div>
                    <div className="font-neo text-sm">
                      점심시간 : 12:00 ~ 13:00
                    </div>
                  </div>
                  <div className="hidden flex-col justify-center gap-1 text-gray-700 pl-2 lg:pl-0">
                    <div className="text-left pb-2 mb-2">
                      코리아밸리의 다양한 소식들을 만나보세요!
                    </div>
                    <div className="flex justify-start gap-2 mb-5 lg:mb-0">
                      <a
                        href="http://코리아밸리.kr"
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
              </div>
            </footer>
          </>
        </>
      ) : null}
    </>
  );
}

export default Footer;
