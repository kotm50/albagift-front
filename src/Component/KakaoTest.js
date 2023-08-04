import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

function KakaoTest() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const user = useSelector(state => state.user);
  useEffect(() => {
    //test2();

    setSortParams();
    //eslint-disable-next-line
  }, []);

  const setSortParams = () => {
    setSearchParams(searchParams);
    const code = searchParams.get("code");
    if (code) {
      kakaoLoginCheck(code);
    }
  };

  const kakaoLoginCheck = async code => {
    console.log(code);
    const loginUrl = `/api/v1/user/login/kakao?code=${code}`;
    await axios
      .get(loginUrl)
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e, "에러");
      });
  };
  const test = async () => {
    await axios
      .patch("/api/v1/user/myinfo/delete", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleDateChange = setFunc => event => {
    setFunc(event.target.value);
  };
  /*
  const test2 = async () => {
    await axios
      .post("/api/v1/user/admin/buy/point/lky1004", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  */

  const kakaoLogin = () => {
    const apiKey = "e8b025aca3eb87648da9d341528bca5a";
    const redirectUrl = "http://albagift.shop/test";
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectUrl}&response_type=code`;
    window.location.href = kakaoURL;
  };

  return (
    <>
      <div className="grid grid-cols-2 bg-gray-50 p-2 my-2">
        <div className="grid grid-cols-10 gap-x-2">
          <div className="col-span-2"></div>
          <div className="col-span-3 text-sm text-left">시작일</div>
          <div className="col-span-3 text-sm text-left">종료일</div>
          <div className="col-span-2"></div>
          <div className="py-2 text-center col-span-2">날짜선택</div>
          <div className="col-span-3">
            <input
              id="inputDate"
              type="date"
              value={start}
              className="p-2 border  w-full"
              onChange={handleDateChange(setStart)}
            />
          </div>
          <div className="col-span-3">
            <input
              id="inputDate"
              type="date"
              value={end}
              className="p-2 border w-full"
              onChange={handleDateChange(setEnd)}
            />
          </div>
          <div className="text-center col-span-2">
            <button
              className="w-full bg-green-500 hover:bg-green-700 p-2 text-white"
              onClick={test}
            >
              탈퇴
            </button>
          </div>
        </div>
      </div>

      <button
        className="bg-yellow-300 hover:bg-yellow-500 text-black font-medium p-2 w-48"
        onClick={kakaoLogin}
      >
        카카오 로그인
      </button>
    </>
  );
}

export default KakaoTest;
