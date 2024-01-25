import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";

//import coffee from "../../Asset/subContent/starbucks.png"; //여름
import coffee from "../../Asset/subContent/coffeebig.webp"; //겨울
import { Link } from "react-router-dom";

function Agree() {
  const user = useSelector(state => state.user);
  console.log(user);
  const agreeIt = async () => {
    console.log(user);
    await axios
      .patch("/api/v1/user/upt/agree/y", null, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        console.log(res);
        alert(res.data.message);
      })
      .catch(e => console.log(e));
  };
  return (
    <>
      <div className="lg:container mx-auto w-full h-[720px] bg-teal-500 relative overflow-hidden">
        <h3 className="absolute top-5 lg:top-20 left-0 right-0 text-center flex flex-col lg:flex-row justify-center gap-4 text-6xl lg:text-8xl w-full text-white pt-10">
          <span>마케팅</span>
          <span>수신동의</span>
          <span>이벤트</span>
        </h3>
        <div className="w-11/12 lg:hidden text-center text-xl lg:text-2xl text-white font-neo absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          알바선물의 다양한 정보를
          <br />
          실시간으로 받아보시고
          <br />
          포인트로 커피 한잔 하세요!
        </div>
        <div className="hidden w-1/2 lg:block text-center text-4xl text-white font-neo absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] leading-snug">
          알바선물의 다양한 정보를 실시간으로 받아보시고
          <br />
          포인트로 커피 한잔 하세요!
        </div>
        <img
          src={coffee}
          alt="스타벅스커피"
          className="w-[240px] lg:w-[320px] h-auto bottom-0 left-1/2 -translate-x-1/2 absolute z-20"
        />
        <div className="w-[480px] h-[480px] lg:w-[1000px] lg:h-[1000px] rounded-full bg-white bg-opacity-60 absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-[75%] z-10"></div>
      </div>
      <div className="py-10 lg:container mx-auto w-full bg-teal-700">
        <button
          className={`${
            user.userId === ""
              ? "bg-gray-500 hover:bg-gray-700"
              : "bg-indigo-500 hover:bg-indigo-700"
          } text-white p-4 lg:py-10 lg:px-20 text-xl lg:text-4xl mx-auto block rounded-lg`}
          onClick={agreeIt}
          disabled={user.userId === ""}
        >
          마케팅 수신정보 동의하기
        </button>
        {user.userId === "" && (
          <div className="text-center text-white text-xs lg:text-base mt-3">
            <Link to="/login" className="hover:text-[#ff0]">
              로그인이 필요합니다.{" "}
              <span className="text-[#ff0]">여기를 눌러 로그인 해주세요</span>
            </Link>
          </div>
        )}
      </div>
      <div className="py-20 px-40 container mx-auto w-full bg-black flex-col justify-start gap-y-4 hidden lg:flex font-neolight">
        <div className="font-neoheavy lg:text-3xl text-white">유의사항</div>
        <div className="text-white lg:text-2xl flex flex-col justify-start gap-x-2">
          <span>
            마케팅 정보수신에 동의해 주시면 최초 1회에 한하여 면접포인트 4000P를
            지급해드립니다
          </span>
          <span className="text-xs lg:text-sm text-[#ff0]">
            (이미 동의하신 회원님도 아래 버튼을 누르면 1회에 한해 면접포인트를
            지급해 드립니다)
          </span>
        </div>
        <div className="text-white lg:text-2xl">
          정보수신에 동의해 주시면 알바선국의 이벤트와 컨텐츠 등 다양한 정보를
          미리 만나보실 수 있습니다.
        </div>
        <div className="text-white lg:text-2xl">
          정보수신에 동의하여 포인트를 지급받으시면 최소 1개월간은 동의 철회가
          불가능합니다
        </div>
        <div className="text-white lg:text-2xl">
          이미 포인트를 지급받으셨다면 철회 후 재동의를 하셔도 포인트 지급이
          불가능합니다.
        </div>
      </div>
      <div className="py-10 px-4 container mx-auto w-full bg-black flex flex-col justify-start gap-y-4 lg:hidden font-neolight">
        <div className="font-neoheavy lg:text-3xl text-white">유의사항</div>
        <div className="text-white lg:text-2xl flex flex-col justify-start gap-x-2">
          <span>
            마케팅 정보수신에 동의해 주시면 최초 1회에 한하여 면접포인트 4000P를
            지급해드립니다
          </span>
          <span className="text-xs lg:text-sm text-[#ff0]">
            (이미 동의하신 회원님도 아래 버튼을 누르면 1회에 한해 면접포인트를
            지급해 드립니다)
          </span>
        </div>
        <div className="text-white lg:text-2xl">
          정보수신에 동의해 주시면 알바선국의 이벤트와 컨텐츠 등 다양한 정보를
          미리 만나보실 수 있습니다.
        </div>
        <div className="text-white lg:text-2xl">
          정보수신에 동의하여 포인트를 지급받으시면 최소 1개월간은 동의 철회가
          불가능합니다
        </div>
        <div className="text-white lg:text-2xl">
          이미 포인트를 지급받으셨다면 철회 후 재동의를 하셔도 포인트 지급이
          불가능합니다.
        </div>
      </div>
    </>
  );
}

export default Agree;
