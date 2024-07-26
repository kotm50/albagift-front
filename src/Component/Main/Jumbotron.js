import React from "react";
import { useSelector } from "react-redux";

import bg from "../../Asset/bg_gift.png";
import insta from "../../Asset/bg_insta.png";
import { Link } from "react-router-dom";
import AlertModal from "../Layout/AlertModal";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

function Jumbotron() {
  const user = useSelector(state => state.user);
  return (
    <>
      <div className="w-full bg-gradient-to-b from-teal-100 to-blue-100 pt-5 lg:pt-0 lg:px-20 jumbotron transition-all duration-200">
        <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-4">
          <div className="flex flex-col justify-center gap-3">
            <div className="text-lg lg:text-2xl font-neobold text-center lg:text-left">
              구직활동으로 포인트가 쌓이는
            </div>
            <div className="text-5xl lg:text-6xl font-neoheavy text-center lg:text-left">
              알바선물
            </div>
            <div className="text-sm lg:text-lg text-center font-neo lg:text-left">
              취업하기 어려운 요즘 시대 <br />
              당신의 구직활동을 응원하겠습니다!
            </div>

            <div className="flex flex-row justify-center lg:justify-start gap-3 my-2">
              {user.accessToken ? (
                <Link
                  to="/promo"
                  className="block bg-teal-500 hover:bg-teal-700 text-white p-2 rounded-lg text-sm lg:text-base"
                >
                  회원가입하기
                </Link>
              ) : (
                <button
                  className="block bg-teal-500 hover:bg-teal-700 text-white p-2 rounded-lg text-sm lg:text-base"
                  onClick={e => {
                    confirmAlert({
                      customUI: ({ onClose }) => {
                        return (
                          <AlertModal
                            onClose={onClose} // 닫기
                            title={"오류"} // 제목
                            message={"이미 회원가입을 하셨습니다"} // 내용
                            type={"alert"} // 타입 confirm, alert
                            yes={"확인"} // 확인버튼 제목
                          />
                        );
                      },
                    });
                    return false;
                  }}
                >
                  가입하고 1000p 받기
                </button>
              )}

              <Link
                to="/giftinfo"
                className="block border border-gray-500 hover:border-gray-700 text-gray-500 hover:text-gray-700 p-2 rounded-lg text-sm lg:text-base hover:bg-gray-300"
              >
                이용안내
              </Link>
            </div>
          </div>
          <div></div>
          <div className="py-3 px-2 lg:px-0 lg:col-span-2">
            <img src={bg} alt="알바선물" className="w-full h-auto" />
          </div>
        </div>
      </div>
      <div className="hidden w-full bg-gradient-to-r from-pink-100 to-pink-200 pt-5 lg:pt-0 lg:px-20 jumbotron transition-all duration-200">
        <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-4">
          <div className="flex flex-col justify-center gap-3">
            <div className="text-lg lg:text-2xl font-neobold text-center lg:text-left">
              다양한 정보 가장 빨리 받아보세요
            </div>
            <div className="text-5xl lg:text-6xl font-neoheavy text-center lg:text-left">
              알바선물
            </div>
            <div className="text-5xl lg:text-6xl font-neoheavy text-center lg:text-left">
              인스타그램
            </div>
            <div className="text-sm lg:text-lg text-center font-neo lg:text-left">
              취업하기 어려운 요즘 시대 <br />
              당신의 구직활동을 응원하겠습니다.
            </div>

            <div className="flex flex-row justify-center lg:justify-start gap-3 my-2 ">
              <a
                href="https://www.instagram.com/albagift.official/"
                target="_blank"
                rel="noreferrer"
                className="block bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-2 px-4 rounded-lg text-sm lg:text-base"
              >
                지금 인스타그램 방문하기
              </a>
            </div>
          </div>
          <div></div>
          <div className="py-3 px-2 lg:px-0 lg:col-span-2">
            <img src={insta} alt="알바선물 인스타" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Jumbotron;
