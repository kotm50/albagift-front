import React, { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUser, getNewToken } from "../../../Reducer/userSlice";

import queryString from "query-string";

import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import PopupDom from "../../Kakao/PopupDom";
import PopupPostCode from "../../Kakao/PopupPostCode";
import NewPwd from "./NewPwd";
import AgreeModal from "./AgreeModal";
import AlertModal from "../../Layout/AlertModal";

import { FaLock, FaMapMarkerAlt, FaBell, FaBellSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiKakaoTalkFill } from "react-icons/ri";
import { logoutAlert } from "../../LogoutUtil";
import EmailModal from "./EmailModal";
import Marketing from "./Marketing";

function EditUser(props) {
  const user = useSelector(state => state.user);
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const code = parsed.code || "";
  const dispatch = useDispatch();
  const navi = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [personalModal, setPersonalModal] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [marketingModal, setMarketingModal] = useState(false);
  const [domain, setDomain] = useState("");
  useEffect(() => {
    let domain = extractDomain();
    setDomain(domain);
    if (code !== "") {
      kakaoLoginCheck(code);
    } else {
      getUserInfo();
    }
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    getUserInfo();
    //eslint-disable-next-line
  }, [user.accessToken]);

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
        if (res.headers.authorization) {
          dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
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
        if (res.headers.authorization === user.accessToken) {
          getUserInfo();
        }
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
      .then(async res => {
        if (res.headers.authorization) {
          await dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        if (res.data.code === "C000") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"완료"} // 제목
                  message={"연동이 완료되었습니다"} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                  doIt={reload}
                />
              );
            },
          });
        } else {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"결과"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                  doIt={reload}
                />
              );
            },
          });
        }
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };
  const reload = () => {
    let mypageURL = `${domain}/mypage/edit`;
    window.location.href = mypageURL;
  };
  const getUserInfo = async () => {
    await axios
      .post("/api/v1/user/myinfo", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.headers.authorization) {
          await dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        if (res.data.code === "E999") {
          logoutAlert(
            null,
            null,
            dispatch,
            clearUser,
            navi,
            user,
            res.data.message
          );
          return false;
        }
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
  const [agreeYn, setAgreeYn] = useState(false);

  const [beforeValue, setBeforeValue] = useState({});

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    setId(userInfo.userId);
    setName(userInfo.userName);
    setPhone(getPhone(userInfo.phone || "01000000000"));
    setBirth(getBirth(userInfo.birth || "000000", ".", 2));
    setMainAddr(
      modifyAddress(userInfo.mainAddr || "서울특별시 중구 세종대로 110")
    );
    if (userInfo.email) {
      setEmail(modifyEmail(userInfo.email));
    } else {
      setEmail("이메일 미등록");
    }
    setBeforeValue({
      mainAddr: userInfo.mainAddr,
      email: userInfo.email,
    });
    setSocialType(userInfo.socialType);
    setAgreeYn(userInfo.agreeYn || false);
  }, [userInfo]);

  //생일변환
  const getBirth = (str, separator, interval) => {
    let result = "";
    for (let i = 0; i < str.length; i += interval) {
      let chunk = str.substring(i, i + interval);
      result += chunk + separator;
    }
    // 맨 마지막의 separator를 제거하여 반환합니다.
    return result.slice(0, -1);
  };

  //휴대폰변환
  const getPhone = str => {
    if (str.length !== 11) {
      // 문자열이 11자리가 아닌 경우에 대한 예외 처리
      return "Invalid input";
    }

    const firstPart = str.substring(0, 3); // 1, 2, 3번째 문자열
    const secondPart = "****"; // 4, 5, 6, 7번째 문자열은 '*'로 대체
    const thirdPart = str.substring(7, 11); // 8, 9, 10, 11번째 문자열

    // 조합하여 원하는 형식의 문자열을 만듭니다.
    const transformedString = `${firstPart}-${secondPart}-${thirdPart}`;
    return transformedString;
  };

  //이메일변환
  const modifyEmail = email => {
    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");

    if (atIndex === -1 || dotIndex === -1) {
      // '@' 또는 '.'이 없는 경우에 대한 예외 처리
      return "Invalid email";
    }

    const idPart = email.substring(0, 2); // 이메일 id 첫 2글자
    const domainPart = email.substring(atIndex + 1, atIndex + 2); // 도메인 첫 1글자
    const modifiedId = `${idPart}*****`;
    const modifiedDomain = `${domainPart}*****`;

    // 조합하여 원하는 형식의 이메일을 만듭니다.
    const modifiedEmail = `${modifiedId}@${modifiedDomain}.com`;
    return modifiedEmail;
  };

  //주소지 변환
  const modifyAddress = address => {
    const addressArray = address.split(" ");
    if (addressArray.length < 4) {
      // 주소지가 너무 짧은 경우에 대한 예외 처리
      return "Invalid address";
    }

    const firstPart = addressArray[0] + " " + addressArray[1]; // 첫번째와 두번째 부분
    const thirdPart =
      addressArray[2].endsWith("로") ||
      addressArray[2].endsWith("동") ||
      addressArray[2].endsWith("리")
        ? ""
        : addressArray[2]; // 세번째 부분

    // 조합하여 원하는 형식의 주소를 만듭니다.
    const modifiedAddress = `${firstPart} ${thirdPart}`;
    return modifiedAddress;
  };
  const editIt = async (url, type, value) => {
    let data;
    let bValue = beforeValue;
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

      data = {
        email: value,
      };
      bValue.email = email;
    }

    if (type === "agree") {
      data = {
        agreeYn: value,
      };
      bValue.agreeYn = agreeYn;
    }
    axios
      .patch(url, data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        if (res.headers.authorization) {
          dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        if (res.data.code === "C000") {
          if (type === "password") {
            logoutAlert2();
          } else if (type === "agree") {
            let resultMessage;
            if (value === "Y") {
              resultMessage = `처리결과 : 수신 동의\n처리일시 : ${res.data.responseDate}`;
            } else {
              resultMessage = `처리결과 : 수신 비동의\n처리일시 : ${res.data.responseDate}`;
            }
            confirmAlert({
              customUI: ({ onClose }) => {
                return (
                  <AlertModal
                    onClose={onClose} // 닫기
                    title={"완료"} // 제목
                    message={resultMessage} // 내용
                    type={"alert"} // 타입 confirm, alert
                    yes={"확인"} // 확인버튼 제목
                  />
                );
              },
            });
            if (res.headers.authorization === user.accessToken) {
              getUserInfo();
            }
            setBeforeValue(bValue);
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
            if (res.headers.authorization === user.accessToken) {
              getUserInfo();
            }
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

  const logoutAlert2 = () => {
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
    setPersonalModal(false);
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
        if (res.headers.authorization) {
          dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
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
                  message={res.data.message} // 내용
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

  return (
    <>
      <div
        id="editArea"
        className="my-2 mx-auto p-2 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white w-full"
      >
        <div className="grid grid-cols-1 divide-y">
          <div
            id="id"
            className="grid grid-cols-7 gap-x-2 text-sm xl:text-base"
          >
            <div className="col-span-5 flex flex-col justify-center gap-y-2 py-4">
              <div className="text-xl font-neoheavy text-left pl-2">
                {id}
                <span className="text-base font-neobold"> ({name})님</span>
              </div>
              <div className="text-sm text-left pl-2">{birth}</div>
              <div className="text-sm text-left pl-2">{phone}</div>
            </div>
            <div className="flex flex-col justify-center col-span-2">
              <button
                className="p-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                onClick={e => setPersonalModal(true)}
              >
                수정
              </button>
            </div>
          </div>
          <div
            id="pwd"
            className="grid grid-cols-7 gap-x-2 text-sm xl:text-base"
          >
            <div className="col-span-5 px-2 py-4">
              <FaLock className="inline" /> 비밀번호
            </div>
            <div className="flex flex-col justify-center col-span-2">
              <button
                className="p-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                onClick={e => setPwdModal(true)}
              >
                수정
              </button>
            </div>
          </div>
          <div
            id="mainAddr"
            className="grid grid-cols-7 gap-x-2 text-sm xl:text-base"
          >
            <div className="col-span-5 px-2 py-4">
              <FaMapMarkerAlt className="inline" /> {mainAddr}
            </div>
            <div className="flex flex-col justify-center col-span-2">
              <button
                className="p-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                onClick={e => openPostCode()}
              >
                수정
              </button>
            </div>
          </div>
          <div
            id="email"
            className="grid grid-cols-7 gap-x-2 text-sm xl:text-base"
          >
            <div className="col-span-5 px-2 py-4">
              <MdEmail className="inline" /> {email}
            </div>
            <div className="flex flex-col justify-center col-span-2">
              <button
                className="p-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                onClick={e => setEmailModal(true)}
              >
                수정
              </button>
            </div>
          </div>

          <div
            id="kakao"
            className="grid grid-cols-7 gap-x-2 text-sm xl:text-base"
          >
            <div className="col-span-5 px-2 py-4">
              <RiKakaoTalkFill className="inline" />{" "}
              {socialType ? "연동중" : "미연동"}
            </div>
            {socialType ? (
              <div className="flex flex-col justify-center col-span-2">
                <button
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                  onClick={deleteKakao}
                >
                  해제
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center col-span-2">
                <button
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                  onClick={kakaoLogin}
                >
                  연동
                </button>
              </div>
            )}
          </div>
          <div
            id="marketing"
            className="grid grid-cols-7 gap-x-2 text-sm xl:text-base"
          >
            {userInfo.agreeYn === "Y" ? (
              <>
                <div className="col-span-5 px-2 py-4">
                  <FaBell className="inline" /> 광고성 정보 수신 동의
                </div>
                <div className="flex flex-col justify-center col-span-2">
                  <button
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                    onClick={e =>
                      editIt("/api/v1/user/myinfo/editagree", "agree", "N")
                    }
                  >
                    동의취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className="col-span-7 xl:col-span-5 px-2 py-4 hover:text-orange-500 hover:cursor-pointer"
                  onClick={e => setMarketingModal(true)}
                >
                  <FaBellSlash className="inline" /> 알바선물의 다양한 정보를
                  받아보세요!
                </div>
                <div className="flex-col justify-center col-span-2 hidden xl:flex">
                  <button
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-sm rounded"
                    onClick={e => setMarketingModal(true)}
                  >
                    정보받기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {personalModal ? (
          <AgreeModal doCert={doCert} setPersonalModal={setPersonalModal} />
        ) : null}
        {pwdModal ? (
          <NewPwd setPwdModal={setPwdModal} logoutAlert={logoutAlert2} />
        ) : null}
        {emailModal ? (
          <EmailModal setEmailModal={setEmailModal} editIt={editIt} />
        ) : null}
        {marketingModal ? (
          <Marketing
            setMarketingModal={setMarketingModal}
            editIt={editIt}
            agreeYn={agreeYn}
          />
        ) : null}
      </div>

      <div id="cancelArea" className="w-full mt-5">
        <Link
          to="/mypage/cancel"
          className="transition p-2 text-xs hover:text-stone-500"
        >
          회원탈퇴
        </Link>
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
    </>
  );
}

export default EditUser;
