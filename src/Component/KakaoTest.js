import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loginUser } from "../Reducer/userSlice";

function KakaoTest() {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [memo, setMemo] = useState("");
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
    const loginUrl = `/api/v1/user/login/kakao?code=${code}`;
    await axios
      .get(loginUrl)
      .then(res => {
        const data = res.data.socialUser;
        if (res.data.code === "K000") {
          navi("/join", {
            state: {
              id: data.id,
              email: data.email,
              socialType: data.socialType,
            },
          });
        } else {
          dispatch(
            loginUser({
              userId: data.userId,
              userName: data.userName,
              accessToken: res.headers.authorization,
              lastLogin: new Date(),
              point: data.point,
              admin: false,
            })
          );
          navi("/");
        }
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
    const redirectUrl = "http://localhost:3000/test";
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectUrl}&response_type=code`;
    window.location.href = kakaoURL;
  };
  const saveMemo = async () => {
    console.log(user);
    const data = {
      trId: "koti_20230720_00000004",
      content: memo,
    };
    await axios
      .post("/api/v1/shop/goods/ins/memo", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => console.log(res))
      .catch(error => console.log(error));

    await axios
      .post("/api/v1/shop/goods/memo", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => console.log(res))
      .catch(error => console.log(error));
  };

  const editMemo = async () => {
    const data = {
      trId: "koti_20230720_00000004",
      content: memo,
    };
    await axios
      .patch("/api/v1/shop/goods/upt/memo", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => console.log(res))
      .catch(error => console.log(error));

    await axios
      .post("/api/v1/shop/goods/memo", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => console.log(res))
      .catch(error => console.log(error));
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
        className="bg-yellow-300 hover:bg-yellow-500 text-black font-medium p-2 w-48 mb-2"
        onClick={kakaoLogin}
      >
        카카오 로그인
      </button>
      <a href="/test">파라미터삭제</a>
      <div className="mt-3">
        <input
          type="text"
          value={memo}
          className="border p-2"
          onChange={e => setMemo(e.currentTarget.value)}
        />
        <button className="bg-indigo-500 p-2" onClick={saveMemo}>
          메모저장
        </button>
        <button className="bg-green-500 p-2" onClick={editMemo}>
          메모수정
        </button>
      </div>
    </>
  );
}

export default KakaoTest;
