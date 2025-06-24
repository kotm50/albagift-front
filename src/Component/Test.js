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
      const url = `/adapi/check?name=${encodeURIComponent(
        name
      )}&phone=${encodeURIComponent(phone)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.exists === true && Array.isArray(data.matched)) {
        setResult({ type: "success", matched: data.matched });
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
      style={{ maxWidth: 500, margin: "2em auto", fontFamily: "sans-serif" }}
    >
      <h2 style={{ fontWeight: "bold", marginBottom: "1em" }}>
        면접 대상자 확인
      </h2>
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

      {result && result.message && (
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

      {result && result.type === "success" && (
        <div style={{ marginTop: "1.5em" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "0.5em" }}>
            조회 결과
          </h3>
          {result.matched.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1em",
                marginBottom: "1em",
                backgroundColor: item.owner ? "#e6ffed" : "#f9f9f9",
              }}
            >
              <div>
                <strong>이름 일치 여부:</strong>{" "}
                {item.owner ? "✅ 일치함" : "❌ 다름"}
              </div>
              <div>
                <strong>면접상태:</strong> {item.apply_status}
              </div>
              <div>
                <strong>면접시간:</strong> {item.interview_time}
              </div>
              <div>
                <strong>고객사명:</strong> {item.com_name}
              </div>
              <div>
                <strong>지점명:</strong> {item.com_area}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
