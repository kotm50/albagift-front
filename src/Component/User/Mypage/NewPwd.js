import React, { useState } from "react";

import axios from "axios";

function NewPwd(props) {
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [correctPwdChk, setCorrectPwdChk] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);

  //비밀번호 양식 확인
  const testPwd = () => {
    if (pwd.length > 0) {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{2,}$/;
      let correct = regex.test(pwd);
      if (correct) {
        if (pwd.length > 5) {
          setCorrectPwd(true);
        } else {
          setCorrectPwd(false);
        }
      } else {
        setCorrectPwd(false);
      }
    } else {
      setCorrectPwd(true);
    }
  };

  //비밀번호 일치 확인
  const chkPwd = () => {
    if (pwd.length > 0) {
      if (pwd !== pwdChk) {
        setCorrectPwdChk(false);
      } else {
        setCorrectPwdChk(true);
      }
    } else {
      setCorrectPwdChk(true);
    }
  };

  const editPwd = async e => {
    e.preventDefault();

    if (pwdChk === "") {
      return alert("비밀번호를 확인해 주세요");
    }
    if (!correctPwd) {
      return alert("비밀번호 양식이 잘못되었습니다");
    }
    if (!correctPwdChk) {
      return alert("비밀번호가 일치하지 않습니다");
    }
    axios
      .patch(
        "/api/v1/user/myinfo/editpwd",
        { userPwd: pwd },
        {
          headers: {
            Authorization: props.user.accessToken,
          },
        }
      )
      .then(res => {
        if (res.data.code === "C000") {
          alert("비밀번호를 수정했습니다. 다시 로그인 해주세요");
          props.logout();
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <>
      <div className="p-2">
        <button
          className="w-full p-2 text-blue-500 hover:text-blue-700 bg-gray-100 hover:bg-gray-200 rounded-full hover:animate-wiggle"
          onClick={e => props.setPwdOpen(false)}
        >
          비밀번호 변경취소
        </button>
      </div>
      <div className="xl:p-2">
        <div
          id="editArea"
          className="my-2 mx-auto p-2 border rounded-lg grid grid-cols-1 gap-3 bg-gray-50 w-full"
        >
          <div
            id="pwd"
            className={`grid grid-cols-1 xl:grid-cols-5 xl:divide-x xl:border ${
              !correctPwd ? "xl:border-red-500" : null
            }`}
          >
            <label
              htmlFor="inputPwd"
              className={`text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 ${
                correctPwd ? "xl:bg-gray-100" : "xl:bg-red-100"
              } `}
            >
              새 비밀번호
            </label>
            <div className="xl:col-span-4">
              <input
                type="password"
                id="inputPwd"
                className={`border ${
                  !correctPwd ? "border-red-500" : undefined
                } xl:border-0 p-2 w-full text-sm`}
                value={pwd}
                onChange={e => {
                  setPwd(e.currentTarget.value);
                }}
                onBlur={e => {
                  setPwd(e.currentTarget.value);
                  if (pwd !== "") testPwd();
                }}
                placeholder="영어/숫자/특수문자 중 2가지 이상"
                autoComplete="off"
              />
            </div>
          </div>
          {!correctPwd && (
            <div className="text-sm text-rose-500">
              비밀번호 양식이 틀렸습니다 <br className="block xl:hidden" />
              확인 후 다시 입력해 주세요
            </div>
          )}
          <div
            id="pwdChk"
            className={`grid grid-cols-1 xl:grid-cols-5 xl:divide-x xl:border ${
              !correctPwdChk ? "xl:border-red-500" : undefined
            }`}
          >
            <label
              htmlFor="inputPwdChk"
              className={`text-sm text-left xl:text-right flex flex-col justify-center mb-2 xl:mb-0 xl:pr-2 ${
                correctPwdChk ? "xl:bg-gray-100" : "xl:bg-red-100"
              } `}
            >
              새 비밀번호확인
            </label>
            <div className="xl:col-span-4">
              <input
                type="password"
                id="inputPwdChk"
                className={`border ${
                  !correctPwdChk ? "border-red-500" : undefined
                } xl:border-0 p-2 w-full text-sm`}
                value={pwdChk}
                onChange={e => {
                  setPwdChk(e.currentTarget.value);
                }}
                onBlur={e => {
                  setPwdChk(e.currentTarget.value);
                  if (pwdChk !== "") chkPwd();
                }}
                placeholder="비밀번호를 한번 더 입력해 주세요"
                autoComplete="off"
              />
            </div>
          </div>
          {!correctPwdChk && (
            <div className="text-sm text-rose-500">
              비밀번호가 일치하지 않습니다 <br className="block xl:hidden" />
              확인 후 다시 입력해 주세요
            </div>
          )}
          <div className="p-2 text-center">
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white py-2 px-10"
              onClick={e => editPwd(e)}
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPwd;
