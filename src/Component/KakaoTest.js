import { useState } from "react";

function KakaoTest() {
  const [certData, setCertData] = useState({});
  const popupTest = () => {
    window.open(
      "/certification",
      "팝업테스트",
      "toolbar=no, width=480, height=900, directories=no, status=no, scrollorbars=no, resizable=no"
    );

    window.parentCallback = d => {
      setCertData(d);
    };
  };
  return (
    <>
      <button className="p-2 border" onClick={popupTest}>
        팝업값
      </button>
      {certData.tokenVersionId || 0}
    </>
  );
}

export default KakaoTest;
