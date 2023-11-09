import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css
import AlertModal from "../Layout/AlertModal";

function Collect() {
  const navi = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (
      user.accessToken === "" ||
      user.accessToken === undefined ||
      user.accessToken === null
    ) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"인증실패"} // 제목
              message={"관리자로 로그인 해주세요"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
              doIt={goLogin} // 확인시 실행할 함수
            />
          );
        },
      });
    } else {
      chkAdmin(user);
    }
    //eslint-disable-next-line
  }, [location]);

  const goLogin = () => [navi("/login", { state: { test: "yes" } })];

  const chkAdmin = async user => {
    await axios
      .post("/api/v1/user/rolechk", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code !== "A100") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"오류"} // 제목
                  message={
                    "관리자 전용 페이지입니다.\n관리자 계정으로 로그인 하세요"
                  } // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                  doIt={goLogin} // 확인시 실행할 함수
                />
              );
            },
          });
        } else {
          setLoaded(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      <div className="container mx-auto text-center text-3xl mt-10">
        수금전산 테스트 페이지
      </div>
      {loaded ? (
        <Outlet />
      ) : (
        <div className="container mx-auto mt-[200px]">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-rose-500 mx-auto mb-3"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <div className="text-center">잠시만 기다려 주세요</div>
        </div>
      )}
    </>
  );
}

export default Collect;
