import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutAlert } from "../LogoutUtil";
import { clearUser, getNewToken } from "../../Reducer/userSlice";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import AlertModal from "../Layout/AlertModal";

function EmployApply() {
  const navi = useNavigate();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch;
  const thisLocation = useLocation();
  const [applyList, setApplyList] = useState([]);

  useEffect(() => {
    getApplyList();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getApplyList = async () => {
    const data = {
      page: 1,
      size: 99,
    };
    axios
      .post("/api/v1/board/get/job/applylist", data, {
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
        setApplyList(res.data.applyLists);
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
        setApplyList([]);
      });
  };

  return (
    <>
      {applyList.length > 0 ? (
        <div className="flex flex-row justify-start gap-x-2 flex-wrap">
          {applyList.map((apply, idx) => (
            <span key={idx}>
              |고객사번호 : {apply.jobCode}, 이름 : {apply.userName}|
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default EmployApply;
