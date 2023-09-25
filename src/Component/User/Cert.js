import { useState, useEffect } from "react";
import giftbox from "../../Asset/giftbox.png";
import { useNavigate, useLocation } from "react-router-dom";

import queryString from "query-string";

import axios from "axios";

function Cert() {
  const navi = useNavigate();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const gubun = parsed.gubun || "join";
  const [socialUser, setSocialUser] = useState("");
  const [getTid, setGetTid] = useState(false);
  const [tid, setTid] = useState("");

  useEffect(() => {
    if (location.state) {
      console.log(location.state.socialUser);
      setSocialUser(location.state.socialUser);
    }
    //eslint-disable-next-line
  }, [location]);

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

  const certToBack = async d => {
    let data = d;
    data.gubun = gubun;
    if (socialUser !== "") {
      data.socialId = socialUser.socialId;
      data.socialType = socialUser.socialType;
    }
    console.log(data);
    //data = {token, enc, int, gubun, id, email}
    await axios
      .post("/api/v1/user/nice/dec/result", data)
      .then(res => {
        if (res.data.code === "C000") {
          if (gubun === "join") {
            navi("/join", {
              state: { tempId: res.data.tempId, email: socialUser.kakaoEmail },
            });
          } else if (gubun === "find") {
            setGetTid(true);
            setTid(res.data.tempId);
          } else if (gubun === "reco") {
          }
        } else {
          setGetTid(true);
          setTid(res.data.tempId);
        }
      })
      .catch(e => console.log(e));
  };
  return (
    <>
      {!getTid ? (
        <div className="mx-auto bg-white certArea py-5">
          {gubun === "join" ? (
            <>
              <h2 className="text-xl xl:text-2xl font-neoextra mb-3">
                알바선물에 오신 것을 <br className="xl:hidden" />
                환영합니다!
              </h2>
              <div className="text-sm xl:text-base font-neo mb-3">
                원활한 이용을 위해 본인인증 후 <br className="xl:hidden" />
                회원가입을 진행합니다
              </div>
            </>
          ) : gubun === "find" ? (
            <>
              <h2 className="text-xl xl:text-2xl font-neoextra mb-3">
                알바선물 아이디 찾기
              </h2>
              <div className="text-sm xl:text-base font-neo mb-3">
                원활한 이용을 위해 본인인증을 해주세요
              </div>
            </>
          ) : gubun === "reco" ? (
            <>
              <h2 className="text-xl xl:text-2xl font-neoextra mb-3">
                알바선물 비밀번호 재설정
              </h2>
              <div className="text-sm xl:text-base font-neo mb-3">
                본인인증 후 비밀번호 재설정을 진행합니다
              </div>
            </>
          ) : null}
          {socialUser !== "" ? (
            <div className="text-sm xl:text-base font-neo mb-3">
              최초 1회 진행 후 카카오톡 계정으로
              <br className="xl-hidden" /> 간편하게 로그인 가능합니다
            </div>
          ) : null}
          <div className="absolute z-10 bottom-20 right-10 w-64 max-w-full">
            <img
              src={giftbox}
              alt="선물상자"
              className="w-full drop-shadow-lg"
            />
          </div>
          <div className="absolute z-20 w-64 xl:w-96 bottom-20 left-1/2 -translate-x-1/2">
            <button
              className="py-3 bg-black hover:bg-stone-800 text-white w-full rounded-full"
              onClick={doCert}
            >
              본인인증하고{" "}
              {gubun === "join"
                ? "회원가입 하기"
                : gubun === "find"
                ? "아이디 찾기"
                : gubun === "reco"
                ? "비밀번호 찾기"
                : null}
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto bg-white certArea py-5">
          {gubun === "join" ? (
            <>
              <h2 className="text-xl xl:text-2xl font-neoextra mb-3">
                알바선물에 오신 것을 <br className="xl:hidden" />
                환영합니다!
              </h2>
              <div className="text-sm xl:text-base font-neo mb-3">
                고객님께서는 이미 아래 계정으로 가입하셨습니다. <br />
                비밀번호가 기억나지 않으시면 '비밀번호 찾기'를 진행해 주세요.
              </div>
              {socialUser !== "" ? (
                <div className="text-sm xl:text-base font-neo mb-3">
                  간편로그인을 추가하시려면 로그인 후 정보수정에서
                  <br />
                  소셜계정을 등록해 주세요.
                </div>
              ) : null}
            </>
          ) : gubun === "find" ? (
            <>
              <h2 className="text-xl xl:text-2xl font-neoextra mb-3">
                알바선물 아이디 찾기
              </h2>
              <div className="text-sm xl:text-base font-neo mb-3">
                고객님의 아이디 입니다. <br /> 로그인 또는 비밀번호 찾기를
                진행해 주세요
              </div>
            </>
          ) : null}
          <div className="absolute z-20 w-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="py-3 bg-blue-100 w-full rounded-full text-center bottom-40">
              <span className="text-sm">가입한 아이디</span>
              <br />
              <span className="text-lg font-neoextra">{tid}</span>
            </div>
          </div>
          <div className="absolute z-20 w-64 xl:w-96 bottom-20 left-1/2 -translate-x-1/2 grid grid-cols-1 gap-y-2">
            <button
              className="py-3 bg-blue-500 hover:bg-blue-700 text-white w-full rounded-full"
              onClick={e => navi("/login")}
            >
              로그인 하러 가기
            </button>

            <button
              className="py-3 border border-blue-500 hover:border-blue-700 text-blue-500 hover:text-blue-700 w-full rounded-full"
              onClick={e => navi("/findpwd", { state: { id: tid } })}
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Cert;
