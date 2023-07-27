import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../Reducer/userSlice";

import axios from "axios";

//import { dummyUser } from "./dummy";

function UserList() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState("잠시만 기다려 주세요");

  const [point, setPoint] = useState("");

  useEffect(() => {
    if (point < 0) {
      alert("마이너스로 지정할 수 없습니다");
      setPoint(0);
    }
  }, [point]);

  const getUserList = async () => {
    setUsers([]);
    await axios
      .post("/api/v1/user/admin/userlst", null, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        console.log(res);
        setUsers(res.data.userList);
        if (res.data.length === 0) {
          setLoading("회원이 없습니다");
        } else {
          setLoading("로딩 완료");
        }
      })
      .catch(e => {
        console.log(e);
        setLoading("오류가 발생했습니다.");
      });
  };

  const checkUsers = (user, checked) => {
    if (checked) {
      // 체크박스가 선택된 경우, 아이템을 배열에 추가
      setSelectedUsers([
        ...selectedUsers,
        { userId: user.userId, phone: user.phone, name: user.userName },
      ]);
      setSelectedUsersId([...selectedUsersId, { userId: user.userId }]);
    } else {
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedUsers(
        selectedUsers.filter(item => item.userId !== user.userId)
      );
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedUsersId(
        selectedUsersId.filter(item => item.userId !== user.userId)
      );
    }
  };

  const formatPhoneNumber = phoneNumber => {
    if (phoneNumber && phoneNumber.length === 11) {
      const formattedNumber = phoneNumber.replace(
        /(\d{3})(\d{4})(\d{4})/,
        "$1-$2-$3"
      );
      return formattedNumber;
    }
    return phoneNumber;
  };

  const incPoint = async () => {
    const request = {
      idList: selectedUsersId,
      point: point,
    };
    console.log(request.userList);
    console.log(request.point);
    await axios
      .post("/api/v1/user/admin/manage/point/P", request, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.headers.authorization) {
          if (res.headers.authorization !== user.accessToken) {
            dispatch(
              getNewToken({
                accessToken: res.headers.authroiztion,
              })
            );
          }
        }
        console.log(res.data);
        console.log(res.headers);
        if (res.data.code === "C000") {
          getUserList();
          setPoint(0);
          setSelectedUsers([]);
          setSelectedUsersId([]);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const decPoint = async () => {
    const request = {
      idList: selectedUsersId,
      point: point,
    };
    console.log(request.userList);
    console.log(request.point);
    await axios
      .post("/api/v1/user/admin/manage/point/D", request, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.headers.authorization) {
          if (res.headers.authorization !== user.accessToken) {
            dispatch(
              getNewToken({
                accessToken: res.headers.authroiztion,
              })
            );
          }
        }
        console.log(res.data);
        console.log(res.headers);
        if (res.data.code === "C000") {
          getUserList();
          setPoint(0);
          setSelectedUsers([]);
          setSelectedUsersId([]);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getUserList(); // 실제 회원
    //setUsers(dummyUser); // 더미 회원
    //setLoading("로딩 완료"); // 더미 회원 로딩
    //eslint-disable-next-line
  }, [location]);

  return (
    <>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 mt-2 bg-white p-2">
          {users.map((user, idx) => (
            <div key={idx}>
              <input
                type="checkbox"
                value={user.userId}
                className="hidden peer"
                id={user.userId}
                onChange={e => checkUsers(user, e.target.checked)}
              />
              <label
                htmlFor={user.userId}
                className="block p-2 bg-indigo-50 hover:bg-indigo-200 text-black rounded-lg border-2 border-indigo-50 hover:border-indigo-200 peer-checked:border-indigo-500 peer-checked:hover:border-indigo-500"
              >
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    이름
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center">
                    {user.userName}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    연락처
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center">
                    {formatPhoneNumber(user.phone)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    포인트
                  </div>
                  <div
                    className="font-normal col-span-2 flex flex-col justify-center"
                    title={user.point}
                  >
                    {user.point} point
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <>{loading}</>
      )}
      {selectedUsers.length > 0 && (
        <>
          <div className="fixed container bottom-0 left-1/2 -translate-x-1/2 bg-white p-3 rounded-t-xl drop-shadow-xl">
            <div className="test-xl xl:text-2xl font-medium text-left">
              포인트 지급(차감)대상
            </div>
            <div className="mt-2 flex flex-row flex-wrap gap-2">
              {selectedUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-yellow-50 rounded-xl flex flex-col gap-2 justify-center"
                >
                  <p>이름 : {user.name}</p>
                  <p>연락처 : {user.phone}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 bg-rose-50 p-2 grid grid-cols-1 xl:grid-cols-2 gap-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(Number(point) + 1000)}
                >
                  +1000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(Number(point) + 5000)}
                >
                  + 5000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(Number(point) + 10000)}
                >
                  + 10000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                  onClick={e => setPoint(Number(point) - 1000)}
                >
                  - 1000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                  onClick={e => setPoint(Number(point) - 5000)}
                >
                  - 5000
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                  onClick={e => setPoint(0)}
                >
                  0 으로
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="number"
                  className="p-2 bg-white border font-medium"
                  value={point}
                  onChange={e => setPoint(e.currentTarget.value)}
                  onBlur={e => setPoint(e.currentTarget.value)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="transition duration-150 ease-out p-2 bg-sky-500 hover:bg-sky-700 text-white rounded-lg font-medium hover:animate-wiggle"
                    onClick={incPoint}
                  >
                    포인트 지급
                  </button>
                  <button
                    className="transition duration-150 ease-out p-2 bg-white  border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 hover:border-red-700 hover:text-red-700  hover:animate-wiggle"
                    onClick={decPoint}
                  >
                    포인트 차감
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default UserList;
