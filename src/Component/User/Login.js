import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

import { RiKakaoTalkFill } from "react-icons/ri";

function Login() {
  const inputIdRef = useRef();
  const inputPwdRef = useRef();
  let navi = useNavigate();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [domain, setDomain] = useState("");

  const [isErr, setIsErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [countOver, setCountOver] = useState(false);

  useEffect(() => {
    setSortParams();
    let domain = extractDomain();
    setDomain(domain);
    inputIdRef.current.focus();
    if (user.accessToken !== "") {
      alert("이미 로그인 하셨습니다.\n메인으로 이동합니다");
      navi("/");
    }
    //eslint-disable-next-line
  }, []);

  const setSortParams = () => {
    setSearchParams(searchParams);
    const code = searchParams.get("code");
    if (code) {
      kakaoLoginCheck(code);
    }
  };

  const extractDomain = () => {
    let protocol = window.location.protocol; // 프로토콜을 가져옵니다. (예: http: 또는 https:)
    let hostname = window.location.hostname; // 도메인 이름을 가져옵니다.
    let port = window.location.port; // 포트 번호를 가져옵니다.

    // 로컬호스트인 경우 프로토콜과 포트를 포함하여 반환
    if (hostname === "localhost") {
      return `${protocol}//${hostname}:${port}`;
    }
    let fullDomain = `${protocol}//${hostname}`;
    // 일반 도메인인 경우 프로토콜과 함께 반환
    return fullDomain;
  };

  const login = async e => {
    if (countOver) {
      return alert("비밀번호 입력 횟수를 초과했습니다.");
    }
    e.preventDefault();
    const data = {
      userId: id,
      userPwd: pwd,
    };
    await axios
      .post("/api/v1/user/login", data)
      .then(res => {
        if (res.data.code === "E005") {
          setCountOver(true);
          return alert(
            "비밀번호 입력 횟수를 초과하였습니다.\n잠시 후 다시 시도해 주세요"
          );
        }
        const token = res.headers.authorization;
        if (res.data.code === "E002") {
          let restore = window.confirm(
            "이미 탈퇴한 회원입니다, 탈퇴를 취소하시겠습니까?"
          );
          if (restore) {
            restoreAccount(id);
            return true;
          } else {
            return alert("다른 계정으로 로그인 해 주세요");
          }
        }
        if (res.data.code === "C000") {
          chkAdmin(token, res.data.user);
        } else {
          setErrMessage(res.data.message);
          setPwd("");
          if (res.data.code === "E003") {
            inputPwdRef.current.focus();
          }
          setIsErr(true);
        }
      })
      .catch(e => {
        setErrMessage("로그인에 실패했습니다");
        setIsErr(true);
      });
  };

  const restoreAccount = async id => {
    let data = {
      userId: id,
    };
    await axios
      .post("/api/v1/user/recusr", data)
      .then(res => {
        if (res.data.code === "C000") {
          setPwd("");
          return alert("탈퇴를 취소했습니다. 다시 로그인을 진행해 주세요.");
        } else {
          return alert("알 수 없는 오류입니다\n관리자에게 문의해주세요");
        }
      })
      .catch(error => console.log(error));
  };

  const chkAdmin = async (token, user) => {
    await axios
      .post("/api/v1/user/rolechk", null, {
        headers: { Authorization: token },
      })
      .then(res => {
        if (res.data.code === "A100") {
          dispatch(
            loginUser({
              userId: id,
              userName: user.userName,
              accessToken: token,
              lastLogin: new Date(),
              point: user.point,
              admin: true,
            })
          );
          alert("관리자로 로그인 합니다");
          navi("/");
        } else {
          dispatch(
            loginUser({
              userId: id,
              userName: user.userName,
              accessToken: token,
              lastLogin: new Date(),
              point: user.point,
              admin: false,
            })
          );
          navi("/");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const kakaoLoginCheck = async code => {
    const loginUrl = `/api/v1/user/login/kakao?code=${code}`;
    await axios
      .get(loginUrl)
      .then(res => {
        if (res.data.code === "C001") {
          let data = {};
          data.socialId = res.data.socialUser.id;
          data.email = res.data.socialUser.email;
          data.socialType = res.data.socialUser.socialType;
          alert(res.data.message);
          navi("/cert", { state: { socialUser: data } });
        } else {
          dispatch(
            loginUser({
              userId: res.data.socialUser.userId,
              userName: res.data.socialUser.userName,
              accessToken: res.headers.authorization,
              lastLogin: new Date(),
              point: res.data.socialUser.point,
              admin: false,
            })
          );
          navi("/");
        }
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };

  const kakaoLogin = e => {
    e.preventDefault();
    const apiKey = "e8b025aca3eb87648da9d341528bca5a";
    const redirectUrl = `${domain}/login`;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectUrl}&response_type=code`;
    window.location.href = kakaoURL;
  };

  return (
    <div className="container mx-auto h-full pt-10">
      <form onSubmit={e => login(e)}>
        <div
          id="loginArea"
          className="mx-auto p-2 grid grid-cols-1 gap-3 w-full"
        >
          <h2 className="text-xl text-center">로그인</h2>
          <div id="id" className="grid grid-cols-1">
            <label
              htmlFor="inputId"
              className="text-sm text-left flex flex-col justify-center mb-2"
            >
              아이디
            </label>
            <input
              type="text"
              id="inputId"
              className="border px-2 py-3 w-full rounded shadow-sm"
              value={id}
              onChange={e => setId(e.currentTarget.value)}
              onBlur={e => setId(e.currentTarget.value)}
              autoComplete="on"
              ref={inputIdRef}
            />
          </div>
          <div id="pwd" className="grid grid-cols-1">
            <label
              htmlFor="inputPwd"
              className="text-sm text-left flex flex-col justify-center mb-2"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="inputPwd"
              className="border px-2 py-3 w-full rounded shadow-sm"
              value={pwd}
              onChange={e => setPwd(e.currentTarget.value)}
              onBlur={e => setPwd(e.currentTarget.value)}
              autoComplete="on"
              ref={inputPwdRef}
            />
          </div>
          {isErr && (
            <div className="text-center text-sm pb-2 text-rose-500">
              {errMessage}
            </div>
          )}
          <div className="text-center text-sm text-gray-500 border-b pb-2">
            <Link to="/cert">
              처음이신가요? 여기를 눌러 <br className="block xl:hidden" />
              <span className="text-blue-500 border-b">회원가입</span>을 진행해
              주세요
            </Link>
          </div>
          <div className="w-full">
            <button
              className="transition duration-100 w-full bg-emerald-500 hover:bg-emerald-700 p-2 text-white rounded hover:animate-wiggle"
              type="submit"
            >
              로그인
            </button>
          </div>
          <div className="w-full mb-3">
            <button
              className="transition duration-100 w-full kakaobtn p-2 text-black rounded hover:animate-wiggle"
              onClick={kakaoLogin}
            >
              <RiKakaoTalkFill size={28} className="inline-block" /> 카카오
              간편로그인
            </button>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-2 pb-2">
            <div className="text-sm text-center xl:text-left xl:pl-3">
              로그인 정보가 기억나지 않으세요?
            </div>
            <div className="grid grid-cols-2 divide-x pb-2">
              <div className="text-center text-sm text-gray-500 hover:text-rose-500">
                <Link to="/cert?gubun=find">아이디 찾기</Link>
              </div>
              <div className="text-center text-sm text-gray-500 hover:text-rose-500">
                <Link to="/findpwd">비밀번호 찾기</Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
