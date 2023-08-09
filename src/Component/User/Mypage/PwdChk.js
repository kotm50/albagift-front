import React, { useEffect, useState } from "react";
import axios from "axios";

function PwdChk(props) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    setId(props.user.userId);
    //eslint-disable-next-line
  }, []);

  const identity = async e => {
    e.preventDefault();
    const data = {
      userPwd: pwd,
    };
    await axios
      .post("/api/v1/user/myinfo/pwdchk", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "C000") {
          props.setCheckPwd(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <form onSubmit={e => identity(e)}>
      <div
        id="chkArea"
        className="my-2 mx-auto p-2 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white xl:fixed xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 w-full"
      >
        <div className="text-lg font-medium text-center">마이페이지</div>
        <div className="text-sm font-normal text-left">
          개인정보 보호를 위해
          <br />
          비밀번호를 한번 더 입력 해 주세요
        </div>
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
              disabled={id !== ""}
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
        <div className="w-full grid grid-cols-4 gap-1">
          <button
            className="transition duration-100 w-full bg-emerald-500 hover:bg-emerald-700 p-2 text-white rounded col-span-3 hover:animate-wiggle"
            type="submit"
          >
            정보 수정하기
          </button>

          <a
            href="/"
            className="transition duration-100 w-full border text-center hover:bg-red-50 border-red-500 hover:border-red-700 p-2 text-red-500 hover:text-red-700 rounded"
          >
            취소
          </a>
        </div>
      </div>
    </form>
  );
}

export default PwdChk;
