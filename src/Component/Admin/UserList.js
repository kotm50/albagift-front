import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../Reducer/userSlice";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import axios from "axios";
import AlertModal from "../Layout/AlertModal";
import queryString from "query-string";
import Pagenate from "../Layout/Pagenate";

//import { dummyUser } from "./dummy";

function UserList() {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState("잠시만 기다려 주세요");
  const [isAgree, setIsAgree] = useState(false);

  const [point, setPoint] = useState("");

  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (point < 0) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"오류!!"} // 제목
              message={"마이너스로 지정할 수 없습니다"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      setPoint(0);
      return false;
    }
  }, [point]);

  useEffect(() => {
    if (keyword !== "") {
      setSearchKeyword(keyword);
    }
    loadList(page, keyword, isAgree);
    //eslint-disable-next-line
  }, [location, isAgree]);

  const loadList = async (p, s, b) => {
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
      .post("/api/v1/user/admin/userlst", data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        if (res.data.code === "C000") {
          const totalP = res.data.totalPages;
          setTotalPage(res.data.totalPages);
          const pagenate = generatePaginationArray(p, totalP);
          setPagenate(pagenate);
        } else {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"오류!!"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                  doIt={goBack} // 확인시 실행할 함수
                />
              );
            },
          });
        }
        let users = [];
        if (b) {
          users = res.data.userList.filter(item => item.agreeYn === "Y");
        } else {
          users = res.data.userList;
        }
        setUsers(users);
      })
      .catch(e => {
        console.log(e);
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <AlertModal
                onClose={onClose} // 닫기
                title={"오류!!"} // 제목
                message={"알 수 없는 오류가 발생했습니다"} // 내용
                type={"alert"} // 타입 confirm, alert
                yes={"확인"} // 확인버튼 제목
                doIt={goBack} // 확인시 실행할 함수
              />
            );
          },
        });
        return false;
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

  const goBack = () => {
    navi(-1);
  };

  const searchIt = () => {
    let domain = `${pathName}${
      searchKeyword !== "" ? `?keyword=${searchKeyword}` : ""
    }`;
    navi(domain);
  };

  const getUserList = async b => {
    setLoading("잠시만 기다려 주세요...");
    setUsers([]);
    await axios
      .post("/api/v1/user/admin/userlst", null, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        const userList = res.data.userList;
        if (!b) {
          setUsers(userList);
        } else {
          const list = userList.filter(item => item.agreeYn === "Y");
          setUsers(list);
        }
        if (res.data.length === 0) {
          setLoading("회원이 없습니다");
        } else {
          setLoading("잠시만 기다려 주세요...");
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
        {
          userId: user.userId,
          phone: user.phone,
          name: user.userName,
          agreeYn: user.agreeYn,
        },
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
    setLoading("잠시만 기다려 주세요");
    const request = {
      idList: selectedUsersId,
      point: point,
    };
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
        if (res.data.code === "C000") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"완료"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          getUserList(isAgree);
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
    setLoading("잠시만 기다려 주세요");
    const request = {
      idList: selectedUsersId,
      point: point,
    };
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
        if (res.data.code === "C000") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <AlertModal
                  onClose={onClose} // 닫기
                  title={"완료"} // 제목
                  message={res.data.message} // 내용
                  type={"alert"} // 타입 confirm, alert
                  yes={"확인"} // 확인버튼 제목
                />
              );
            },
          });
          getUserList(isAgree);
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
      {users.length > 0 ? (
        <>
          <div className="flex justify-end gap-2 text-sm font-neoextra container mx-auto">
            <div className="flex items-center">
              <input
                id="agreeUser"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={isAgree}
                onChange={e => setIsAgree(!isAgree)}
              />
              <label
                htmlFor="agreeUser"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                동의회원만 보기
              </label>
            </div>
          </div>

          <h2 className="p-4 text-center font-neoheavy text-3xl">
            지급 신청 목록
          </h2>
          <div className="flex flex-row justify-start gap-3 mb-4 container mx-auto">
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
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 mt-2 bg-white p-2 container mx-auto">
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
                  className="block p-2 bg-teal-50 hover:bg-teal-200 text-black rounded-lg border-2 border-teal-50 hover:border-teal-200 peer-checked:border-teal-500 peer-checked:hover:border-teal-500"
                >
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="font-medium flex flex-col justify-center text-right">
                      이름
                    </div>
                    <div className="font-normal col-span-2 flex flex-col justify-center">
                      {user.userName}
                      {user.useYn === "S" && (
                        <span className="text-rose-500 text-sm ml-2">
                          (탈퇴예정)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="font-medium flex flex-col justify-center text-right">
                      연락처
                    </div>
                    <div className="font-normal col-span-2 flex flex-col justify-center">
                      {user.agreeYn === "Y"
                        ? formatPhoneNumber(user.phone)
                        : "비공개"}
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
        </>
      ) : (
        <div className="container mx-auto text-center font-neoextra text-3xl">
          {loading}
        </div>
      )}

      <Pagenate
        pagenate={pagenate}
        page={Number(page)}
        totalPage={Number(totalPage)}
        pathName={pathName}
        keyword={keyword}
      />
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
                  <p>연락처 : {user.agreeYn === "Y" ? user.phone : "비공개"}</p>
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
