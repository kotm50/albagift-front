import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { clearUser } from "../../../Reducer/userSlice";

function Cancel() {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(state => state.user);
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    setId(user.userId);
    //eslint-disable-next-line
  }, [location]);

  const cancelIt = async e => {
    e.preventDefault();
    const really = window.confirm("정말 탈퇴하시겠습니까?");
    if (!really) {
      alert("탈퇴를 취소하셨습니다.\n메인페이지로 이동합니다");
      navi("/");
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
        console.log(res);
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
      .then(res => {
        if (res.data.code === "C000") {
          logout();
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
        alert("회원탈퇴가 완료되었습니다.\n이용해 주셔서 감사합니다.");
      })
      .catch(e => {
        console.log(e);
      });
    dispatch(clearUser());
    navi("/login");
  };
  return (
    <form onSubmit={e => cancelIt(e)}>
      <div
        id="cancelArea"
        className="my-2 mx-auto p-2 border shadow-lg rounded-lg grid grid-cols-1 gap-3 bg-white w-full"
      >
        <div className="text-lg font-medium text-center">회원탈퇴</div>
        <div className="text-sm font-normal text-left font-neo">
          회원 탈퇴를 진행하면 <span className="font-neoextra">'탈퇴회원'</span>
          으로 전환되어 <br className="xl:hidden" />
          이용이 불가능한 상태가 되며
          <br />
          전환 후 <span className="font-neoextra text-red-500">3개월</span> 경과
          시 모든 정보가 삭제됩니다. <br />
          정보가 삭제되기 전에 휴면계정으로 로그인을 시도하면 탈퇴를 취소할 수
          있습니다.
          <br />
          <br />
          탈퇴를 진행하려면 비밀번호 입력 후 <br className="xl:hidden" />
          <span className="font-neoextra text-red-500">'탈퇴하기'</span>버튼을
          눌러주세요
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
        {isErr && (
          <div className="text-center text-sm pb-2 text-rose-500">
            {errMessage}
          </div>
        )}
        <div className="w-full grid grid-cols-4 gap-1">
          <button
            className="transition duration-100 w-full bg-rose-500 hover:bg-rose-700 p-2 text-white rounded col-span-3 hover:animate-wiggle"
            type="submit"
          >
            탈퇴하기
          </button>

          <Link
            to="/"
            className="transition duration-100 w-full border text-center hover:bg-gray-50 border-gray-500 hover:border-gray-700 p-2 text-gray-500 hover:text-gray-700 rounded"
          >
            취소
          </Link>
        </div>
      </div>
    </form>
  );
}

export default Cancel;
