import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

function Admin() {
  let navi = useNavigate();
  const user = useSelector(state => state.user);
  useEffect(() => {
    chkAdmin(user);
    //eslint-disable-next-line
  }, []);

  const chkAdmin = async user => {
    await axios
      .post("/api/v1/user/rolechk", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.data.code !== "A100") {
          alert(
            "관리자 전용 페이지입니다, 메인으로 이동합니다\n관리자 계정으로 로그인 하세요"
          );
          navi("/");
        }
      })
      .catch(e => {
        console.log(e);
      });
    console.log("테스트");
  };
  return (
    <>
      <div className="bg-white p-2 container mx-auto">
        <div className="mb-2 text-center text-xl xl:text-3xl">
          안녕하세요 면접샵 관리자 페이지 입니다
        </div>
        <div className="grid grid-cols-3 bg-indigo-50 mb-2">
          <Link to="/admin/" className="hover:bg-indigo-100 p-2 text-center">
            메인으로
          </Link>
          <Link
            to="/admin/user"
            className="hover:bg-indigo-100 p-2 text-center"
          >
            회원목록
          </Link>
          <Link
            to="/admin/"
            className="hover:bg-indigo-100 p-2 text-center"
            onClick={e => {
              e.preventDefault();
              alert("준비중 입니다");
            }}
          >
            준비중
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Admin;
