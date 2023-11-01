import React, { useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";

function KakaoTest() {
  const user = useSelector(state => state.user);
  const [trId, setTrId] = useState("");

  const chkCoupon = async c => {
    const data = {
      trId: trId,
    };
    await axios
      .post("/api/v1/shop/goods/coupons", data, {
        headers: { Authorization: user.accessToken },
      })
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="container mx-auto">
      <input
        type="text"
        className="m-2 p-2 border"
        id="page"
        name="page"
        value={trId}
        onChange={e => setTrId(e.currentTarget.value)}
      />
      <button
        type="submit"
        className="bg-green-500 p-2 text-white"
        onClick={e => chkCoupon()}
      >
        후아
      </button>
    </div>
  );
}

export default KakaoTest;
