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
  const [errMsg, setErrMsg] = useState(false);
  const [tid, setTid] = useState("");

  useEffect(() => {
    if (location.state) {
      setSocialUser(location.state.socialUser);
    }
    //eslint-disable-next-line
  }, []);

  const doCert = () => {
    window.open(
      "/certification",
      "팝업테스트",
      "toolbar=no, width=480, height=900, directories=no, status=no, scrollorbars=no, resizable=no"
    );

    window.parentCallback = d => {
      certToBack(d);
    };
  };

  const certToBack = async d => {
    let data = d;
    data.gubun = gubun;
    await axios
      .post("/api/v1/user/nice/dec/result", data)
      .then(res => {
        if (res.data.code === "C000") {
          if (socialUser !== "") {
            navi("/join", {
              state: { tempId: res.data.tempId, socialUser: socialUser },
            });
          } else {
            navi("/join", {
              state: { tempId: res.data.tempId, socialUser: "noSocial" },
            });
          }
        } else {
          setErrMsg(true);
          setTid(res.data.tempId);
        }
      })
      .catch(e => console.log(e));
  };
  return (
    <>
      {!errMsg ? (
        <div className="mx-auto bg-white certArea py-5">
          <h1 className="text-xl xl:text-2xl font-neoextra mb-3">
            알바선물에 오신 것을 <br className="xl:hidden" />
            환영합니다!
          </h1>
          <div className="text-sm xl:text-base font-neo mb-3">
            원활한 이용을 위해 본인인증 후 <br className="xl:hidden" />
            회원가입을 진행합니다
          </div>
          {socialUser !== "" ? (
            <div className="text-sm xl:text-base font-neo mb-3">
              최초 1회 진행 후 카카오톡 계정으로 간편하게 로그인 가능합니다
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
              본인인증하고 회원가입 하기
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto bg-white certArea py-5">
          <h1 className="text-xl xl:text-2xl font-neoextra mb-3">
            알바선물에 오신 것을 <br className="xl:hidden" />
            환영합니다!
          </h1>
          <div className="text-sm xl:text-base font-neo mb-3">
            고객님께서는 이미 회원가입을 하셨습니다 <br />
            아래 계정으로 로그인 해 주세요.
          </div>
          <div className="absolute z-20 w-60 bottom-30 left-1/2 -translate-x-1/2">
            <div className="py-3 bg-blue-100 w-full rounded-full text-center">
              <span className="text-sm">가입한 아이디</span>
              <br />
              <span className="text-lg font-neoextra">{tid}</span>
            </div>
          </div>
          <div className="absolute z-20 w-64 xl:w-96 bottom-20 left-1/2 -translate-x-1/2">
            <button
              className="py-3 bg-blue-500 hover:bg-blue-700 text-white w-full rounded-full"
              onClick={e => navi("/login")}
            >
              로그인 하러 가기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Cert;
