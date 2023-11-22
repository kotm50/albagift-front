import React, { useState, useEffect } from "react";

export default function KakaoTest() {
  const [tabCount, setTabCount] = useState(0);

  useEffect(() => {
    // 탭 카운트 초기화
    const updateTabCount = () => {
      const currentCount = parseInt(localStorage.getItem("tabCount") || "0");
      setTabCount(currentCount);
    };

    updateTabCount();

    // 탭이 추가될 때 카운터 증가
    const incrementTabCount = () => {
      const newCount = parseInt(localStorage.getItem("tabCount") || "0") + 1;
      localStorage.setItem("tabCount", newCount);
    };

    incrementTabCount();

    // 탭이 닫힐 때 카운터 감소
    const decrementTabCount = () => {
      const newCount = Math.max(
        parseInt(localStorage.getItem("tabCount") || "0") - 1,
        0
      );
      localStorage.setItem("tabCount", newCount);
    };

    // unload 이벤트 리스너 추가
    window.addEventListener("beforeunload", decrementTabCount);

    // storage 이벤트 리스너 추가
    const handleStorageChange = event => {
      if (event.key === "tabCount") {
        updateTabCount();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 이벤트 리스너 제거
    return () => {
      window.removeEventListener("beforeunload", decrementTabCount);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return <div>현재 열린 탭 수: {tabCount}</div>;
}
