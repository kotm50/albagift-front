import React, { useState, useEffect } from "react";

function KakaoTest() {
  const [date, setDate] = useState("");
  const [now, setNow] = useState("");
  const [before, setBefore] = useState("");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JavaScript에서 월은 0부터 시작하므로 1을 더해줍니다.
    const day = today.getDate();

    setNow(
      `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`
    );

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const beforeYear = oneMonthAgo.getFullYear();
    const beforeMonth = oneMonthAgo.getMonth() + 1; // JavaScript에서 월은 0부터 시작하므로 1을 더해줍니다.
    const beforeDay = oneMonthAgo.getDate();

    setBefore(
      `${beforeYear}-${beforeMonth < 10 ? "0" + beforeMonth : beforeMonth}-${
        beforeDay < 10 ? "0" + beforeDay : beforeDay
      }`
    );
  }, [now]);

  return (
    <div className="container mx-auto">
      <p>Now: {now}</p>
      <p>Before: {before}</p>
      <p>
        날짜설정:{" "}
        <input
          type="date"
          value={date}
          className="border border-gray-300 p-2 w-80 block rounded-lg font-neo"
          placeholder="이름 또는 연락처를 입력해 주세요"
          onChange={e => setDate(e.currentTarget.value)}
        />
      </p>
    </div>
  );
}

export default KakaoTest;
