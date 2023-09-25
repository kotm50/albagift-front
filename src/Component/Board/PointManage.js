import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../Reducer/userSlice";

import axios from "axios";

function PointManage(props) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);

  const [point, setPoint] = useState("");

  const checkUsers = (doc, checked) => {
    if (checked) {
      // 체크박스가 선택된 경우, 아이템을 배열에 추가
      setSelectedUsers([
        ...selectedUsers,
        { userId: doc.userId, phone: doc.phone, name: doc.userName },
      ]);
      setSelectedUsersId([...selectedUsersId, { userId: doc.userId }]);
    } else {
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedUsers(
        selectedUsers.filter(item => item.userId !== doc.userId)
      );
      // 체크박스가 선택 해제된 경우, 아이템을 배열에서 제거
      setSelectedUsersId(
        selectedUsersId.filter(item => item.userId !== doc.userId)
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
          setPoint(0);
          setSelectedUsers([]);
          setSelectedUsersId([]);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      {props.listlength > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 mt-2 bg-white p-2 container mx-auto">
          {props.listmap((doc, idx) => (
            <div key={idx}>
              <input
                type="checkbox"
                value={doc.userId}
                className="hidden peer"
                id={doc.userId}
                onChange={e => checkUsers(doc, e.target.checked)}
              />
              <label
                htmlFor={doc.userId}
                className="block p-2 bg-teal-50 hover:bg-teal-200 text-black rounded-lg border-2 border-teal-50 hover:border-teal-200 peer-checked:border-teal-500 peer-checked:hover:border-teal-500"
              >
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    이름
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center">
                    {doc.userName}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    연락처
                  </div>
                  <div className="font-normal col-span-2 flex flex-col justify-center">
                    {formatPhoneNumber(doc.phone)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="font-medium flex flex-col justify-center text-right">
                    포인트
                  </div>
                  <div
                    className="font-normal col-span-2 flex flex-col justify-center"
                    title={doc.point}
                  >
                    {doc.point} point
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      ) : null}
      {selectedUsers.length > 0 && (
        <>
          <div className="fixed container bottom-0 left-1/2 -translate-x-1/2 bg-white p-3 rounded-t-xl drop-shadow-xl">
            <div className="test-xl xl:text-2xl font-medium text-left">
              포인트 지급(차감)대상
            </div>
            <div className="mt-2 flex flex-row flex-wrap gap-2">
              {selectedUsers.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-yellow-50 rounded-xl flex flex-col gap-2 justify-center"
                >
                  <p>이름 : {doc.name}</p>
                  <p>연락처 : {doc.phone}</p>
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

export default PointManage;
