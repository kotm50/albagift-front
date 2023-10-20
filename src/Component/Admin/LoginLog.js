import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Pagenate from "../Layout/Pagenate";
import { getNewToken } from "../../Reducer/userSlice";

function LoginLog() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const [loginLogList, setLoginLogList] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  useEffect(() => {
    if (keyword !== "") {
      setSearchKeyword(keyword);
    }
    getLog(page, keyword);
    //eslint-disable-next-line
  }, [location]);
  const user = useSelector(state => state.user);
  const getLog = async (p, s) => {
    let data = {};
    if (s === "") {
      data = {
        page: p,
        size: 20,
      };
    } else {
      data = {
        page: p,
        size: 20,
        searchKeyword: s,
      };
    }
    await axios
      .get("/api/v1/user/admin/get/log", {
        params: data,
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        if (res.headers.authorization) {
          await dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        const totalP = res.data.totalPages;
        setTotalPage(res.data.totalPages);
        const pagenate = generatePaginationArray(p, totalP);
        setPagenate(pagenate);
        let log = [];
        let loginLogList = res.data.loginLogList;
        loginLogList.forEach(element => {
          let data = {};
          data.date = element.regDate;
          data.name = element.userName;
          data.id = element.userId;
          data.role = element.role === "ROLE_USER" ? "이용자" : "관리자";
          data.phone = element.phone;
          data.ip = element.clientIP;
          log.push(data);
        });
        setLoginLogList(log);
      })
      .catch(e => {
        console.log(e);
      });

    function generatePaginationArray(currentPage, totalPage) {
      let paginationArray = [];

      // 최대 페이지가 4 이하인 경우
      if (Number(totalPage) <= 4) {
        for (let i = 1; i <= totalPage; i++) {
          paginationArray.push(i);
        }
        return paginationArray;
      }

      // 현재 페이지가 1 ~ 3인 경우
      if (Number(currentPage) <= 3) {
        return [1, 2, 3, 4, 5];
      }

      // 현재 페이지가 totalPage ~ totalPage - 2인 경우
      if (Number(currentPage) >= Number(totalPage) - 2) {
        return [
          Number(totalPage) - 4,
          Number(totalPage) - 3,
          Number(totalPage) - 2,
          Number(totalPage) - 1,
          Number(totalPage),
        ];
      }

      // 그 외의 경우
      return [
        Number(currentPage) - 2,
        Number(currentPage) - 1,
        Number(currentPage),
        Number(currentPage) + 1,
        Number(currentPage) + 2,
      ];
    }
  };

  const searchIt = () => {
    let domain = `${pathName}${
      searchKeyword !== "" ? `?keyword=${searchKeyword}` : ""
    }`;
    navi(domain);
  };
  return (
    <>
      <div className="mt-2 container p-4 mx-auto bg-white rounded-lg">
        <div className="flex flex-row justify-start gap-3 mb-4">
          <div className="font-neo text-lg p-2">검색어</div>
          <div>
            <input
              value={searchKeyword}
              className="border border-gray-300 p-2 w-80 block rounded-lg font-neo"
              placeholder="이름 또는 연락처를 입력해 주세요"
              onChange={e => setSearchKeyword(e.currentTarget.value)}
            />
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-sm text-white"
              onClick={searchIt}
            >
              검색하기
            </button>
          </div>
        </div>
        {loginLogList.length > 0 && (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-green-700 text-white font-neoextra">
                  <td className="p-2 text-center border">아이디</td>
                  <td className="p-2 text-center border">이름</td>
                  <td className="p-2 text-center border">구분</td>
                  <td className="p-2 text-center border">연락처</td>
                  <td className="p-2 text-center border">시간</td>
                  <td className="p-2 text-center border">ip주소</td>
                </tr>
              </thead>
              <tbody>
                {loginLogList.map((log, idx) => (
                  <tr
                    key={idx}
                    className={`${idx % 2 === 1 ? "bg-yellow-50" : null}`}
                  >
                    <td className="p-2 text-center border">{log.id}</td>
                    <td className="p-2 text-center border">{log.name}</td>
                    <td className="p-2 text-center border">{log.role}</td>
                    <td className="p-2 text-center border">{log.phone}</td>
                    <td className="p-2 text-center border">
                      {dayjs(log.date).format(
                        "YYYY년 MM월 DD일 HH시 mm분 ss초"
                      )}
                    </td>
                    <td className="p-2 text-center border">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagenate
              pagenate={pagenate}
              page={Number(page)}
              totalPage={Number(totalPage)}
              pathName={pathName}
              keyword={keyword}
            />
          </>
        )}
      </div>
    </>
  );
}

export default LoginLog;
