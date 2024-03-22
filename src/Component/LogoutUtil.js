import axios from "axios";
import React from "react";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useNavigate } from "react-router-dom";

export const logoutAlert = (
  onClose,
  logout,
  dispatch,
  clearUser,
  navi,
  user,
  message
) => {
  forceLogout(dispatch, clearUser, navi, user);
  return confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div id="alertmodal" className="max-w-screen p-4 bg-white border">
          <div className="px-4 py-10 bg-white border grid grid-cols-1 gap-y-3 border-rose-500">
            <h1 className="font-neoextra text-lg text-rose-500 text-center">
              로그아웃
            </h1>
            <p className="text-center">{message || "로그아웃 되었습니다"}</p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  onClose();
                }}
                className="border border-sky-500 bg-sky-500 text-white py-2 px-4"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      );
    },
  });
};

export const forceLogout = async (dispatch, clearUser, navi, user) => {
  await axios
    .post("/api/v1/user/logout", null, {
      headers: { Authorization: user.accessToken },
    })
    .then(res => {
      dispatch(clearUser());
      localStorage.setItem("userCleared", Date.now()); // 로컬 스토리지에 마킹
      navi("/login");
    })
    .catch(e => {
      console.log(e);
    });
};

export const logout = async (dispatch, clearUser, navi, user) => {
  await axios
    .post("/api/v1/user/logout", null, {
      headers: { Authorization: user.accessToken },
    })
    .then(res => {
      dispatch(clearUser());
      localStorage.setItem("userCleared", Date.now()); // 로컬 스토리지에 마킹
      navi("/");
    })
    .catch(e => {
      console.log(e);
    });
};

const LogoutAlert2 = () => {
  const navi = useNavigate();
  alert("세션 만료, 다시 로그인 후 이용해 주세요");
  navi("/");
};

export default LogoutAlert2;
