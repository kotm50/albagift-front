import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../Reducer/userSlice";

import axios from "axios";

import PopupDom from "../../Kakao/PopupDom";
import PopupPostCode from "../../Kakao/PopupPostCode";
import NewPwd from "./NewPwd";

function EditUser(props) {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    getUserInfo();
    if (props.code) {
      kakaoLoginCheck(props.code);
    }
    //setUserInfo(dummyUser);
    //eslint-disable-next-line
  }, []);

  //카카오연동해제
  const deleteKakao = async () => {
    await axios
      .post("/api/v1/user/rel/integ/kakao", null, {
        headers: {
          Authorization: props.user.accessToken,
        },
      })
      .then(res => {
        alert(`연동이 해제되었습니다 (${res.data.code})`);
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
          Authorization: props.user.accessToken,
        },
      })
      .then(res => {
        let mypageURL = `${props.domain}/mypage/checked`;
        alert("연동이 완료되었습니다.");
        window.location.href = mypageURL;
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };
  const getUserInfo = async () => {
    await axios
      .post("/api/v1/user/myinfo", null, {
        headers: { Authorization: props.user.accessToken },
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
  const [inputPhone, setInputPhone] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [inputBirth, setInputBirth] = useState("");
  const [displayBirth, setDisplayBirth] = useState("");
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
      phone: userInfo.phone,
      birth: userInfo.birth,
      mainAddr: userInfo.mainAddr,
      email: userInfo.email,
    });
    setSocialType(userInfo.socialType);
  }, [userInfo]);

  const editIt = async (url, type, value) => {
    let data;
    let bValue = beforeValue;
    if (value === "") {
      return alert("내용이 입력되지 않았습니다\n확인 후 다시 시도해 주세요");
    }
    if (type === "birth") {
      if (value === beforeValue.birth) {
        return alert("이전 값과 동일합니다\n확인 후 다시 시도해 주세요");
      }
      data = {
        birth: inputBirth,
      };
      bValue.birth = inputBirth;
    }

    if (type === "mainAddr") {
      if (value === beforeValue.mainAddr) {
        return alert("이전 값과 동일합니다\n확인 후 다시 시도해 주세요");
      }
      data = {
        mainAddr: mainAddr,
      };
      bValue.mainAddr = mainAddr;
    }

    if (type === "gender") {
      if (value === beforeValue.gender) {
        return alert("이전 값과 동일합니다\n확인 후 다시 시도해 주세요");
      }
    }
    axios
      .patch(url, data, {
        headers: {
          Authorization: props.user.accessToken,
        },
      })
      .then(res => {
        if (res.data.code === "C000") {
          if (type === "password") {
            logout();
          } else {
            alert("수정이 완료되었습니다");
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
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        dispatch(clearUser());
        alert("비밀번호가 수정되었습니다.\n다시 로그인 해주세요");
      })
      .catch(e => {
        console.log(e);
      });
    navi("/login");
  };

  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  //전화번호 중간에 '-' 표시하기.
  const handlePhone = e => {
    const rawValue = e.target.value.replace(/-/g, ""); // remove all dashes

    if (rawValue.length > 11) {
      alert("휴대폰 번호는 최대 11자리까지 입력 가능합니다");
      return;
    }

    // check if the raw value is a valid number
    if (!isNaN(Number(rawValue))) {
      setInputPhone(rawValue);
      let display = rawValue;
      if (rawValue.length === 7) {
        display = rawValue.replace(/(\d{3})(\d{4})/, "$1-$2");
      } else if (rawValue.length >= 8 && rawValue.length < 10) {
        display = rawValue.replace(/(\d{4})(\d{4})/, "$1-$2");
      } else if (rawValue.length === 10) {
        display = rawValue.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      } else if (rawValue.length === 11) {
        display = rawValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      }
      setDisplayPhone(display);
    }
  };

  //최초 로딩시 전화번호 '-'표시
  const setPhone = e => {
    if (e !== undefined) {
      const rawValue = e.replace(/-/g, ""); // remove all dashes

      if (rawValue.length > 11) {
        alert("휴대폰 번호는 최대 11자리까지 입력 가능합니다");
        return;
      }

      // check if the raw value is a valid number
      if (!isNaN(Number(rawValue))) {
        setInputPhone(rawValue);
        let display = rawValue;
        if (rawValue.length === 7) {
          display = rawValue.replace(/(\d{3})(\d{4})/, "$1-$2");
        } else if (rawValue.length >= 8 && rawValue.length < 10) {
          display = rawValue.replace(/(\d{4})(\d{4})/, "$1-$2");
        } else if (rawValue.length === 10) {
          display = rawValue.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        } else if (rawValue.length === 11) {
          display = rawValue.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        }
        setDisplayPhone(display);
      }
    }
  };

  //생일 중간에 '년월일' 표시하기.
  const handleBirth = e => {
    if (e !== undefined) {
      const rawValue = e.target.value.replace(/-/g, ""); // remove all dashes
      setInputBirth(rawValue);
      let display = rawValue;

      if (rawValue.length > 6) {
        alert("생년월일은 최대 6자리까지 입력 가능합니다");
        return;
      }

      // check if the raw value is a valid number
      if (!isNaN(Number(rawValue))) {
        if (rawValue.length <= 4) {
          display = rawValue.replace(/(\d{2})(\d{2})/, "$1-$2");
        } else if (rawValue.length <= 6) {
          display = rawValue.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
        }
        setDisplayBirth(display);
      }
    }
  };

  //최초 로딩시 생일 '년월일'표시
  const setBirth = e => {
    if (e !== undefined) {
      const rawValue = e.replace(/-/g, ""); // remove all dashes
      setInputBirth(rawValue);
      let display = rawValue;
      // check if the raw value is a valid number
      if (!isNaN(Number(rawValue))) {
        if (rawValue.length <= 2) {
          display = `${rawValue}년`;
        } else if (rawValue.length <= 4) {
          display = rawValue.replace(/(\d{2})(\d{2})/, "$1-$2");
        } else if (rawValue.length <= 6) {
          display = rawValue.replace(/(\d{2})(\d{2})(\d{2})/, "$1-$2-$3");
        }
        setDisplayBirth(display);
      }
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
              <NewPwd
                setPwdOpen={setPwdOpen}
                logout={logout}
                user={props.user}
              />
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
              value={displayPhone || ""}
              onChange={handlePhone}
              onBlur={handlePhone}
              placeholder="숫자만 입력해 주세요 - 01012345678"
            />
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2"
            onClick={e => {
              console.log(inputPhone);
              alert(
                "정책상 연락처는 즉시 수정이 어렵습니다\n고객센터(1644-4223)에 문의해 주세요."
              );
            }}
          >
            수정하기
          </button>
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
          <div className="xl:col-span-5">
            <input
              type="text"
              id="inputBirth"
              className="border xl:border-0 p-2 w-full text-sm"
              value={displayBirth || ""}
              onChange={handleBirth}
              onBlur={handleBirth}
              placeholder="6자리 숫자로 입력하세요 - 990101"
            />
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2"
            onClick={e =>
              editIt("/api/v1/user/myinfo/editbirth", "birth", inputBirth)
            }
          >
            수정하기
          </button>
        </div>
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
            <button
              className="w-full h-full p-2 text-white bg-blue-500 hover:bg-blue-700 text-sm"
              onClick={e => {
                openPostCode();
              }}
            >
              주소찾기
            </button>
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2"
            onClick={e =>
              editIt("/api/v1/user/myinfo/editaddr", "mainAddr", mainAddr)
            }
          >
            수정하기
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
              onChange={e => setEmail(e.currentTarget.value)}
              onBlur={e => setEmail(e.currentTarget.value)}
              placeholder="이메일 주소를 입력하세요"
            />
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2"
            onClick={e => {
              alert(
                "정책상 이메일 주소는 즉시 수정이 어렵습니다\n고객센터(1644-4223)에 문의해 주세요."
              );
            }}
          >
            수정하기
          </button>
        </div>
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
                onClick={props.kakaoLogin}
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
            to="/cancel"
            className="transition text-center p-2 text-xs hover:text-stone-500"
          >
            회원탈퇴
          </Link>
        </div>
      </div>

      <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode onClose={closePostCode} setMainAddr={setMainAddr} />
          </PopupDom>
        )}
      </div>
    </div>
  );
}

export default EditUser;
