import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { useDispatch } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

function Login() {
  let navi = useNavigate();
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const login = async e => {
    e.preventDefault();
    const data = {
      userId: id,
      userPwd: pwd,
    };
    await axios
      .post("/api/v1/user/login", data)
      .then(res => {
        console.log(res.data.user.userName);
        const token = res.headers.authorization;
        if (res.data.code === "C000") {
          dispatch(
            loginUser({
              userId: id,
              userName: res.data.user.userName,
              accessToken: token,
              lastLogin: new Date(),
              point: res.data.user.point,
            })
          );
          chkAdmin(token, res.data.user);
        }
      })
      .catch(e => {
        console.log(e);
        alert("로그인에 실패했습니다\n아이디 또는 비밀번호를 확인해 주세요");
      });
  };

  const chkAdmin = async (token, user) => {
    await axios
      .post("/api/v1/user/rolechk", null, {
        headers: { Authorization: token },
      })
      .then(res => {
        if (res.data.code === "A100") {
          dispatch(
            loginUser({
              userId: id,
              accessToken: token,
              lastLogin: new Date(),
              point: user.point,
              admin: true,
            })
          );
          alert("관리자로 로그인 합니다");
          navi("/");
        } else {
          dispatch(
            loginUser({
              userId: id,
              accessToken: token,
              lastLogin: new Date(),
              point: user.point,
              admin: false,
            })
          );
          alert("로그인 완료");
          navi("/");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <form onSubmit={e => login(e)}>
      <div
        id="loginArea"
        className="my-2 mx-auto p-2 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white xl:fixed xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 w-full"
      >
        <div className="text-lg font-medium text-center">로그인</div>
        <div
          id="id"
          className="grid grid-cols-1 xl:grid-cols-5 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputId"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            아이디
          </label>
          <div className="xl:col-span-4">
            <input
              type="text"
              id="inputId"
              className="border xl:border-0 p-2 w-full text-sm"
              value={id}
              onChange={e => setId(e.currentTarget.value)}
              onBlur={e => setId(e.currentTarget.value)}
              autoComplete="on"
            />
          </div>
        </div>
        <div
          id="pwd"
          className="grid grid-cols-1 xl:grid-cols-5 xl:divide-x xl:border"
        >
          <label
            htmlFor="inputPwd"
            className="text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 xl:bg-gray-100"
          >
            비밀번호
          </label>
          <div className="xl:col-span-4">
            <input
              type="password"
              id="inputPwd"
              className="border xl:border-0 p-2 w-full text-sm"
              value={pwd}
              onChange={e => setPwd(e.currentTarget.value)}
              onBlur={e => setPwd(e.currentTarget.value)}
              autoComplete="on"
            />
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 border-b pb-2">
          <Link to="/join">
            처음이신가요? 여기를 눌러 <br className="block xl:hidden" />
            <span className="text-blue-500 border-b">회원가입</span>을 진행해
            주세요
          </Link>
        </div>
        <div className="w-full">
          <button
            className="transition duration-100 w-full bg-emerald-500 hover:bg-emerald-700 p-2 text-white rounded hover:animate-wiggle"
            type="submit"
          >
            로그인
          </button>
        </div>
      </div>
    </form>
  );
}

export default Login;
