import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { clearUser, refreshPoint } from "../../Reducer/userSlice";

import { BiUser } from "react-icons/bi";

import axios from "axios";

function UserInfo() {
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  let navi = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  useEffect(() => {
    console.log(user);
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
        if (user.admin) {
          return true;
        } else {
          alert("포인트를 불러올 수 없습니다. 다시 로그인 해주세요");
          logout();
        }
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
    <div className="text-right text-sm py-2 text-gray-500 flex flex-col justify-center">
      <div className="hidden xl:block">
        {!isLogin ? (
          <>
            <Link to="/login" className="hover:text-indigo-500">
              로그인
            </Link>{" "}
            |{" "}
            <Link to="/cert" className="hover:text-indigo-500">
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
                <span className="font-medium text-black">{user.userName} </span>
                님 안녕하세요 | {user.point.toLocaleString()}p 보유중 |{" "}
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
            <button className="hover:text-indigo-500" onClick={e => logout()}>
              로그아웃
            </button>
          </>
        )}
      </div>
      <div className="w-10 h-10 flex flex-col justify-center relative xl:hidden">
        <button
          className={`${isOpen ? "text-rose-800" : null}`}
          onClick={e => {
            setIsOpen(!isOpen);
          }}
        >
          <BiUser size={30} />
        </button>
      </div>
      {isOpen ? (
        <div className="fixed top-20 left-2 right-2  bg-white border xl:hidden p-2 drop-shadow-lg text-center">
          {!isLogin ? (
            <div className="grid grid-cols-2 divide-x">
              <Link to="/login" className="hover:text-indigo-500">
                로그인
              </Link>
              <Link to="/cert" className="hover:text-indigo-500">
                회원가입
              </Link>
            </div>
          ) : (
            <>
              {isAdmin ? (
                <div className="grid grid-cols-3 divide-x">
                  <div className="col-span-2">
                    <span className="font-medium text-black">
                      {user.userName}{" "}
                    </span>
                    관리자님 안녕하세요
                  </div>
                  <Link to="/admin" className="hover:text-indigo-500">
                    관리자페이지
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-3 divide-x">
                  <div className="col-span-3">
                    <span className="font-medium text-black">
                      {user.userName}{" "}
                    </span>
                    님 안녕하세요
                  </div>
                  <div>{user.point.toLocaleString()}p 보유중</div>

                  <Link to="/coupon" className="hover:text-indigo-500">
                    보유쿠폰
                  </Link>
                  <Link to="/mypage" className="hover:text-indigo-500">
                    정보수정
                  </Link>
                </div>
              )}
              <button className="hover:text-indigo-500" onClick={e => logout()}>
                로그아웃
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default UserInfo;
