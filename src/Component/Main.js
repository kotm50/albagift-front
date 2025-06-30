import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../Reducer/userSlice";

import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../Api/axiosInstance";

import { logout } from "./LogoutUtil";

function Main() {
  const user = useSelector(state => state.user);
  const navi = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({});
  const [selectedGift, setSelectedGift] = useState(null);

  useEffect(() => {
    if (user.userId) {
      if (user.admin) {
        navi("/admin");
        return;
      } else {
        getUserInfo();
      }
    }
    //eslint-disable-next-line
  }, []);

  const getUserInfo = async () => {
    setUserInfo({});
    await axiosInstance
      .post("/api/v1/user/myinfo", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(async res => {
        console.log(res.data.user);
        setUserInfo(res.data.user);
      })
      .catch(e => {
        console.log(e);
      });
  };
  function getPhone(phone) {
    if (!/^010\d{8}$/.test(phone)) {
      return phone; // 형식이 다르면 원본 반환
    }
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  const handleGiftRequest = async () => {
    if (!selectedGift) {
      alert("기프티콘 종류를 선택하세요.");
      return;
    }

    try {
      const res = await axiosInstance.post("/adapi/addgift", {
        name: userInfo.userName,
        phone: userInfo.phone,
        point: userInfo.point,
        gifticon: selectedGift,
      });

      if (res.data.success) {
        alert("기프티콘 요청이 완료되었습니다.");
        setSelectedGift(null);
      } else {
        alert(res.data.message || "요청 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("❌ 요청 실패:", err);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Helmet>
        <title>알바선물 | 면접보고 선물받자!</title>
      </Helmet>

      <div className="mx-auto container">
        <div className="text-center my-2 text-2xl">
          서비스 점검중 입니다. 불편을 끼쳐드려 죄송합니다
        </div>
        <div className="text-center my-2 p-2">
          기프티콘 발송 요청을 하시면 보유하신 포인트에 맞춰{" "}
          <span className="text-blue-500">"GS편의점 상품권"</span>
          또는 <span className="text-green-700">"스타벅스 교환권"</span>을
          지급해드리겠습니다. <br />
          (당사 제휴업체 면접자에 한함.)
          <div className="bg-gray-100 p-2 rounded-lg border border-gray-300 mt-4 w-[90%] max-w-[600px] mx-auto">
            {!user.userId && (
              <>
                <p className="text-center">로그인이 필요합니다</p>
                <Link
                  to="/login"
                  className="block text-center p-3 text-white bg-teal-500 hover:bg-teal-700 hover:animate-wiggle rounded w-[90%] max-w-[200px] mx-auto"
                >
                  알바선물 로그인 하기
                </Link>
              </>
            )}
            {user.userId && (
              <>
                <div className="text-left p-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
                  <div className="flex flex-col gap-2">
                    <p className="font-bold">이름</p>
                    <p>{userInfo.userName}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold">연락처</p>
                    <p>{getPhone(userInfo.phone)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold">보유 포인트</p>
                    <p>{userInfo.point}P</p>
                  </div>
                </div>
                <div className="text-center my-2">
                  아래 기프티콘을 보유하신 포인트에 맞춰 보내드립니다
                  <span className="text-sm">
                    (프로모션 포인트 제외, 프로모션 포인트는 추후 서비스 재개 시
                    사용 가능합니다)
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <button
                    className={`text-white ${
                      selectedGift === "gs" ? "bg-blue-500" : "bg-gray-400"
                    } p-2 rounded-lg w-full`}
                    onClick={() => {
                      if (selectedGift !== "gs") {
                        setSelectedGift("gs");
                      } else {
                        setSelectedGift(null);
                      }
                    }}
                    disabled={Number(userInfo.point) < 3000}
                  >
                    GS편의점 상품권
                    {Number(userInfo.point) < 3000 && "(3,000P 이상 필요)"}
                  </button>
                  <button
                    className={`text-white ${
                      selectedGift === "starbucks"
                        ? "bg-green-700"
                        : "bg-gray-400"
                    } p-2 rounded-lg w-full`}
                    onClick={() => {
                      if (selectedGift !== "starbucks") {
                        setSelectedGift("starbucks");
                      } else {
                        setSelectedGift(null);
                      }
                    }}
                    disabled={Number(userInfo.point) < 10000}
                  >
                    스타벅스 교환권
                    {Number(userInfo.point) < 10000 && "(10,000P 이상 필요)"}
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    className="bg-teal-500 hover:bg-teal-700 text-white px-4 py-2 rounded w-full"
                    onClick={handleGiftRequest}
                    disabled={!selectedGift}
                  >
                    {selectedGift
                      ? "기프티콘 요청하기"
                      : "기프티콘 종류 선택 후 요청"}
                  </button>
                </div>
              </>
            )}
          </div>
          {user.userId && (
            <button
              className="block font-neobold p-2 border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-700 hover:bg-gray-100 rounded lg:col-span-1 col-span-2 mx-auto mt-4"
              onClick={e => logout(dispatch, clearUser, navi, user)}
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Main;
