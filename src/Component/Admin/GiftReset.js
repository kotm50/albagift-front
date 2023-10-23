import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { getNewToken } from "../../Reducer/userSlice";

function GiftReset() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const resetGoods = async () => {
    await axios
      .post("/api/v1/shop/admin/bizapi", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.headers.authorization) {
          dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        if (res.data.code === "C200") {
          alert("상품리셋 완료");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const resetBrands = async () => {
    await axios
      .post("/api/v1/shop/admin/brand", null, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        if (res.headers.authorization) {
          dispatch(
            getNewToken({
              accessToken: res.headers.authorization,
            })
          );
        }
        alert("브랜드리셋 완료");
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      <div>상품 리셋</div>
      <div className="">
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white p-2"
          onClick={resetGoods}
        >
          상품 불러오기
        </button>
      </div>
      <div>브랜드 리셋</div>
      <div className="">
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white p-2"
          onClick={resetBrands}
        >
          브랜드 불러오기
        </button>
      </div>
    </>
  );
}

export default GiftReset;
