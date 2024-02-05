import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

import axios from "axios";

import { useSelector } from "react-redux";

import PopupDom from "../Kakao/PopupDom";
import PopupPostCode from "../Kakao/PopupPostCode";

import Modal from "../doc/Modal";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import AlertModal from "../Layout/AlertModal";

function JoinBack() {
  const user = useSelector(state => state.user);
  const location = useLocation();
  let navi = useNavigate();
  const { promo } = useParams();
  const [socialId, setSocialId] = useState("");
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [realPwd, setRealPwd] = useState("");
  const [realPwdChk, setRealPwdChk] = useState("");
  const [correctId, setCorrectId] = useState(true);
  const [dupId, setDupId] = useState(true);
  const [correctPwdChk, setCorrectPwdChk] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);
  const [pwdMsg, setPwdMsg] = useState(true);
  const [name, setName] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [inputBirth, setInputBirth] = useState("");
  const [displayBirth, setDisplayBirth] = useState("");
  const [mainAddr, setMainAddr] = useState("주소찾기를 눌러주세요");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [socialType, setSocialType] = useState("");

  const [agreeAll, setAgreeAll] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [priAgree, setPriAgree] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);

  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);

  const [isSocialLogin, setIsSocialLogin] = useState(false);

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (location.state) {
      setSocialId(location.state.id);
      setEmail(location.state.email);
      setSocialType(location.state.socialType);
      setIsSocialLogin(true);
    } else {
      setIsSocialLogin(false);
    }

    if (user.accessToken !== "") {
      alert("이미 로그인 하셨습니다.\n메인으로 이동합니다");
      navi("/");
    }
    //eslint-disable-next-line
  }, []);

  //회원가입 실행
  const join = async e => {
    e.preventDefault();
    let correctChk = await chkForm();
    if (correctChk !== "완료") {
      return alert(correctChk + "\n확인 후 다시 시도해 주세요");
    }
    const data = {
      userId: id,
      socialId: socialId,
      userPwd: realPwd,
      userName: name,
      phone: inputPhone,
      birth: inputBirth,
      mainAddr: mainAddr,
      gender: gender,
      email: email,
      socialType: socialType,
      promo: false,
      agreeYn: "N",
    };
    if (promo !== undefined) {
      data.promo = true;
    }
    if (marketingAgree) {
      data.agreeYn = "Y";
    }
    console.log(data);
    let url = "/api/v1/user/join";
    if (isSocialLogin) {
      url = `${url}/${socialType}`;
    }
    await axios
      .post(url, data)
      .then(res => {
        if (res.data.code === "C000") {
          alert("환영합니다 ^^\n로그인을 진행해 주세요");
          navi("/login");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  //비밀번호 너무 길게쓰면 오류
  const pwdAlert = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"오류"} // 제목
            message={"비밀번호는 20자를 넘길 수 없습니다"} // 내용
            type={"alert"} // 타입 confirm, alert
            yes={"확인"} // 확인버튼 제목
          />
        );
      },
    });
  };

  const chkForm = () => {
    if (id === "") {
      return "아이디가 입력되지 않았습니다";
    }
    if (!correctId) {
      return "아이디 양식이 잘못되었습니다";
    }
    if (!dupId) {
      return "이미 사용중인 아이디 입니다";
    }
    if (pwd === "") {
      return "비밀번호가 입력되지 않았습니다";
    }
    if (!correctPwd) {
      return "비밀번호 양식이 잘못되었습니다";
    }
    if (!correctPwdChk) {
      return "비밀번호 확인에 실패했습니다";
    }
    if (name === "") {
      return "이름이 입력되지 않았습니다";
    }
    if (inputPhone === "") {
      return "연락처가 입력되지 않았습니다";
    }
    if (!termsAgree) {
      return "이용약관에 동의하지 않으면 가입이 불가능 합니다";
    }
    if (!priAgree) {
      return "개인정보처리방침에 동의하지 않으면 가입이 불가능 합니다";
    }
    return "완료";
  };

  const handlePasswordChange = e => {
    if (e.target.value.length < pwd.length) {
      setPwd(pwd.slice(0, -1));
      setRealPwd(realPwd.slice(0, -1));
      return false;
    }
    if (e.target.value.length > 20) {
      pwdAlert();
      return false;
    }
    if (e.target.value.length > 0) {
      const inputValue = e.target.value;
      console.log(e.target.value);
      const lastStr = inputValue.charAt(inputValue.length - 1);
      if (e.target.value.length === 1) {
        setRealPwd(lastStr);
        setPwd("*");
      } else {
        setRealPwd(realPwd + lastStr);
        const maskedValue =
          "*".repeat(inputValue.length - 1) +
          inputValue.charAt(inputValue.length - 1);
        setPwd(maskedValue);
      }
    } else {
      setRealPwd("");
      setPwd("");
    }
  };

  const handlePasswordCheckChange = e => {
    if (e.target.value.length < pwdChk.length) {
      setPwdChk(pwdChk.slice(0, -1));
      setRealPwdChk(realPwdChk.slice(0, -1));
      return false;
    }
    if (e.target.value.length > 20) {
      pwdAlert();
      return false;
    }
    if (e.target.value.length > 0) {
      const inputValue = e.target.value;
      console.log(e.target.value);
      const lastStr = inputValue.charAt(inputValue.length - 1);
      if (e.target.value.length === 1) {
        setRealPwdChk(lastStr);
        setPwdChk("*");
      } else {
        setRealPwdChk(realPwdChk + lastStr);
        const maskedValue =
          "*".repeat(inputValue.length - 1) +
          inputValue.charAt(inputValue.length - 1);
        setPwdChk(maskedValue);
      }
    } else {
      setRealPwdChk("");
      setPwdChk("");
    }
  };

  //비밀번호 양식 확인
  const testPwd = () => {
    console.log(realPwd);
    setPwdMsg("");
    setCorrectPwd(false);
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{2,}$/;
    let correct = regex.test(realPwd);
    if (correct) {
      if (realPwd.length > 7) {
        if (realPwd.length > 20) {
          setPwdMsg("비밀번호는 최대 20자 입니다");
          setCorrectPwd(false);
          return false;
        }
        setCorrectPwd(true);
        return true;
      } else {
        setPwdMsg("비밀번호는 8자 이상입니다");
        setCorrectPwd(false);
        return false;
      }
    } else {
      setPwdMsg("영어/숫자/특수문자 중 2가지 이상 포함해야 합니다");
      setCorrectPwd(false);
      return false;
    }
  };

  //비밀번호 일치 확인
  const chkPwd = () => {
    if (realPwd !== realPwdChk) {
      setCorrectPwdChk(false);
    } else {
      setCorrectPwdChk(true);
    }
  };

  //아이디 유효성 및 중복검사
  const chkId = async () => {
    setCorrectId(true);
    if (id.length < 17) {
      setDupId(true);
      const regex = /^[a-z]+([0-9]+[a-z]*)*$/;
      let correct = regex.test(id);
      if (correct) {
        await axios
          .get("/api/v1/user/dupchkid", { params: { userId: id } })
          .then(res => {
            if (res.data.code === "C000") {
              setCorrectId(true);
              setDupId(true);
            } else {
              setCorrectId(true);
              setDupId(false);
            }
          })
          .catch(e => console.log(e));
      } else {
        setCorrectId(false);
      }
    } else {
      setCorrectId(false);
    }
  };
  /*
  //이메일 및 중복검사
  const chkEmail = async () => {
    await axios
      .get("/api/v1/user/dupchkemail", { params: { email: email } })
      .then(res => console.log(res))
      .catch(e => console.log(e));
    if (id !== "thisiszero") {
      setCorrectId(true);
      setDupId(true);
    } else {
      setCorrectId(true);
      setDupId(false);
    }
  };
*/
  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };
  //성별 바꾸기 라디오버튼
  const handleRadioChange = event => {
    setGender(event.target.value);
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

  const handleAgreeAll = () => {
    if (agreeAll) {
      setAgreeAll(false);
      setTermsAgree(false);
      setPriAgree(false);
      setMarketingAgree(false);
    } else {
      setAgreeAll(true);
      setTermsAgree(true);
      setPriAgree(true);
      setMarketingAgree(true);
    }
  };

  return (
    <form onSubmit={e => join(e)}>
      <div
        id="joinArea"
        className="my-2 mx-auto p-2 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white w-full"
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="text-lg font-medium text-center">회원가입</div>
        <div className="text-xs font-medium text-right">
          <span className="text-red-500">*</span>는 필수 입력 항목입니다
        </div>
        <div
          id="id"
          className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border ${
            !correctId || (!dupId ? "lg:border-red-500" : "")
          }`}
        >
          <label
            htmlFor="inputId"
            className={`text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 ${
              correctId || !dupId ? "lg:bg-gray-100" : "lg:bg-red-100"
            } `}
          >
            <div>
              <span className="text-red-500">*</span>아이디
            </div>
          </label>
          <div className="lg:col-span-4">
            <input
              type="text"
              id="inputId"
              className={`border ${
                !correctId || (!dupId ? "lg:border-red-500" : "")
              } lg:border-0 p-2 w-full text-sm`}
              value={id}
              onChange={e => {
                setId(e.currentTarget.value);
              }}
              onBlur={e => {
                setId(e.currentTarget.value);
                if (id !== "") chkId();
              }}
              placeholder="영어와 숫자만 입력하세요"
              autoComplete="off"
            />
          </div>
        </div>
        {!correctId && (
          <div className="text-sm text-rose-500">
            아이디 양식이 잘못되었습니다. <br className="block lg:hidden" />
            확인 후 다시 입력해 주세요
          </div>
        )}
        {!dupId && (
          <div className="text-sm text-rose-500">
            사용중인 아이디 입니다. <br className="block lg:hidden" />
            확인 후 다시 입력해 주세요
          </div>
        )}
        <button
          className="block p-2 bg-gray-500 text-white"
          onClick={e => {
            e.preventDefault();
            console.log(realPwd);
            console.log(realPwdChk);
            console.log(realPwd === realPwdChk);
          }}
        >
          비번테스트
        </button>
        <div
          id="pwd"
          className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border ${
            !correctPwd ? "lg:border-red-500" : null
          }`}
        >
          <label
            htmlFor="inputPwd"
            className={`text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 ${
              correctPwd ? "lg:bg-gray-100" : "lg:bg-red-100"
            } `}
          >
            <div>
              <span className="text-red-500">*</span>비밀번호
            </div>
          </label>
          <div className="lg:col-span-4">
            <input
              type="password"
              id="inputPwd"
              length="21"
              className={`border ${
                !correctPwd ? "border-red-500" : ""
              } lg:border-0 p-2 w-full text-sm`}
              value={pwd}
              onChange={handlePasswordChange}
              onBlur={e => {
                if (realPwd !== "") testPwd();
              }}
              placeholder="8자 이상(영어/숫자/특수문자 중 2가지 이상 포함)"
              autoComplete="off"
            />
          </div>
        </div>
        {!correctPwd && <div className="text-sm text-rose-500">{pwdMsg}</div>}
        <div
          id="pwdChk"
          className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border ${
            !correctPwdChk ? "lg:border-red-500" : ""
          }`}
        >
          <label
            htmlFor="inputPwdChk"
            className={`text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 ${
              correctPwdChk ? "lg:bg-gray-100" : "lg:bg-red-100"
            } `}
          >
            비밀번호확인
          </label>
          <div className="lg:col-span-4">
            <input
              type="password"
              id="inputPwdChk"
              length="21"
              className={`border ${
                !correctPwdChk ? "border-red-500" : ""
              } lg:border-0 p-2 w-full text-sm`}
              value={pwdChk}
              onChange={handlePasswordCheckChange}
              onBlur={e => {
                if (realPwdChk !== "") chkPwd();
              }}
              placeholder="비밀번호를 한번 더 입력해 주세요"
              autoComplete="off"
            />
          </div>
        </div>
        {!correctPwdChk && (
          <div className="text-sm text-rose-500">
            비밀번호가 일치하지 않습니다 <br className="block lg:hidden" />
            확인 후 다시 입력해 주세요
          </div>
        )}
        <div
          id="name"
          className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
        >
          <label
            htmlFor="inputName"
            className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
          >
            이름
          </label>
          <div className="lg:col-span-4">
            <input
              type="text"
              id="inputName"
              className="border lg:border-0 p-2 w-full text-sm"
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              onBlur={e => setName(e.currentTarget.value)}
              placeholder="이름을 입력해 주세요"
            />
          </div>
        </div>
        <div
          id="phone"
          className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
        >
          <label
            htmlFor="inputPhone"
            className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
          >
            휴대폰번호
          </label>
          <div className="lg:col-span-4">
            <input
              type="text"
              id="inputPhone"
              className="border lg:border-0 p-2 w-full text-sm"
              value={displayPhone}
              onChange={handlePhone}
              onBlur={handlePhone}
              placeholder="숫자만 입력해 주세요 - 01012345678"
            />
          </div>
        </div>
        <div
          id="birth"
          className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
        >
          <label
            htmlFor="inputBirth"
            className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
          >
            생년월일
          </label>
          <div className="lg:col-span-4">
            <input
              type="text"
              id="inputBirth"
              className="border lg:border-0 p-2 w-full text-sm"
              value={displayBirth || ""}
              onChange={handleBirth}
              onBlur={handleBirth}
              placeholder="6자리 숫자로 입력하세요 - 990101"
            />
          </div>
        </div>
        <div
          id="mainAddr"
          className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
        >
          <label
            htmlFor="inputMainAddr"
            className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
          >
            주소
          </label>
          <div className="lg:col-span-4 grid grid-cols-3 gap-1">
            <div className="col-span-2" title={mainAddr}>
              <input
                type="text"
                id="inputMainAddr"
                className={`border lg:border-0 p-2 w-full text-sm ${
                  mainAddr === "주소찾기를 눌러주세요" ? "text-stone-500" : ""
                }`}
                value={mainAddr}
                onChange={e => setMainAddr(e.currentTarget.value)}
                onBlur={e => setMainAddr(e.currentTarget.value)}
                disabled
              />
            </div>
            <div>
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
          </div>
        </div>
        <div
          id="gender"
          className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
        >
          <div className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100">
            성별
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 divide-x border lg:border-0">
            <div className="flex items-center pl-4 border-gray-200 rounded dark:border-gray-700">
              <input
                id="bordered-radio-1"
                type="radio"
                value="F"
                name="bordered-radio"
                className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                checked={gender === "F"}
                onChange={handleRadioChange}
              />
              <label
                htmlFor="bordered-radio-1"
                className="w-full py-2 ml-2 flex flex-col justify-center text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                여자
              </label>
            </div>
            <div className="flex items-center pl-4 border-gray-200 rounded dark:border-gray-700">
              <input
                id="bordered-radio-2"
                type="radio"
                value="M"
                name="bordered-radio"
                className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                checked={gender === "M"}
                onChange={handleRadioChange}
              />
              <label
                htmlFor="bordered-radio-2"
                className="w-full py-2 ml-2 flex flex-col justify-center text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                남자
              </label>
            </div>
          </div>
        </div>
        <div
          id="email"
          className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
        >
          <label
            htmlFor="inputEmail"
            className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
          >
            이메일
          </label>
          <div className="lg:col-span-4">
            <input
              type="text"
              id="inputEmail"
              className="border lg:border-0 p-2 w-full text-sm"
              value={email}
              onChange={e => setEmail(e.currentTarget.value)}
              onBlur={e => {
                setEmail(e.currentTarget.value);
              }}
              placeholder="이메일 주소를 입력하세요"
              disabled={isSocialLogin}
            />
          </div>
        </div>
        <div className="border grid grid-cols-1 rounded px-2">
          <div id="allAgree" className="grid grid-cols-7 gap-1">
            <label
              htmlFor="agreeAll"
              className="text-sm font-neoextra text-left flex flex-col justify-center pl-2 py-2 col-span-6"
            >
              약관 전체동의 (선택포함)
            </label>
            <div className="flex flex-col justify-center">
              <input
                type="checkbox"
                id="agreeAll"
                onChange={handleAgreeAll}
                checked={agreeAll}
              />
            </div>
          </div>
        </div>
        <div id="agree" className="p-2 bg-gray-50 grid grid-cols-1 rounded">
          <div id="terms" className="grid grid-cols-7 gap-1">
            <label
              htmlFor="agreeTerms"
              className="text-sm text-left flex flex-col justify-center pl-2 py-2 col-span-5 text-stone-700"
            >
              이용약관에 동의합니다 (필수)
            </label>
            <div>
              <button
                className="text-blue-500 hover:text-violet-700 p-2 text-xs w-full"
                onClick={e => {
                  e.preventDefault();
                  setModalCount(2);
                  setModalOn(true);
                }}
              >
                상세보기
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <input
                type="checkbox"
                id="agreeTerms"
                onChange={e => setTermsAgree(!termsAgree)}
                checked={termsAgree}
              />
            </div>
          </div>
          <div id="private" className="grid grid-cols-7 gap-1">
            <label
              htmlFor="agreePrivate"
              className="text-sm text-left flex flex-col justify-center pl-2 py-2 col-span-5 text-stone-700"
            >
              개인정보 수집 및 이용에 동의합니다 (필수)
            </label>
            <div>
              <button
                className="text-blue-500 hover:text-violet-700 p-2 text-xs w-full"
                onClick={e => {
                  e.preventDefault();
                  setModalCount(4);
                  setModalOn(true);
                }}
              >
                상세보기
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <input
                type="checkbox"
                id="agreePrivate"
                onChange={e => setPriAgree(!priAgree)}
                checked={priAgree}
              />
            </div>
          </div>
          <div id="marketing" className="grid grid-cols-7 gap-1">
            <label
              htmlFor="agreeMarketing"
              className="text-sm text-left flex flex-col justify-center pl-2 py-2 col-span-5 text-stone-700"
            >
              마케팅 및 이벤트 정보수신에 동의합니다 (선택)
            </label>

            <div>
              <button
                className="text-blue-500 hover:text-violet-700 p-2 text-xs w-full"
                onClick={e => {
                  e.preventDefault();
                  setModalCount(5);
                  setModalOn(true);
                }}
              >
                상세보기
              </button>
            </div>
            <div className="flex flex-col justify-center">
              <input
                type="checkbox"
                id="agreeMarketing"
                onChange={e => setMarketingAgree(!marketingAgree)}
                checked={marketingAgree}
              />
            </div>
          </div>
        </div>
        {!isSocialLogin && (
          <div className="text-center text-sm text-gray-500 border-b pb-2">
            <Link
              to="/login"
              className="transition duration-100 hover:scale-105"
            >
              이미 가입하셨다면? 여기를 눌러 <br className="block lg:hidden" />
              <span className="text-emerald-500 border-b">로그인</span>을 진행해
              주세요
            </Link>
          </div>
        )}
        <div className="w-full">
          <button
            className="transition duration-100 w-full bg-blue-500 hover:bg-blue-700 p-2 text-white rounded hover:animate-wiggle"
            type="submit"
          >
            회원가입
          </button>
        </div>
      </div>
      <div id="popupDom" className={isPopupOpen ? "popupModal" : ""}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode onClose={closePostCode} setMainAddr={setMainAddr} />
          </PopupDom>
        )}
      </div>
      {modalOn ? (
        <Modal
          modalCount={modalCount}
          setModalOn={setModalOn}
          setModalCount={setModalCount}
        />
      ) : null}
    </form>
  );
}

export default JoinBack;
