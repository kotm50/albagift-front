import React, { useState } from "react";

import chromeImg from "../../Asset/loginerr/chrome.png";
import samsungImg from "../../Asset/loginerr/samsung.png";

function Error() {
  const [infoImg, setInfoImg] = useState(0);

  return (
    <div className="container mx-auto p-4 pb-0">
      <h2 className="font-neoextra font-lg text-3xl mb-5">
        로그인 오류에 대한 안내
      </h2>
      <p className="font-neo mb-5">
        안녕하세요 알바선물입니다.
        <br />
        <br />
        최근 일부 디바이스에서 로그인이 되지 않는 현상이 발견되고 있습니다
        <br />
        번거로우시겠지만, 아래의 안내에 따라서 브라우저 캐시를 초기화 하시고
        <br />
        디바이스를 재부팅한 후 다시 로그인을 시도해주시길 부탁드립니다
      </p>
      <hr className="mb-5" />
      <div className="flex flex-col justify-start gap-y-4 font-neo mb-5">
        <div>해당하는 브라우저를 선택하세요</div>
        <div className="font-neoextra">
          <button
            className="bg-blue-500 p-2 hover:bg-orange-500 text-white rounded-lg"
            onClick={() => {
              if (infoImg !== 3) {
                setInfoImg(3);
              } else {
                setInfoImg(0);
              }
            }}
          >
            [PC, 노트북, 맥북 사용시] {infoImg === 3 ? "닫기▲" : "열기▼"}
          </button>
          {infoImg === 3 && (
            <p className="font-neo leading-10">
              <span className="font-neoextra">윈도우 PC의 경우</span> :
              <span className="font-neoextra text-blue-500 block lg:inline">
                ctrl+F5키
              </span>
              를 누르면 캐시 초기화 후 새로고침 됩니다.
              <br />
              <span className="font-neoextra">
                애플 PC(맥북, imac)의 경우
              </span>{" "}
              :
              <span className="font-neoextra text-blue-500 block lg:inline">
                shift+command+R키
              </span>
              를 누르면 캐시 초기화 후 새로고침 됩니다.
            </p>
          )}
        </div>
        <div className="font-neoextra">
          <button
            className="bg-blue-500 p-2 hover:bg-orange-500 text-white rounded-lg"
            onClick={() => {
              if (infoImg !== 1) {
                setInfoImg(1);
              } else {
                setInfoImg(0);
              }
            }}
          >
            [모바일 크롬 브라우저] {infoImg === 1 ? "닫기▲" : "열기▼"}
          </button>
          {infoImg === 1 && (
            <img
              src={chromeImg}
              className="w-auto max-w-full"
              alt="모바일 크롬 이용시"
            />
          )}
        </div>
        <div className="font-neoextra">
          <button
            className="bg-blue-500 p-2  hover:bg-orange-500 text-white rounded-lg"
            onClick={() => {
              if (infoImg !== 2) {
                setInfoImg(2);
              } else {
                setInfoImg(0);
              }
            }}
          >
            [삼성 인터넷 브라우저] {infoImg === 2 ? "닫기▲" : "열기▼"}
          </button>
          {infoImg === 2 && (
            <img
              src={samsungImg}
              className="w-auto max-w-full"
              alt="모바일 크롬 이용시"
            />
          )}
        </div>
      </div>
      <hr className="mb-5" />
      <p className="font-neo">
        위 브라우저 목록에 해당되지 않거나, 캐시 초기화 이후에도 문제가
        발생하시는 경우 <br className="hidden lg:block" />
        디바이스 종류와 아이디를 이메일 :{" "}
        <a
          href="mailto:koreatm50@gmail.com"
          className="text-blue-500 border-b border-blue-500 font-neobold hover:text-orange-500 hover:border-orange-500"
        >
          koreatm50@gmail.com
        </a>{" "}
        로 보내주시면 <br className="hidden lg:block" />
        확인 후 신속하게 안내해드리겠습니다
      </p>
    </div>
  );
}

export default Error;
