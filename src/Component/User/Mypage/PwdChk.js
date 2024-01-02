import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { getNewToken } from "../../../Reducer/userSlice";

function PwdChk() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    setId(user.userId);
    setDomain(window.location.href.split("/").slice(0, 3).join("/"));
    //eslint-disable-next-line
  }, []);
  const identity = async e => {
    e.preventDefault();
    const data = {
      userPwd: pwd,
    };
    await axios
      .post("/api/v1/user/myinfo/pwdchk", data, {
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
          let mypageURL = `${domain}/mypage/edit`;
          window.location.href = mypageURL;
        } else {
          setErrMessage(res.data.message);
          setIsErr(true);
          setPwd("");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      <form onSubmit={e => identity(e)}>
        <div
          id="chkArea"
          className="my-10 mx-auto p-2 grid grid-cols-1 gap-3 bg-white w-full"
        >
          <div className="text-sm font-normal text-left">
            개인정보 보호를 위해 <br className="lg:hidden" />
            비밀번호를 한번 더 입력 해 주세요
          </div>
          <div
            id="id"
            className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
          >
            <label
              htmlFor="inputId"
              className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
            >
              아이디
            </label>
            <div className="lg:col-span-4">
              <input
                type="text"
                id="inputId"
                className="border lg:border-0 p-2 w-full text-sm"
                value={id}
                onChange={e => setId(e.currentTarget.value)}
                onBlur={e => setId(e.currentTarget.value)}
                autoComplete="on"
                disabled={id !== ""}
              />
            </div>
          </div>
          <div
            id="pwd"
            className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
          >
            <label
              htmlFor="inputPwd"
              className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
            >
              비밀번호
            </label>
            <div className="lg:col-span-4">
              <input
                type="password"
                id="inputPwd"
                className="border lg:border-0 p-2 w-full text-sm"
                value={pwd}
                onChange={e => {
                  setPwd(e.currentTarget.value);
                  if (pwd.length > 0) {
                    setIsErr(false);
                  }
                }}
                onBlur={e => setPwd(e.currentTarget.value)}
                autoComplete="on"
              />
            </div>
          </div>
          {isErr && (
            <div className="text-center text-sm pb-2 text-rose-500">
              {errMessage}
            </div>
          )}
          <div className="w-full grid grid-cols-4 gap-1">
            <button
              className="transition duration-100 w-full bg-emerald-500 hover:bg-emerald-700 p-2 text-white rounded col-span-3 hover:animate-wiggle"
              type="submit"
            >
              정보 수정하기
            </button>

            <Link
              to="/"
              className="transition duration-100 w-full border text-center hover:bg-red-50 border-red-500 hover:border-red-700 p-2 text-red-500 hover:text-red-700 rounded"
            >
              취소
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

export default PwdChk;
