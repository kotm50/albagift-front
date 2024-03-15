import React, { useState } from "react";

function KakaoTest() {
  const [color, setColor] = useState("#fff");

  return (
    <div className={`mx-auto container h-[500px] bg-[${color}]`}>
      <div className="p-2 bg-[#eaeaea] flex justify-start gap-x-2">
        <button className="bg-[#333] p-2" onClick={() => setColor("#333")}>
          버튼
        </button>
        <button className="bg-[#666] p-2" onClick={() => setColor("#666")}>
          버튼
        </button>
        <button className="bg-[#999] p-2" onClick={() => setColor("#999")}>
          버튼
        </button>
        <button className="bg-[#ccc] p-2" onClick={() => setColor("#ccc")}>
          버튼
        </button>
        <button className="bg-[#fff] p-2" onClick={() => setColor("#fff")}>
          버튼
        </button>
      </div>
    </div>
  );
}

export default KakaoTest;
