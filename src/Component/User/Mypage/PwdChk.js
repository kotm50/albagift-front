import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

function PwdChk(props) {
  const user = useSelector(state => state.user);
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [domain, setDomain] = useState("");

  useEffect(() => {
    setId(user.userId);
    let domain = extractDomain();
    setDomain(domain);
    //eslint-disable-next-line
  }, []);

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
            개인정보 보호를 위해 <br className="xl:hidden" />
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
