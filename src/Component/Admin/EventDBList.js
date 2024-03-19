import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { logoutAlert } from "../LogoutUtil";
import { useLocation, useNavigate } from "react-router-dom";
import { clearUser } from "../../Reducer/userSlice";
import dayjs from "dayjs";
import axiosInstance from "../../Api/axiosInstance";

function EventDBList() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [dbList, setDbList] = useState([]);

  useEffect(() => {
    getDBList();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getDBList = async () => {
    await axiosInstance
      .post("/api/v1/user/applicants/get/list", null, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        if (res.data.code === "C000") {
          setDbList(res.data.applicantsList);
        } else {
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
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getPhoneNumber = number => {
    if (number.length === 10) {
      // 10자리 숫자일 경우
      return (
        number.substring(0, 3) +
        "-" +
        number.substring(3, 6) +
        "-" +
        number.substring(6, 10)
      );
    } else if (number.length === 11) {
      // 11자리 숫자일 경우
      return (
        number.substring(0, 3) +
        "-" +
        number.substring(3, 7) +
        "-" +
        number.substring(7, 11)
      );
    } else {
      // 유효하지 않은 입력 처리
      return "Invalid Number";
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-orange-600 text-white text-center font-neoheavy text-lg">
              <td className="border border-stone-700 p-2">이름</td>
              <td className="border border-stone-700 p-2">연락처</td>
              <td className="border border-stone-700 p-2">성별</td>
              <td className="border border-stone-700 p-2">생년월일</td>
              <td className="border border-stone-700 p-2">거주지</td>
            </tr>
          </thead>
          <tbody>
            {dbList && dbList.length > 0 ? (
              <>
                {dbList.map((db, idx) => (
                  <tr className="bg-white text-black text-center" key={idx}>
                    <td className="border border-stone-500 p-2">
                      {db.applicantName}
                    </td>
                    <td className="border border-stone-500 p-2">
                      {getPhoneNumber(db.phone)}
                    </td>
                    <td className="border border-stone-500 p-2">
                      {db.gender === "1" ? "남자" : "여자"}
                    </td>
                    <td className="border border-stone-500 p-2">
                      {dayjs(db.birth).format("YYYY년 MM월 DD일")}
                    </td>
                    <td className="border border-stone-500 p-2">
                      {db.address}
                    </td>
                  </tr>
                ))}
              </>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EventDBList;
