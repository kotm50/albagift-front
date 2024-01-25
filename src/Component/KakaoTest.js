import React from "react";
import axios from "axios";

function KakaoTest() {
  const gubun = "join";
  const doCert = () => {
    window.open(
      "/certification",
      "본인인증팝업",
      "toolbar=no, width=480, height=900, directories=no, status=no, scrollorbars=no, resizable=no"
    );

    window.parentCallback = d => {
      certToBack(d);
    };
  };

  const certToBack = async d => {
    let data = d;
    console.log(data);
    data.gubun = gubun;
    //data = {token, enc, int, gubun, id, email}
    await axios
      .post("/api/v1/user/nice/dec/result", data)
      .then(res => {
        console.log(res);
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="mx-auto container">
      <button onClick={doCert} className="bg-indigo-500 text-white p-2">
        업로드
      </button>
    </div>
  );
}

export default KakaoTest;
