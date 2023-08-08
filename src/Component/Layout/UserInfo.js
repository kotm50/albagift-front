import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUser, refreshPoint } from "../../Reducer/userSlice";

import axios from "axios";

function UserInfo() {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  let navi = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  useEffect(() => {
    // const now = new Date();
    if (user.userId !== "") {
      // const diffTime = Math.floor((now - user.lastLogin) / 1000 / 60);
      refreshPoints();
      setIsLogin(true);
      if (user.admin) {
        setIsAdmin(true);
      }
    }
    //eslint-disable-next-line
  }, [location]);

  const refreshPoints = async () => {
    await axios
      .post("/api/v1/user/get/point", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.user.point !== user.point) {
          dispatch(
            refreshPoint({
              point: res.data.user.point,
            })
          );
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
        alert("이용해 주셔서 감사합니다 ^^");
      })
      .catch(e => {
        console.log(e);
      });
    dispatch(clearUser());
    setIsLogin(false);
    navi("/");
  };
  return (
    <div className="text-right text-sm p-2 text-gray-500">
      {!isLogin ? (
        <>
          <Link to="/login" className="hover:text-indigo-500">
            로그인
          </Link>{" "}
          |{" "}
          <Link to="/join" className="hover:text-indigo-500">
            회원가입
          </Link>
        </>
      ) : (
        <>
          {isAdmin ? (
            <>
              {" "}
              <span className="font-medium text-black">{user.userName} </span>
              관리자님 안녕하세요 |
              <Link to="/admin" className="hover:text-indigo-500">
                관리자페이지
              </Link>{" "}
              |{" "}
            </>
          ) : (
            <>
              <span className="font-medium text-black">{user.userName} </span>님
              안녕하세요 | {user.point}p 보유중 |{" "}
              <Link to="/coupon" className="hover:text-indigo-500">
                보유쿠폰
              </Link>{" "}
              |{" "}
              <Link to="/mypage" className="hover:text-indigo-500">
                정보수정
              </Link>{" "}
              |{" "}
            </>
          )}
          <button
            to="/mypage"
            className="hover:text-indigo-500"
            onClick={e => logout()}
          >
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}

export default UserInfo;
