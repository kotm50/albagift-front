import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearUser, getNewToken, refreshPoint } from "../../Reducer/userSlice";
import { /* logoutAlert, */ logout } from "../LogoutUtil";
import axios from "axios";
import BeforeJoin from "./BeforeJoin";

function UserInformation() {
  const location = useLocation();
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);

  useEffect(() => {
    // const now = new Date();
    if (user.userId !== "") {
      // const diffTime = Math.floor((now - user.lastLogin) / 1000 / 60);
      refreshPoints();
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
        if (res.headers.authorization) {
          if (res.headers.authorization !== user.accessToken) {
            dispatch(
              getNewToken({
                accessToken: res.headers.authorization,
              })
            );
          }
        }
      })
      .catch(e => {
        console.log(e);
        if (user.admin) {
          return true;
        } else {
          return false;
          /*
          logoutAlert(
            null,
            logout,
            dispatch,
            clearUser,
            navi,
            user,
            "오류가 발생했습니다. 다시 로그인 해주세요"
          );
          */
        }
      });
  };

  return (
    <>
      {user.userId === "" ? (
        <>
          <div className="grid grid-cols-1 gap-y-2 xl:h-40">
            <div className="text-center mt-2 xl:mb-2">
              로그인하여 알바선물의
              <br className="xl:hidden" /> 다양한 혜택을 누려보세요
            </div>
            <Link
              to="/login"
              className="block text-center p-3 text-white bg-teal-500 hover:bg-teal-700 hover:animate-wiggle rounded"
            >
              알바선물 로그인 하기
            </Link>
            <div className="w-11/12 xl:w-3/4 mx-auto grid grid-cols-3 divide-x-2 my-2">
              <Link
                to="/beforejoin"
                className="text-sm text-center text-gray-500 hover:text-blue-500 flex flex-col justify-center"
                onClick={e => {
                  e.preventDefault();
                  setModal(true);
                }}
              >
                회원가입
              </Link>
              <Link
                to="/cert?gubun=find"
                className="text-sm text-center text-gray-500 hover:text-blue-500 flex flex-col justify-center"
              >
                아이디 찾기
              </Link>
              <Link
                to="/findpwd"
                className="text-sm text-center text-gray-500 hover:text-blue-500 flex flex-col justify-center"
              >
                비밀번호 찾기
              </Link>
            </div>

            {modal ? <BeforeJoin setModal={setModal} /> : null}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-y-2 xl:h-40">
          <div className="text-center mt-2 xl:mb-2 grid grid-cols-2 xl:grid-cols-5 text-sm xl:text-base">
            <div className="font-neobold p-2 xl:col-span-2">
              안녕하세요 <span className="font-neoextra">{user.userName}</span>
              님
            </div>
            <div className="font-neobold p-2 xl:col-span-2">
              💎{" "}
              <span
                className="font-neoextra hover:text-sky-500 hover:cursor-pointer"
                onClick={e => navi("/mypage/pointhistory")}
              >
                {Number(user.point).toLocaleString()}
              </span>{" "}
              P
            </div>
            <button
              className="font-neobold p-2 border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-700 hover:bg-gray-100 rounded xl:col-span-1 col-span-2"
              onClick={e => logout(dispatch, clearUser, navi, user)}
            >
              로그아웃
            </button>
          </div>
          {user.admin ? (
            <>
              <button
                className="block text-center p-2 text-white bg-blue-500 hover:bg-blue-700 hover:animate-wiggle rounded"
                onClick={e => navi("/admin")}
              >
                관리자 페이지로
              </button>
              <div className="block text-center p-2 text-white opacity-0"></div>
            </>
          ) : (
            <>
              {" "}
              <button
                className="block text-center p-2 text-white bg-blue-500 hover:bg-blue-700 hover:animate-wiggle rounded"
                onClick={e => navi("/mypage/coupon")}
              >
                보유 쿠폰 확인하기
              </button>
              <button
                className="block text-center p-2 border border-blue-500 hover:text-blue-700 hover:border-blue-700 hover:animate-wiggle rounded mb-3 xl:mb-0"
                onClick={e => navi("/mypage")}
              >
                마이페이지
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default UserInformation;
