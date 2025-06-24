// Test.jsx
import { useState } from "react";

const Test = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!name.trim() || !phone.trim()) {
      setResult({ message: "이름과 연락처를 입력해주세요.", type: "error" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const url = `https://albagift.com/adapi/check?name=${encodeURIComponent(
        name
      )}&phone=${encodeURIComponent(phone)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.exists === true) {
        setResult({ message: "✅ 면접 대상자입니다.", type: "success" });
      } else if (data.exists === false) {
        setResult({ message: "❌ 면접 대상자가 아닙니다.", type: "notfound" });
      } else {
        setResult({ message: "⚠️ 예기치 않은 응답입니다.", type: "warn" });
      }
    } catch (err) {
      console.error("API 요청 실패:", err);
      setResult({ message: "❌ 서버 요청 실패", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ maxWidth: 400, margin: "2em auto", fontFamily: "sans-serif" }}
    >
      <h2>면접 대상자 확인</h2>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: "100%", padding: "0.5em", marginBottom: "1em" }}
      />
      <input
        type="text"
        placeholder="연락처"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={{ width: "100%", padding: "0.5em", marginBottom: "1em" }}
      />
      <button
        onClick={handleCheck}
        disabled={loading}
        style={{ width: "100%", padding: "0.75em", fontWeight: "bold" }}
      >
        {loading ? "조회 중..." : "확인하기"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "1.5em",
            fontWeight: "bold",
            color: getColor(result.type),
          }}
        >
          {result.message}
        </div>
      )}
    </div>
  );
};

// 색상 결정 함수
function getColor(type) {
  switch (type) {
    case "success":
      return "green";
    case "notfound":
      return "gray";
    case "warn":
      return "orange";
    case "error":
    default:
      return "red";
  }
}

export default Test;
