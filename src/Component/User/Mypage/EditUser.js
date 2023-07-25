import React, { useEffect, useState } from "react";

import axios from "axios";

import PopupDom from "../../Kakao/PopupDom";
import PopupPostCode from "../../Kakao/PopupPostCode";

function EditUser(props) {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    getUserInfo();
    //setUserInfo(dummyUser);
    //eslint-disable-next-line
  }, []);
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
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [correctPwdChk, setCorrectPwdChk] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);
  const [name, setName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [inputBirth, setInputBirth] = useState("");
  const [displayBirth, setDisplayBirth] = useState("");
  const [mainAddr, setMainAddr] = useState("주소찾기를 눌러주세요");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  const [beforeValue, setBeforeValue] = useState({});

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    setId(userInfo.userId);
    setName(userInfo.userName);
    setPhone(userInfo.phone);
    setBirth(userInfo.birth);
    setMainAddr(userInfo.mainAddr);
    setGender(userInfo.gender);
    setEmail(userInfo.email);
    setBeforeValue({
      phone: userInfo.phone,
      birth: userInfo.birth,
      mainAddr: userInfo.mainAddr,
      gender: userInfo.gender,
      email: userInfo.email,
    });
  }, [userInfo]);

  //비밀번호 양식 확인
  const testPwd = () => {
    if (pwd.length > 0) {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{2,}$/;
      let correct = regex.test(pwd);
      if (correct) {
        if (pwd.length > 5) {
          setCorrectPwd(true);
        } else {
          setCorrectPwd(false);
        }
      } else {
        setCorrectPwd(false);
      }
    } else {
      setCorrectPwd(true);
    }
  };

  //비밀번호 일치 확인
  const chkPwd = () => {
    if (pwd.length > 0) {
      if (pwd !== pwdChk) {
        setCorrectPwdChk(false);
      } else {
        setCorrectPwdChk(true);
      }
    } else {
      setCorrectPwdChk(true);
    }
  };

  //전체정보수정
  const editAll = async e => {
    e.preventDefault();
    const data = {
      userId: id,
      userPwd: pwd,
      userName: name,
      phone: inputPhone,
      birth: inputBirth,
      mainAddr: mainAddr,
      gender: gender,
      email: email,
    };
    console.log(data);
  };

  const editIt = async (url, type, value) => {
    let data;
    if (value === "") {
      return alert("내용이 입력되지 않았습니다\n확인 후 다시 시도해 주세요");
    }
    if (type === "password") {
      if (!correctPwd) {
        return alert(
          "비밀번호 양식이 잘못되었습니다\n확인 후 다시 시도해 주세요"
        );
      }
      if (!correctPwdChk) {
        return alert(
          "비밀번호 확인에 실패했습니다\n확인 후 다시 시도해 주세요"
        );
      }
      data = {
        userPwd: pwd,
      };
    }
    if (type === "birth") {
      if (value === beforeValue.birth) {
        return alert("이전 값과 동일합니다\n확인 후 다시 시도해 주세요");
      }
      data = {
        birth: inputBirth,
      };
    }

    if (type === "mainAddr") {
      if (value === beforeValue.mainAddr) {
        return alert("이전 값과 동일합니다\n확인 후 다시 시도해 주세요");
      }
      data = {
        mainAddr: mainAddr,
      };
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
          alert("수정이 완료되었습니다");
        }
      })
      .catch(e => {
        console.log(e);
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
    <form onSubmit={e => editAll(e)}>
      <div
        id="editArea"
        className="my-2 mx-auto p-2 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white xl:fixed xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 w-full"
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
          className={`grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border ${
            !correctPwd ? "xl:border-red-500" : null
          }`}
        >
          <label
            htmlFor="inputPwd"
            className={`text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 ${
              correctPwd ? "xl:bg-gray-100" : "xl:bg-red-100"
            } `}
          >
            새 비밀번호
          </label>
          <div className="xl:col-span-6">
            <input
              type="password"
              id="inputPwd"
              className={`border ${
                !correctPwd ? "border-red-500" : undefined
              } xl:border-0 p-2 w-full text-sm`}
              value={pwd || ""}
              onChange={e => {
                setPwd(e.currentTarget.value);
                if (!correctPwd) testPwd();
              }}
              onBlur={e => {
                setPwd(e.currentTarget.value);
                if (pwd !== "") testPwd();
              }}
              placeholder="비밀번호를 수정하실 때만 입력해 주세요"
              autoComplete="off"
            />
          </div>
        </div>
        {!correctPwd && (
          <div className="text-sm text-rose-500">
            비밀번호 양식이 틀렸습니다 <br className="block xl:hidden" />
            영어/숫자/특수문자 중 <strong>2가지 이상</strong> 입력해 주세요
          </div>
        )}

        <div
          id="pwdChk"
          className={`grid grid-cols-1 xl:grid-cols-7 xl:divide-x xl:border ${
            !correctPwdChk ? "xl:border-red-500" : undefined
          }`}
        >
          <label
            htmlFor="inputPwdChk"
            className={`text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 ${
              correctPwdChk ? "xl:bg-gray-100" : "xl:bg-red-100"
            } `}
          >
            비번확인
          </label>
          <div className="xl:col-span-5">
            <input
              type="password"
              id="inputPwdChk"
              className={`border ${
                !correctPwdChk ? "border-red-500" : undefined
              } xl:border-0 p-2 w-full text-sm`}
              value={pwdChk || ""}
              onChange={e => {
                setPwdChk(e.currentTarget.value);
                if (!correctPwdChk) chkPwd();
              }}
              onBlur={e => {
                setPwdChk(e.currentTarget.value);
                if (pwdChk !== "") chkPwd();
              }}
              placeholder="비밀번호를 한번 더 입력해 주세요"
              autoComplete="off"
            />
          </div>
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white p-2"
            onClick={e =>
              editIt("/api/v1/user/myinfo/editpwd", "password", pwd)
            }
          >
            수정하기
          </button>
        </div>
        {!correctPwdChk && (
          <div className="text-sm text-rose-500">
            비밀번호가 일치하지 않습니다 <br className="block xl:hidden" />
            확인 후 다시 입력해 주세요
          </div>
        )}

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
                e.preventDefault();
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
        <div className="text-center text-sm text-gray-500 border-b pb-2">
          수정하신 항목을 확인하시고 문제가 없으시다면 <br />각 항목 우측의
          <span className="text-teal-500">'수정하기'</span> 버튼으로 회원정보를
          수정하세요 <br />
          수정을 완료하셨으면
          <span className="text-red-500">'메인으로 이동'</span> 버튼으로
          메인페이지로 돌아가세요
        </div>
        <div className="w-full">
          <a
            href="/"
            className="block transition duration-100 w-full border text-center hover:bg-red-50 border-red-500 hover:border-red-700 p-2 text-red-500 hover:text-red-700 rounded"
          >
            메인으로 이동
          </a>
        </div>
      </div>
      <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode onClose={closePostCode} setMainAddr={setMainAddr} />
          </PopupDom>
        )}
      </div>
    </form>
  );
}

export default EditUser;
