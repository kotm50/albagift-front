import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import { clearUser } from "../../../Reducer/userSlice";

import { FaTicketAlt } from "react-icons/fa";
import AlertModal from "../../Layout/AlertModal";

import dompurify from "dompurify";

function Cancel() {
  const sanitizer = dompurify.sanitize;
  const navi = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [point, setPoint] = useState(0);
  const [isErr, setIsErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [agreePls, setAgreePls] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setAgreePls(false);
    setIsErr(false);
    setId(user.userId);
    setPoint(Number(user.point));
    //eslint-disable-next-line
  }, [location]);

  const cancelConfirm = e => {
    e.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <AlertModal
            onClose={onClose} // 닫기
            title={"확인"} // 제목
            message={"탈퇴를 진행하실 건가요?"} // 내용
            type={"confirm"} // 타입 confirm, alert
            yes={"계속이용하기"} // 확인버튼 제목
            no={"탈퇴진행하기"} // 취소버튼 제목
            doIt={cancelCancel} // 확인시 실행할 함수
            doNot={cancelIt} // 취소시 실행할 함수
          />
        );
      },
    });
  };

  const cancelCancel = () => {
    navi("/mypage");
  };

  const cancelIt = async e => {
    setAgreePls(false);
    setIsErr(false);
    if (!agree) {
      setErrMsg("위 내용을 읽고 동의하시면 체크해주세요");
      setAgreePls(true);
      return false;
    }
    const data = {
      userPwd: pwd,
    };
    await axios
      .post("/api/v1/user/myinfo/pwdchk", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          deleteId();
        } else {
          setErrMessage(res.data.message);
          setIsErr(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteId = async () => {
    await axios
      .patch("/api/v1/user/myinfo/delete", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.data.code === "C000") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"확인"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                  doIt={logout} // 확인시 실행할 함수
                />
              );
            },
          });
        } else {
          setErrMessage(res.data.message);
          setIsErr(true);
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
        navi("/");
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <form onSubmit={e => cancelConfirm(e)}>
      <div
        id="cancelArea"
        className="my-2 mx-auto p-2 lg:p-10 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white w-full"
      >
        <div className="text-base font-neobold text-left">
          <div className="font-neoextra text-xl">
            {id || "무명회원"}님
            <br /> 탈퇴 전에 확인해 주세요
          </div>
          <div className="bg-gray-100 mt-2 p-3 text-base">
            회원탈퇴를 진행하시면 <br className="lg:hidden" />
            <span className="text-blue-500 font-neoextra">30일의 유예기간</span>
            이 부여되며 <br />
            유예기간 경과시 <br className="lg:hidden" />
            아래 항목이 삭제됩니다.
            <div className="p-4 bg-white rounded-lg my-2 text-sm">
              <ol className="flex flex-col gap-y-3 list-decimal pl-4">
                <li>
                  잔여포인트는{" "}
                  <span className="text-red-500 font-neoextra">
                    즉시 소멸됩니다.
                  </span>
                  <Link to="/list" className="text-xs hidden lg:inline">
                    (사용하러 가기)
                  </Link>
                  <div className="lg:w-1/2 mx-auto my-2 p-2 border border-sky-500 text-center">
                    잔여 포인트
                    <br />
                    <span
                      className={`${
                        point > 10000
                          ? "text-2xl"
                          : point > 4000
                          ? "text-xl"
                          : "text-lg"
                      } font-neoheavy text-sky-500`}
                    >
                      {point.toLocaleString()}{" "}
                    </span>
                    p
                    <br />
                    <Link
                      to="/list"
                      className="text-xs lg:hidden inline-block p-2 bg-sky-50"
                    >
                      포인트 사용하기
                    </Link>
                  </div>
                </li>
                <li>
                  보유쿠폰은 쿠폰 이미지를 별도 저장하지 않으면{" "}
                  <span className="text-red-500 font-neoextra">
                    열람이 불가합니다.
                  </span>
                  <br />
                  아래 버튼을 눌러 보유쿠폰을 확인하고 저장하세요.
                  <Link
                    to="/mypage/coupon"
                    className="block lg:w-1/2 mx-auto my-2 p-2 border border-sky-500 hover:border-sky-700 hover:bg-sky-100 text-center"
                  >
                    <FaTicketAlt className="inline" size={20} /> 보유쿠폰확인
                  </Link>
                  *보유쿠폰을 저장하더라도
                  <br className="lg:hidden" /> 유효기간이 경과되면{" "}
                  <br className="lg:hidden" />{" "}
                  <span className="font-neoextra">사용이 불가능 합니다</span>
                </li>
                <li>
                  탈퇴 후 1년간 재가입을 진행해도 프로모션 포인트는{" "}
                  <span className="text-red-500 font-neoextra">
                    지급되지 않습니다
                  </span>
                </li>
                <li>
                  소비자보호에 관한 법령에 의거 아래 개인정보는 1년간 보관 후
                  파기됩니다.
                  <ul className="ml-2 list-disc">
                    <li>포인트 지급 및 사용 내역</li>
                    <li>포인트 지급 신청 내역</li>
                    <li>불만 또는 분쟁처리에 관한 기록</li>
                    <li>부정이용(포인트 부정수급 등) 기록</li>
                  </ul>
                </li>
              </ol>
            </div>
            유예기간 중 로그인을 하시면{" "}
            <span className="text-blue-500 font-neoextra">
              탈퇴를 취소하실 수 있습니다.
            </span>
          </div>
        </div>
        <div
          id="agree"
          className={`grid grid-cols-7 gap-1 ${agreePls ? "bg-rose-50" : null}`}
        >
          <label
            htmlFor="agree"
            className="text-sm text-left flex flex-col justify-center pl-2 py-2 col-span-6 text-stone-700"
          >
            위 내용을 숙지하였으며 탈퇴를 진행합니다
          </label>
          <div className="flex flex-col justify-center">
            <input
              type="checkbox"
              id="agree"
              onChange={e => {
                setAgree(!agree);
                setAgreePls(false);
              }}
              checked={agree}
            />
          </div>
        </div>
        {agreePls && (
          <div className="text-center text-sm pb-2 text-rose-500">{errMsg}</div>
        )}
        <div
          id="pwd"
          className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border ${
            isErr ? "border-rose-500" : null
          }`}
        >
          <label
            htmlFor="inputPwd"
            className={`text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100 ${
              isErr ? "lg:bg-rose-100 text-rose-500 lg:text-black" : null
            }`}
          >
            비밀번호
          </label>
          <div className="lg:col-span-4">
            <input
              type="password"
              id="inputPwd"
              className={`border lg:border-0 p-2 w-full text-sm ${
                isErr ? "border-rose-500" : null
              }`}
              value={pwd}
              onChange={e => setPwd(e.currentTarget.value)}
              onBlur={e => setPwd(e.currentTarget.value)}
              autoComplete="on"
            />
          </div>
        </div>
        {isErr && (
          <p
            className="text-center text-sm pb-2 text-rose-500"
            dangerouslySetInnerHTML={{
              __html: sanitizer(errMessage).replace(/\n/g, "<br>"),
            }}
          />
        )}
        <div className="w-full flex flex-row justify-center gap-1">
          <Link
            to="/"
            className="transition duration-100 w-full text-center bg-blue-500 hover:bg-blue-700 border border-blue-500 hover:border-blue-700 p-2 text-white rounded"
          >
            서비스 계속 이용
          </Link>
          <button
            className="transition duration-100 w-full border border-gray-500 hover:border-gray-700 p-2 text-gray-500 hover:text-gray-700 rounded"
            type="submit"
          >
            회원 탈퇴하기
          </button>
        </div>
      </div>
    </form>
  );
}

export default Cancel;
