import { useEffect } from "react";

const APP_VERSION = process.env.REACT_APP_VERSION || "1.0.0"; // 환경변수 가져오기

const useHardReload = () => {
  useEffect(() => {
    const lastReloadVersion = localStorage.getItem("lastReloadVersion");
    const url = new URL(window.location.href);

    // ✅ 만약 URL에 `_reload`가 있으면 제거하고 원래 URL로 변경
    if (url.searchParams.has("_reload")) {
      url.searchParams.delete("_reload");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
      return;
    }

    // ✅ 환경변수가 변경되지 않았다면 새로고침 실행 X
    if (lastReloadVersion === APP_VERSION) {
      console.log("갱신완료");
      return;
    }

    console.log("갱신시작");

    // ✅ Firebase에서 최신 파일을 강제로 불러오기 위해 캐시 무효화
    const clearCacheAndReload = () => {
      Promise.all([
        caches
          .keys()
          .then(names => Promise.all(names.map(name => caches.delete(name)))), // 캐시 삭제
        sessionStorage.clear(), // ✅ localStorage 삭제 X (버전 유지해야 함)
      ]).then(() => {
        // ✅ `_reload` 추가 후 강제 새로고침 (Firebase의 최신 배포 적용)
        url.searchParams.set("_reload", new Date().getTime());
        localStorage.setItem("lastReloadVersion", APP_VERSION); // ✅ 새로운 버전 저장
        window.location.replace(url.toString());
      });
    };

    clearCacheAndReload();
  }, []);
};

export default useHardReload;
