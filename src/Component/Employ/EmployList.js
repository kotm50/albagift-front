import axios from "axios";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { logoutAlert } from "../LogoutUtil";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getNewToken, clearUser } from "../../Reducer/userSlice";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import AlertModal from "../Layout/AlertModal";

function EmployList() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page || 1;
  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  useEffect(() => {
    setKeyword("");
    getEmployList(page, keyword);
    console.log(list, totalPage, pagenate);
    //eslint-disable-next-line
  }, [thisLocation]);

  const getEmployList = async (p, k) => {
    let data = {
      page: p,
      size: 20,
    };

    if (k !== "") {
      data.searchKeyword = k;
    }
    await axios
      .post("/api/v1/board/get/job/postlist", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        console.log(res);
        if (res.headers.authorization) {
          await dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }

        if (res.data.code === "E999") {
          logoutAlert(
            null,
            null,
            dispatch,
            clearUser,
            navi,
            user,
            res.data.message
          );
          return false;
        }
        const totalP = res.data.totalPages;
        setTotalPage(res.data.totalPages);
        const pagenate = generatePaginationArray(p, totalP);
        setPagenate(pagenate);
        setList(res.data.goodsList);
      })
      .catch(e => {
        console.log(e);
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류"} // 제목
                message={"오류가 발생했습니다. 관리자에게 문의하세요"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
              />
            );
          },
        });
        setList([]);
      });
  };
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
  return <>EmployList</>;
}

export default EmployList;
