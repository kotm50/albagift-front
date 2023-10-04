import React from "react";
import axios from "axios";

function Apply(props) {
  const updateData = async () => {
    if (props.applies.length > 0) {
      console.log(props.user);
      let data = {
        protoList: props.applies,
      };
      console.log(data);
      await axios
        .post("/api/v1/user/proto", data, {
          headers: { Authorization: props.user.accessToken },
        })
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      alert("구 회원 리스트 불러오는 중 입니다");
    }
  };
  return (
    <>
      {props.props.applies.length > 0
        ? "구 회원 목록 불러오기 완료"
        : "구 회원 목록 불러오는 중..."}
      <br />
      <br />
      <button
        className={`p-2 text-white ${
          props.props.applies.length > 0 ? "bg-blue-500" : "bg-stone-900"
        }`}
        disabled={props.props.applies.legnth === 0}
        onClick={e => {
          updateData();
        }}
      >
        {props.props.applies.length > 0
          ? "구 회원 목록 입력하기"
          : "잠시만 기다려 주세요"}
      </button>
    </>
  );
}

export default Apply;
