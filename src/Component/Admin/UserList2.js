import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { getNewToken } from "../../Reducer/userSlice";
import { confirmAlert } from "react-confirm-alert"; // 모달창 모듈
import "react-confirm-alert/src/react-confirm-alert.css"; // 모달창 css

import axios from "axios";

import AlertModal from "../Layout/AlertModal";
import queryString from "query-string";
import Pagenate from "../Layout/Pagenate";
import Sorry from "../doc/Sorry";
import Loading from "../Layout/Loading";
import dayjs from "dayjs";

//import { dummyUser } from "./dummy";

function UserList2() {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersId, setSelectedUsersId] = useState([]);
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isAgree, setIsAgree] = useState(true);

  const [point, setPoint] = useState(0);

  const pathName = location.pathname;
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const keyword = parsed.keyword || "";
  const [totalPage, setTotalPage] = useState(1);
  const [pagenate, setPagenate] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (point < 0) {
      setPoint(0);
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
      return false;
    }
  }, [point]);

  useEffect(() => {
    setUsers([]);
    setTotalPage(1);
    setPagenate([]);
    if (keyword !== "") {
      setSearchKeyword(keyword);
    }
    loadList(page, keyword, isAgree);
    //eslint-disable-next-line
  }, [location, isAgree, user.accessToken]);

  const handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchIt();
    }
  };

  const loadList = async (p, k, b) => {
    setLoaded(false);
    let data = {
      page: p,
      size: 20,
    };
    if (k !== "") {
      data.searchKeyword = k;
    }
    if (b) {
      data.agreeYn = "Y";
    }
    await axios
      .post("/api/v1/user/admin/userlst", data, {
        headers: {
          Authorization: user.accessToken,
        },
      })
      .then(res => {
        console.log(res);
        if (res.headers.authorization) {
          dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        setLoaded(true);
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
        if (users.length === 0) {
          return false;
        }
        setUsers(users);
      })
      .catch(e => {
        console.log(e);
        setLoaded(true);
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
    if (searchKeyword.length === 1) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <AlertModal
              onClose={onClose} // 닫기
              title={"조회 실패"} // 제목
              message={"검색어는 두 글자 이상 입력하세요"} // 내용
              type={"alert"} // 타입 confirm, alert
              yes={"확인"} // 확인버튼 제목
            />
          );
        },
      });
      return false;
    }
    let domain = `${pathName}${
      searchKeyword !== "" ? `?keyword=${searchKeyword}` : ""
    }`;
    navi(domain);
  };

  /*
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
  */

  //생일변환
  const getBirth = (str, separator, interval) => {
    let result = "";
    if (str.length === 6) {
      for (let i = 0; i < str.length; i += interval) {
        let chunk = str.substring(i, i + interval);
        result += chunk + separator;
      }
    } else if (str.length === 8) {
      let firstChunk = str.substring(0, 4);
      let secondChunk = str.substring(4, 6);
      let thirdChunk = str.substring(6, 8);
      result = `${firstChunk}${separator}${secondChunk}.${thirdChunk}`;
    }
    // 맨 마지막의 separator를 제거하여 반환합니다.
    return result;
  };

  //휴대폰변환
  const getPhone = str => {
    if (str.length !== 11) {
      // 문자열이 11자리가 아닌 경우에 대한 예외 처리
      return "Invalid input";
    }

    const firstPart = str.substring(0, 3); // 1, 2, 3번째 문자열
    const secondPart = "****"; // 4, 5, 6, 7번째 문자열은 '*'로 대체
    const thirdPart = str.substring(7, 11); // 8, 9, 10, 11번째 문자열

    // 조합하여 원하는 형식의 문자열을 만듭니다.
    const transformedString = `${firstPart}-${secondPart}-${thirdPart}`;
    return transformedString;
  };

  //휴대폰변환
  const getAgreePhone = str => {
    if (str.length !== 11) {
      // 문자열이 11자리가 아닌 경우에 대한 예외 처리
      return "Invalid input";
    }

    const firstPart = str.substring(0, 3); // 1, 2, 3번째 문자열
    const secondPart = str.substring(3, 7); // 4, 5, 6, 7번째 문자열은 '*'로 대체
    const thirdPart = str.substring(7, 11); // 8, 9, 10, 11번째 문자열

    // 조합하여 원하는 형식의 문자열을 만듭니다.
    const transformedString = `${firstPart}-${secondPart}-${thirdPart}`;
    return transformedString;
  };

  const incPoint = async () => {
    setLoaded(false);
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

        setLoaded(true);
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
          if (res.headers.authorization === user.accessToken) {
            loadList(page, keyword, isAgree);
          }
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
    setLoaded(false);
    const request = {
      idList: selectedUsersId,
      point: point,
    };
    await axios
      .post("/api/v1/user/admin/manage/point/D", request, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        setLoaded(true);
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
          if (res.headers.authorization === user.accessToken) {
            loadList(page, keyword, isAgree);
          }
          setPoint(0);
          setSelectedUsers([]);
          setSelectedUsersId([]);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleCopyClipBoard = async txt => {
    try {
      navigator.clipboard.writeText(txt);
    } catch (error) {
      alert("복사 실패!");
    }
  };

  return (
    <>
      {loaded ? (
        <>
          {users.length > 0 ? (
            <>
              <h2 className="p-4 text-center font-neoheavy text-3xl">
                회원 목록
              </h2>
              <div className="flex justify-between container mx-auto">
                <div className="flex flex-row justify-start gap-3 mb-4 container mx-auto pl-4">
                  <div className="font-neoextra text-lg p-2">검색어</div>
                  <div>
                    <input
                      type="text"
                      value={searchKeyword}
                      className="border border-gray-300 p-2 w-80 block rounded-lg font-neo"
                      placeholder="이름 또는 연락처를 입력해 주세요"
                      onChange={e => setSearchKeyword(e.currentTarget.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-sm text-white"
                    onClick={searchIt}
                  >
                    검색하기
                  </button>

                  <button
                    className="bg-gray-500 hover:bg-gray-700 py-2 px-4 rounded-sm text-white"
                    onClick={e => {
                      setSearchKeyword("");
                    }}
                  >
                    초기화
                  </button>
                </div>
                <div className="flex justify-end gap-2 text-sm font-neoextra container mx-auto pr-4">
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
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 mt-2 bg-white p-2 container mx-auto">
                {users.map((user, idx) => (
                  <div
                    key={idx}
                    className={`group bg-teal-50 hover:bg-teal-200 text-black rounded-lg border-2  ${
                      selectedUsersId.some(item => item.userId === user.userId)
                        ? " border-teal-500 hover:border-teal-500"
                        : "border-teal-50 hover:border-teal-200"
                    }`}
                  >
                    <div className="block p-2 ">
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="font-medium flex flex-col justify-center text-right font-neo">
                          프로모션
                        </div>
                        <div className="font-normal col-span-2 flex flex-col justify-center">
                          {user.promoYn === "Y" ? "프로모션 가입" : "일반 가입"}
                        </div>
                        <div></div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="font-medium flex flex-col justify-center text-right font-neo">
                          가입일
                        </div>
                        <div className="font-normal col-span-2 flex flex-col justify-center">
                          {dayjs(user.regDate).format("YYYY-MM-DD")}
                        </div>
                        <div></div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="font-medium flex flex-col justify-center text-right font-neo">
                          이름
                        </div>
                        <div className="font-normal col-span-2 flex flex-col justify-center">
                          {user.userName}
                        </div>
                        <button
                          className="p-1 bg-rose-500 text-white"
                          onClick={() => handleCopyClipBoard(user.userName)}
                        >
                          복사
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="font-medium flex flex-col justify-center text-right font-neo">
                          연락처
                        </div>
                        <div className="font-normal col-span-2 flex flex-col justify-center truncate">
                          {isAgree
                            ? getAgreePhone(user.phone || "00000000000")
                            : getPhone(user.phone || "00000000000")}
                        </div>
                        <button
                          className="p-1 bg-rose-500 text-white"
                          onClick={() =>
                            handleCopyClipBoard(
                              user.phone ? getAgreePhone(user.phone) : "미입력"
                            )
                          }
                        >
                          복사
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="font-medium flex flex-col justify-center text-right font-neo">
                          성별
                        </div>
                        <div className="font-normal col-span-2 flex flex-col justify-center">
                          {user.gender === "1" ? "남자" : "여자"}
                        </div>
                        <div></div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="font-medium flex flex-col justify-center text-right font-neo">
                          생년월일
                        </div>
                        <div className="font-normal col-span-2 flex flex-col justify-center">
                          {getBirth(user.birth || "000000", ".", 2)}
                        </div>
                        <div></div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        <div className="font-medium flex flex-col justify-center text-right font-neo">
                          주소
                        </div>
                        <div
                          className="font-normal col-span-2 flex flex-col justify-center truncate"
                          title={user.point}
                        >
                          {user.mainAddr}
                        </div>
                        <button
                          className="p-1 bg-rose-500 text-white"
                          onClick={() =>
                            handleCopyClipBoard(user.mainAddr || "미입력")
                          }
                        >
                          복사
                        </button>
                      </div>
                    </div>
                    <div className="text-center px-2 mb-3">
                      <Link
                        to={`/admin/userdetail?userId=${user.userId}`}
                        className="bg-indigo-500 hover:bg-indigo-700 text-white p-2 rounded-lg w-full block"
                      >
                        포인트 내역 확인
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Sorry message={"조회된 내역이 없습니다"} />
          )}
        </>
      ) : (
        <Loading />
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
            <div className="test-xl lg:text-2xl font-medium text-left">
              포인트 지급(차감)대상
            </div>
            <div className="mt-2 flex flex-row flex-wrap gap-2">
              {selectedUsers.map((user, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-yellow-50 rounded-xl flex flex-col gap-2 justify-center"
                >
                  <p>이름 : {user.name}</p>
                  <p>연락처 : {getPhone(user.phone)}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 bg-rose-50 p-2 grid grid-cols-1 lg:grid-cols-2 gap-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(1000)}
                >
                  1,000원
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(5000)}
                >
                  5,000원
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(10000)}
                >
                  10,000원
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(20000)}
                >
                  20,000원
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-green-700 hover:bg-green-900 text-white"
                  onClick={e => setPoint(30000)}
                >
                  30,000원
                </button>
                <button
                  className="transition duration-150 ease-out p-2 bg-rose-700 hover:bg-rose-900 text-white"
                  onClick={e => setPoint(0)}
                >
                  0원
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="number"
                  className="p-2 bg-white border font-medium"
                  value={point}
                  onChange={e => setPoint(e.currentTarget.value)}
                  onBlur={e => setPoint(e.currentTarget.value)}
                  onKeyDown={e => {
                    if (
                      e.key === "-" ||
                      e.key === "ArrowUp" ||
                      e.key === "ArrowDown"
                    ) {
                      e.preventDefault();
                    }
                  }}
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

export default UserList2;
