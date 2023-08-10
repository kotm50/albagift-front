import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import axios from "axios";

import { useDispatch } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

function Login() {
  let navi = useNavigate();
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [domain, setDomain] = useState("");

  useEffect(() => {
    setSortParams();
    let domain = extractDomain();
    setDomain(domain);
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
    e.preventDefault();
    const data = {
      userId: id,
      userPwd: pwd,
    };
    await axios
      .post("/api/v1/user/login", data)
      .then(res => {
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
        }
      })
      .catch(e => {
        console.log(e);
        alert("로그인에 실패했습니다\n아이디 또는 비밀번호를 확인해 주세요");
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
          setId("");
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
          alert("로그인 완료");
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
        const data = res.data.socialUser;
        if (res.data.code === "K000") {
          navi("/join", {
            state: {
              id: data.id,
              email: data.email,
              socialType: data.socialType,
            },
          });
        } else {
          dispatch(
            loginUser({
              userId: data.userId,
              userName: data.userName,
              accessToken: res.headers.authorization,
              lastLogin: new Date(),
              point: data.point,
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
    <form onSubmit={e => login(e)}>
      <div
        id="loginArea"
        className="my-2 mx-auto p-2 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white xl:fixed xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 w-full"
      >
        <div className="text-lg font-medium text-center">로그인</div>
        <div
          id="id"
          className="grid grid-cols-1 xl:grid-cols-5 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputId"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            아이디
          </label>
          <div className="xl:col-span-4">
            <input
              type="text"
              id="inputId"
              className="border xl:border-0 p-2 w-full text-sm"
              value={id}
              onChange={e => setId(e.currentTarget.value)}
              onBlur={e => setId(e.currentTarget.value)}
              autoComplete="on"
            />
          </div>
        </div>
        <div
          id="pwd"
          className="grid grid-cols-1 xl:grid-cols-5 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputPwd"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            비밀번호
          </label>
          <div className="xl:col-span-4">
            <input
              type="password"
              id="inputPwd"
              className="border xl:border-0 p-2 w-full text-sm"
              value={pwd}
              onChange={e => setPwd(e.currentTarget.value)}
              onBlur={e => setPwd(e.currentTarget.value)}
              autoComplete="on"
            />
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 border-b pb-2">
          <Link to="/join">
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
        <div className="w-full">
          <button
            className="transition duration-100 w-full bg-yellow-300 hover:bg-yellow-500 p-2 text-black rounded hover:animate-wiggle"
            onClick={kakaoLogin}
          >
            카카오 간편로그인
          </button>
        </div>
      </div>
    </form>
  );
}

export default Login;
