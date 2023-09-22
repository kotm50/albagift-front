import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Timer() {
  const navi = useNavigate();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 15분 경과 시 경고창 띄우기
  useEffect(() => {
    if (timer === 901) {
      // 15분 = 15 * 60 = 900초
      alert("본인인증 유효시간이 경과했습니다\n메인화면으로 돌아갑니다");
      navi("/");
    }
    //eslint-disable-next-line
  }, [timer]);

  return null; // 화면에는 아무것도 표시하지 않음
}

export default Timer;
