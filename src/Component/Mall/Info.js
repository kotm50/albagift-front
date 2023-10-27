import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import bgpc from "../../Asset/bg_sub.png";
import bgmo from "../../Asset/bg_int.png";
import step1 from "../../Asset/Info/step-1.png";
import step21 from "../../Asset/Info/step-2-1.png";
import step22 from "../../Asset/Info/step-2-2.png";
import step3 from "../../Asset/Info/step-3.png";
import step4 from "../../Asset/Info/step-4.png";
import step5 from "../../Asset/Info/step-5.png";
import step6 from "../../Asset/Info/step-6.png";
import step7 from "../../Asset/Info/step-7.png";

function Info() {
  const user = useSelector(state => state.user);
  const [process, setProcess] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const process1 = [
    { id: 1, title: "제휴기업에 구직활동을 한다", img: step1 },
    { id: 2, title: "알바선물에 회원가입을 한다", img: step21 },
    { id: 3, title: "프로필을 작성한다", img: step3 },
    { id: 4, title: "지급신청 게시판에서 지급 신청을 한다", img: step4 },
    { id: 5, title: "지급받은 포인트로 기프티콘 쇼핑을 한다.", img: step5 },
    { id: 6, title: "구매한 기프티콘을 쿠폰함에서 확인한다", img: step6 },
    { id: 7, title: "기프티콘을 사용해서 실상품을 수령한다.", img: step7 },
  ];
  const process2 = [
    { id: 1, title: "제휴기업에 구직활동을 한다", img: step1 },
    { id: 2, title: "알바선물에 로그인을 한다", img: step22 },
    { id: 3, title: "지급신청 게시판에서 지급 신청을 한다", img: step4 },
    { id: 4, title: "지급받은 포인트로 기프티콘 쇼핑을 한다.", img: step5 },
    { id: 5, title: "구매한 기프티콘을 쿠폰함에서 확인한다", img: step6 },
    { id: 6, title: "기프티콘을 사용해서 실상품을 수령한다.", img: step7 },
  ];

  useEffect(() => {
    setProcess([]);
    if (user.accessToken !== "") {
      setProcess(process2);
      setIsLogin(true);
    } else {
      setProcess(process1);
      setIsLogin(false);
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container mx-auto">
      <div className="hidden xl:block w-full pb-0 bg-blue-500">
        <img
          src={bgpc}
          alt="면접샵"
          className="max-w-full mx-auto bg-blue-500"
        />
      </div>
      <div className="block xl:hidden w-full pb-0 bg-blue-500">
        <img
          src={bgmo}
          alt="면접샵"
          className="max-w-full mx-auto bg-blue-500"
        />
      </div>
      <div className="bg-gray-700 p-2 text-white">
        <h2 className="text-left text-xl xl:text-2xl font-medium mb-2">
          면접페이 이용안내
        </h2>
        {process.length > 0 && (
          <ol className="grid grid-cols-1 xl:grid-cols-3 text-black gap-2">
            {process.map((p, idx) => (
              <li className="bg-white p-2 rounded-lg" key={idx}>
                <h3 className="text-sm xl:text-lg font-medium mb-2">
                  {p.id}. {p.title}
                </h3>
                <div className="w-full p-2 border">
                  <img
                    src={p.img}
                    className="w-full max-w-fit mx-auto"
                    alt=""
                  />
                </div>
                {p.id === 1 && (
                  <div className="mt-2 p-2 text-center">
                    제휴기업 안내는{" "}
                    <a href="tel:02-1644-4223">
                      <strong className="text-blue-500 hover:text-blue-700">
                        1644-4223
                      </strong>
                    </a>
                    으로 <br className="xl:hidden" />
                    문의해 주세요
                  </div>
                )}
                {isLogin && p.id === 3 && (
                  <div className="text-center mt-2 p-2">
                    <Link
                      to="/mypage/pointrequest"
                      className="hidden p-2 bg-blue-500 hover:bg-blue-700 text-white hover:font-medium"
                    >
                      지급신청 페이지 바로가기
                    </Link>
                  </div>
                )}
                {p.id === 4 && (
                  <div className="mt-2 p-2 text-center">
                    면접포인트는 획득일로부터 <br className="xl:hidden" />
                    <span className="text-rose-500">6개월 뒤 소멸됩니다</span>
                    <br />
                    <br className="xl:hidden" />
                    <span className="text-sm xl:text-base">
                      단, 포인트 획득시 소멸기한이 갱신됩니다
                    </span>
                  </div>
                )}
                {isLogin && p.id === 5 && (
                  <div className="text-center mt-2 p-2 flex flex-col justify-center">
                    <Link
                      to={`/mypage/coupon`}
                      className="block p-2 bg-blue-500 hover:bg-blue-700 text-white hover:font-medium text-sm xl:text-base"
                    >
                      쿠폰 보관함 페이지 바로가기
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default Info;
