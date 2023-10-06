import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";

function Admin() {
  const location = useLocation();
  console.log(location);
  const [loaded, setLoaded] = useState(false);
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
        } else {
          setLoaded(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const resetGoods = async () => {
    await axios
      .post("/api/v1/shop/admin/bizapi", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "C200") {
          alert("상품리셋 완료");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const resetBrands = async () => {
    await axios
      .post("/api/v1/shop/admin/brand", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        alert("브랜드리셋 완료");
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      {loaded && (
        <>
          <div className="bg-white p-2 container mx-auto xl:hidden">
            <div className="flex justify-between mb-3 p-2">
              <div className="mb-2 text-xl xl:text-3xl">
                안녕하세요 면접샵 관리자 페이지 입니다
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="bg-indigo-500 hover:bg-indigo-700 text-white p-2"
                  onClick={resetGoods}
                >
                  상품 리셋
                </button>
                <button
                  className="bg-indigo-500 hover:bg-indigo-700 text-white p-2"
                  onClick={resetBrands}
                >
                  브랜드 리셋
                </button>
              </div>
              <button
                className="p-2 bg-green-500 text-white hover:bg-green-700"
                onClick={e => navi("/")}
              >
                알바선물 메인으로
              </button>
            </div>
            <div className="grid grid-cols-4 bg-indigo-50 mb-2">
              <Link
                to="/admin/"
                className="hover:bg-indigo-100 p-2 text-center"
              >
                메인으로
              </Link>
              <Link
                to="/admin/pointlist"
                className="hover:bg-indigo-100 p-2 text-center"
              >
                지급 신청 목록
              </Link>
              <Link
                to="/admin/user"
                className="hover:bg-indigo-100 p-2 text-center"
              >
                회원목록
              </Link>
              <Link
                to="/admin/loginlog"
                className="hover:bg-indigo-100 p-2 text-center"
              >
                로그인 기록
              </Link>
              <Link
                to="/admin/transfer"
                className="hover:bg-indigo-100 p-2 text-center"
              >
                구버전 회원
              </Link>
            </div>
          </div>
          <div className="xl:hidden">
            <Outlet />
          </div>
          <div className="container mx-auto">
            <div className="hidden xl:grid grid-cols-12">
              <div className="flex flex-col justify-start divide-y ">
                <Link
                  to="/admin/"
                  className="bg-indigo-50 hover:bg-indigo-100 p-2 text-left"
                >
                  메인으로
                </Link>
                <Link
                  to="/admin/pointlist"
                  className="bg-indigo-50 hover:bg-indigo-100 p-2 text-left"
                >
                  지급 신청 목록
                </Link>
                <Link
                  to="/admin/user"
                  className="bg-indigo-50 hover:bg-indigo-100 p-2 text-left"
                >
                  회원목록
                </Link>
                <Link
                  to="/admin/loginlog"
                  className="bg-indigo-50 hover:bg-indigo-100 p-2 text-left"
                >
                  로그인 기록
                </Link>
                <Link
                  to="/admin/transfer"
                  className="bg-indigo-50 hover:bg-indigo-100 p-2 text-left"
                >
                  구버전 회원
                </Link>
              </div>
              <div className="col-span-11 p-2">
                <div className="flex justify-between mb-3 p-2 bg-gray-50 border-b">
                  <div className="mb-2 text-xl xl:text-3xl">
                    안녕하세요 면접샵 관리자 페이지 입니다
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-700 text-white p-2"
                      onClick={resetGoods}
                    >
                      상품 리셋
                    </button>
                    <button
                      className="bg-indigo-500 hover:bg-indigo-700 text-white p-2"
                      onClick={resetBrands}
                    >
                      브랜드 리셋
                    </button>
                  </div>
                  <button
                    className="p-2 bg-green-500 text-white hover:bg-green-700"
                    onClick={e => navi("/")}
                  >
                    알바선물 메인으로
                  </button>
                </div>
                <Outlet />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Admin;
