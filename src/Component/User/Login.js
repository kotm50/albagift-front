import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import queryString from "query-string";

import { useSelector, useDispatch } from "react-redux";
import { clearUser, loginUser } from "../../Reducer/userSlice";
import { saveId } from "../../Reducer/loginSlice";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import { RiKakaoTalkFill } from "react-icons/ri";
import BeforeJoin from "./BeforeJoin";
import AlertModal from "../Layout/AlertModal";
import axiosInstance from "../../Api/axiosInstance";

function Login() {
  const location = useLocation();
  const inputIdRef = useRef();
  const inputPwdRef = useRef();
  let navi = useNavigate();
  const user = useSelector(state => state.user);
  const loginId = useSelector(state => state.login);
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const parsed = queryString.parse(location.search);
  const code = parsed.code || "";

  const [isErr, setIsErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [countOver, setCountOver] = useState(false);

  const [socialData, setSocialData] = useState("");
  const [isTest, setIsTest] = useState(false);

  const [modal, setModal] = useState(false);
  const [isSave, setIsSave] = useState(false);

  useEffect(() => {
    if (loginId.saveId !== "") {
      setId(loginId.saveId);
      setIsSave(true);
      inputPwdRef.current.focus();
    } else {
      inputIdRef.current.focus();
    }
    if (user.accessToken !== "") {
      dispatch(clearUser());
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (location.state) {
      setIsTest(location.state.test === "yes" ? true : false);
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    if (code !== "") {
      kakaoLoginCheck(code);
    }
    //eslint-disable-next-line
  }, []);

  const goMain = () => {
    navi("/");
  };

  const goBack = () => {
    navi(-1);
  };

  const goAdmin = () => {
    if (isTest) {
      navi("/collect");
    } else {
      navi("/admin");
    }
  };
  const login = async e => {
    e.preventDefault();
    if (isSave) {
      dispatch(saveId({ saveId: id }));
    } else {
      dispatch(saveId({ saveId: "" }));
    }
    if (countOver) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"오류"} // 제목
              message={"비밀번호 입력 횟수를 초과했습니다."} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      return false;
    }
    const data = {
      userId: id,
      userPwd: pwd,
    };
    await axiosInstance
      .post("/api/v1/user/login", data)
      .then(res => {
        if (res.data.code === "E005") {
          setCountOver(true);
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"오류"} // 제목
                  message={
                    "비밀번호 입력 횟수를 초과하였습니다.\n잠시 후 다시 시도해 주세요"
                  } // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          return false;
        }
        const token = res.headers.authorization;
        const refresh = res.data.user.refreshToken;
        if (res.data.code === "E002") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"로그인 안내"} // 제목
                  message={"이미 탈퇴한 회원입니다.\n탈퇴를 취소하시겠습니까?"} // 내용
                  type={"confirm"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                  no={"취소"} // 취소버튼 제목
                  doIt={doRestore} // 확인시 실행할 함수
                  doNot={doNotRestore} // 취소시 실행할 함수
                />
              );
            },
          });
        }
        if (res.data.code === "C000") {
          chkAdmin(token, res.data.user, refresh);
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
        console.log(e);
        setErrMessage("로그인에 실패했습니다");
        setIsErr(true);
      });
  };

  const doRestore = async () => {
    let data = {
      userId: id,
    };
    await axiosInstance
      .post("/api/v1/user/recusr", data)
      .then(res => {
        if (res.data.code === "C000") {
          setPwd("");
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"탈퇴 취소"} // 제목
                  message={"탈퇴를 취소했습니다\n다시 로그인을 진행해 주세요."} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          return true;
        } else {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"오류"} // 제목
                  message={"알 수 없는 오류입니다\n관리자에게 문의해주세요"} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          return false;
        }
      })
      .catch(error => console.log(error));
  };

  const doNotRestore = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"로그인 안내"} // 제목
            message={"다른 계정으로 로그인 해 주세요"} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
          />
        );
      },
    });
    return false;
  };

  const chkAdmin = async (token, user, refresh) => {
    await axiosInstance
      .post("/api/v1/user/rolechk", null, {
        headers: { Authorization: token },
      })
      .then(res => {
        if (res.data.code === "A100") {
          const userData = {
            userId: id,
            userName: user.userName,
            accessToken: token,
            lastLogin: new Date(),
            point: user.point,
            admin: true,
            refreshToken: refresh,
          };
          dispatch(loginUser(userData));
          localStorage.setItem("userData", JSON.stringify(userData)); // 로컬 스토리지에 마킹
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"안녕하세요"} // 제목
                  message={"관리자로 로그인 합니다"} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                  doIt={goAdmin} // 확인시 실행할 함수
                />
              );
            },
          });
        } else {
          const userData = {
            userId: id,
            userName: user.userName,
            accessToken: token,
            lastLogin: new Date(),
            point: user.point,
            admin: false,
            refreshToken: refresh,
          };
          dispatch(loginUser(userData));
          localStorage.setItem("userData", JSON.stringify(userData)); // 로컬 스토리지에 마킹
          chkProto(token, user);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const chkProto = async (token, user) => {
    await axiosInstance
      .post("/api/v1/user/search/proto", null, {
        headers: { Authorization: token },
      })
      .then(res => {
        if (res.data.code === "C001") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"이관"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                  doIt={goMain} // 확인시 실행할 함수
                />
              );
            },
          });
        } else {
          goBack();
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const doKakaoCert = () => {
    confirmAlert({
      customUI: ({ onClose, data }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"환영합니다!"} // 제목
            message={"카카오 계정으로 회원가입을 진행합니다"} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
            doIt={goCert} // 확인시 실행할 함수
            data={data}
          />
        );
      },
    });
  };

  useEffect(() => {
    if (socialData !== "") {
      doKakaoCert();
    }
    //eslint-disable-next-line
  }, [socialData]);

  const goCert = () => {
    navi("/cert", { state: { socialUser: socialData }, replace: true });
  };

  const kakaoLoginCheck = async code => {
    const loginUrl = `/api/v1/user/login/kakao?code=${code}`;
    await axiosInstance
      .get(loginUrl)
      .then(res => {
        if (res.data.code === "C001") {
          let data = {};
          data.socialId = res.data.socialUser.id;
          data.email = res.data.socialUser.email;
          data.socialType = res.data.socialUser.socialType;
          setSocialData(data);
        } else {
          const userData = {
            userId: res.data.socialUser.userId,
            userName: res.data.socialUser.userName,
            accessToken: res.headers.authorization,
            refreshToken: res.data.socialUser.refreshToken,
            lastLogin: new Date(),
            point: res.data.socialUser.point,
            admin: false,
          };
          dispatch(loginUser(userData));
          localStorage.setItem("userData", JSON.stringify(userData)); // 로컬 스토리지에 마킹
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
    const redirectUrl = window.location.href;
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
              autoCapitalize="none"
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
          <div className="text-left text-sm text-gray-500 pb-2 flex items-center">
            <input
              id="saveId"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={isSave}
              onChange={e => setIsSave(!isSave)}
            />
            <label
              htmlFor="saveId"
              className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              아이디 저장
            </label>
          </div>
          <div className="text-center text-sm text-gray-500 border-b pb-2">
            <Link
              to="/beforejoin"
              onClick={e => {
                e.preventDefault();
                setModal(true);
              }}
            >
              처음이신가요? 여기를 눌러 <br className="block lg:hidden" />
              <span className="text-blue-500 border-b">회원가입</span>을 진행해
              주세요
            </Link>
          </div>
          {modal ? <BeforeJoin setModal={setModal} /> : null}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 pb-2">
            <div className="text-sm text-center lg:text-left lg:pl-3">
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
