import React, { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

import queryString from "query-string";

import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import PopupDom from "../../Kakao/PopupDom";
import PopupPostCode from "../../Kakao/PopupPostCode";
import NewPwd from "./NewPwd";
import AgreeModal from "./AgreeModal";
import AlertModal from "../../Layout/AlertModal";

function EditUser(props) {
  const user = useSelector(state => state.user);
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const code = parsed.code || "";
  const dispatch = useDispatch();
  const navi = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [modal, setModal] = useState(false);
  const [domain, setDomain] = useState("");
  const [correctEmail, setCorrectEmail] = useState(true);
  useEffect(() => {
    let domain = extractDomain();
    setDomain(domain);
    getUserInfo();
    if (code !== "") {
      console.log(code);
      kakaoLoginCheck(code);
    }
    //setUserInfo(dummyUser);
    //eslint-disable-next-line
  }, [location]);

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

  const kakaoLogin = e => {
    const apiKey = "e8b025aca3eb87648da9d341528bca5a";
    const redirectUrl = `${domain}/mypage/edit`;
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectUrl}&response_type=code`;
    window.location.href = kakaoURL;
  };

  //카카오연동해제
  const deleteKakao = async () => {
    await axios
      .post("/api/v1/user/rel/integ/kakao", null, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"해제완료"} // 제목
                message={"연동을 해제했습니다"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
        getUserInfo();
      })
      .catch(error => console.log(error));
  };
  //카카오연동체크
  const kakaoLoginCheck = async code => {
    const editUrl = `/api/v1/user/integ/kakao?code=${code}`;
    await axios
      .get(editUrl, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "C000") {
          let mypageURL = `${domain}/mypage/edit`;
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"완료"} // 제목
                  message={"연동이 완료되었습니다"} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          window.location.href = mypageURL;
        } else {
          let mypageURL = `${domain}/mypage/edit`;
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"결과"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          window.location.href = mypageURL;
        }
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };
  const getUserInfo = async () => {
    await axios
      .post("/api/v1/user/myinfo", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        setUserInfo(res.data.user);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [mainAddr, setMainAddr] = useState("주소찾기를 눌러주세요");
  const [email, setEmail] = useState("");
  const [socialType, setSocialType] = useState("");

  const [beforeValue, setBeforeValue] = useState({});

  const [pwdOpen, setPwdOpen] = useState(false);

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    setId(userInfo.userId);
    setName(userInfo.userName);
    setPhone(userInfo.phone);
    setBirth(userInfo.birth);
    setMainAddr(userInfo.mainAddr);
    setEmail(userInfo.email);
    setBeforeValue({
      mainAddr: userInfo.mainAddr,
      email: userInfo.email,
    });
    setSocialType(userInfo.socialType);
  }, [userInfo]);

  const editIt = async (url, type, value) => {
    let data;
    let bValue = beforeValue;
    console.log(value);
    if (value === "") {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"오류"} // 제목
              message={"내용이 입력되지 않았습니다\n확인 후 다시 시도해 주세요"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      return false;
    }

    if (type === "mainAddr") {
      if (value === beforeValue.mainAddr) {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={"이전 값과 동일합니다\n확인 후 다시 시도해 주세요"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
        return false;
      }
      data = {
        mainAddr: value,
      };
      bValue.mainAddr = mainAddr;
    }

    if (type === "gender") {
      if (value === beforeValue.gender) {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={"이전 값과 동일합니다\n확인 후 다시 시도해 주세요"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
        return false;
      }
    }

    if (type === "email") {
      if (value === beforeValue.email) {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={"이전 값과 동일합니다\n확인 후 다시 시도해 주세요"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
        return false;
      }
      if (!correctEmail) {
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={
                  "이메일 양식이 잘못 되었습니다.\n확인 후 다시 시도해 주세요"
                } // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
        return false;
      }
    }
    axios
      .patch(url, data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "C000") {
          if (type === "password") {
            logoutAlert();
          } else {
            confirmAlert({
              customUI: ({ onClose }) => {
                return (
                  <AlertModal
                    onClose={onClose} // 닫기
                    title={"완료"} // 제목
                    message={"수정이 완료되었습니다"} // 내용
                    type={"alert"} // 타입 confirm, alert
                    yes={"확인"} // 확인버튼 제목
                  />
                );
              },
            });
            setBeforeValue(bValue);
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const logout = async () => {
    await axios
      .post("/api/v1/user/logout", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        dispatch(clearUser());
      })
      .catch(e => {
        console.log(e);
      });
    navi("/login");
  };

  const logoutAlert = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"수정완료"} // 제목
            message={"비밀번호가 수정되었습니다.\n다시 로그인 해주세요"} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
            doIt={logout} // 확인시 실행할 함수
          />
        );
      },
    });
  };

  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };
  //휴대폰 변경 전 본인인증
  const doCert = () => {
    setModal(false);
    window.open(
      "/certification",
      "본인인증팝업",
      "toolbar=no, width=480, height=900, directories=no, status=no, scrollorbars=no, resizable=no"
    );

    window.parentCallback = d => {
      changePhone(d);
    };
  };

  const changePhone = async d => {
    let data = d;
    data.gubun = "edit";

    await axios
      .post("/api/v1/user/nice/dec/result", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"완료"} // 제목
                  message={res.data.message} // 내용
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
                  message={`오류가 발생했습니다. (오류코드 : ${res.data.code})`} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          return false;
        }
      })
      .catch(e => console.log(e));
  };

  //이메일 및 중복검사
  const chkEmail = async () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(email)) {
      setCorrectEmail(true);
    } else {
      setCorrectEmail(false);
    }
  };

  return (
    <div>
      <div
        id="editArea"
        className="my-2 mx-auto p-2 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white w-full"
      >
        <div className="text-lg font-medium text-center">개인정보 수정하기</div>
        <div
          id="id"
          className={`grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border`}
        >
          <label
            htmlFor="inputId"
            className={`text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100`}
          >
            아이디
          </label>
          <div className="xl:col-span-6">
            <input
              type="text"
              id="inputId"
              className={`border xl:border-0 p-2 w-full text-sm`}
              value={id || ""}
              onChange={e => {
                setId(e.currentTarget.value);
              }}
              onBlur={e => {
                setId(e.currentTarget.value);
              }}
              placeholder="영어와 숫자만 입력하세요"
              autoComplete="off"
              disabled
            />
          </div>
        </div>
        <div
          id="pwd"
          className="grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border"
        >
          <div
            htmlFor="inputPwd"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100 xl:p-2"
          >
            비밀번호
          </div>
          <div className="xl:col-span-6">
            {pwdOpen ? (
              <NewPwd setPwdOpen={setPwdOpen} logout={logout} user={user} />
            ) : (
              <div className="p-2">
                <button
                  className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full hover:animate-wiggle"
                  onClick={e => setPwdOpen(true)}
                >
                  비밀번호 변경하기
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          id="name"
          className="grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputName"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            이름
          </label>
          <div className="xl:col-span-6">
            <input
              type="text"
              id="inputName"
              className="border xl:border-0 p-2 w-full text-sm"
              value={name || ""}
              onChange={e => setName(e.currentTarget.value)}
              onBlur={e => setName(e.currentTarget.value)}
              placeholder="이름을 입력해 주세요"
              disabled
            />
          </div>
        </div>
        <div
          id="birth"
          className="grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputBirth"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            생년월일
          </label>
          <div className="xl:col-span-6">
            <input
              type="text"
              id="inputBirth"
              className="border xl:border-0 p-2 w-full text-sm"
              value={birth || ""}
              placeholder="6자리 숫자로 입력하세요 - 990101"
              disabled
            />
          </div>
        </div>
        <div
          id="phone"
          className="grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputPhone"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            연락처
          </label>
          <div className="xl:col-span-5">
            <input
              type="text"
              id="inputPhone"
              className="border xl:border-0 p-2 w-full text-sm"
              value={phone || ""}
              placeholder="숫자만 입력해 주세요 - 01012345678"
              disabled
            />
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2"
            onClick={e => {
              setModal(true);
            }}
          >
            수정하기
          </button>
        </div>
        <div className="text-xs text-center xl:text-right p-1">
          이름/연락처를 수정하려면{" "}
          <span className="font-neoextra">본인인증</span>이 필요합니다
        </div>
        {modal ? <AgreeModal doCert={doCert} setModal={setModal} /> : null}
        <div
          id="mainAddr"
          className="grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputMainAddr"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            주소
          </label>
          <div className="xl:col-span-5 grid grid-cols-3 gap-1">
            <div className="col-span-2" title={mainAddr}>
              <input
                type="text"
                id="inputMainAddr"
                className={`border xl:border-0 p-2 w-full text-sm ${
                  mainAddr === "주소찾기를 눌러주세요"
                    ? "text-stone-500"
                    : undefined
                }`}
                value={mainAddr || ""}
                onChange={e => setMainAddr(e.currentTarget.value)}
                onBlur={e => setMainAddr(e.currentTarget.value)}
                disabled
              />
            </div>
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2"
            onClick={e => openPostCode()}
          >
            주소수정
          </button>
        </div>
        <div
          id="email"
          className="grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputEmail"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            이메일
          </label>
          <div className="xl:col-span-5">
            <input
              type="text"
              id="inputEmail"
              className="border xl:border-0 p-2 w-full text-sm"
              value={email || ""}
              onChange={e => {
                setEmail(e.currentTarget.value);
                setCorrectEmail(true);
              }}
              onBlur={e => {
                setEmail(e.currentTarget.value);
                chkEmail();
              }}
              placeholder="이메일 주소를 입력하세요"
            />
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2"
            onClick={e => {
              editIt("/api/v1/user/myinfo/editemail", "email", email);
            }}
          >
            수정하기
          </button>
        </div>
        {!correctEmail && (
          <div className="text-sm text-rose-500">
            이메일 양식이 잘못되었습니다. <br className="block xl:hidden" />
            확인 후 다시 입력해 주세요
          </div>
        )}
        <div
          id="social"
          className="grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border"
        >
          <span className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100">
            간편로그인
          </span>
          <div className="xl:col-span-5">
            {socialType ? (
              <div className="p-2">이미 연동된 계정입니다</div>
            ) : (
              <button
                className="transition duration-100 w-full bg-yellow-300 hover:bg-yellow-500 p-2 text-black rounded hover:animate-wiggle"
                onClick={kakaoLogin}
              >
                카카오 간편로그인
              </button>
            )}
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2 disabled:bg-gray-500"
            onClick={deleteKakao}
            disabled={!socialType}
          >
            연동해제
          </button>
        </div>
        <div className="text-center text-sm text-gray-500 border-b pb-2">
          수정하신 항목을 확인하시고 문제가 없으시다면 <br />각 항목 우측의
          <span className="text-teal-500">'수정하기'</span> 버튼으로 회원정보를
          수정하세요 <br />
          수정을 완료하셨으면
          <span className="text-red-500">'메인으로 이동'</span> 버튼으로
          메인페이지로 돌아가세요
        </div>
        <div className="w-full">
          <Link
            to="/"
            className="block transition duration-100 w-full border text-center hover:bg-red-50 border-red-500 hover:border-red-700 p-2 text-red-500 hover:text-red-700 rounded"
          >
            메인으로 이동
          </Link>
        </div>
        <div className="w-full text-center">
          <Link
            to="/mypage/cancel"
            className="transition text-center p-2 text-xs hover:text-stone-500"
          >
            회원탈퇴
          </Link>
        </div>
      </div>

      <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode
              onClose={closePostCode}
              setMainAddr={setMainAddr}
              modify={true}
              editIt={editIt}
            />
          </PopupDom>
        )}
      </div>
    </div>
  );
}

export default EditUser;
