import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

function FindPwd() {
  const navi = useNavigate();
  const location = useLocation();
  const [id, setId] = useState("");
  const [chked, setChked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [correctPwdChk, setCorrectPwdChk] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);

  useEffect(() => {
    if (location.state) {
      if (location.state.id) {
        setId(location.state.id);
      }
      if (location.state.chk === "chked") {
        setChked(true);
      }
    }
    //eslint-disable-next-line
  }, []);
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
      .patch("/api/v1/user/upt/new/pwd", {
        userId: location.state.id,
        userPwd: pwd,
      })
      .then(res => {
        console.log(res);
        if (res.data.code === "C000") {
          alert("비밀번호를 수정했습니다. 로그인 후 이용해 주세요");
          navi("/login");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  //아이디 중복검사
  const chkId = async () => {
    await axios
      .get("/api/v1/user/dupchkid", { params: { userId: id } })
      .then(res => {
        if (res.data.code === "C000") {
          alert(
            "아이디를 찾을 수 없습니다. 아이디가 기억나지 않으시면\n'아이디 찾기'를 진행해 주세요"
          );
        } else {
          navi(`/cert?gubun=reco&userId=${id}`);
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <div className="mx-auto bg-white certArea pb-5 pt-20">
      <h2 className="text-xl xl:text-2xl font-neoextra mb-3">
        알바선물 비밀번호 찾기
      </h2>
      {!chked ? (
        <>
          <div className="text-sm xl:text-base font-neo mb-3">
            가입하신 아이디를 입력해 주세요 <br />
            아이디가 기억나지 않으시면 '아이디 찾기'를 진행해 주세요
          </div>
          <div className="grid grid-cols-1 pt-3">
            <label htmlFor="inputId" className="text-sm">
              비밀번호를 찾을 아이디
            </label>
            <input
              id="inputId"
              name="inputId"
              value={id}
              className="border p-2"
              onChange={e => setId(e.currentTarget.value)}
              onBlur={e => setId(e.currentTarget.value)}
            />
          </div>
          <div className="absolute z-20 w-64 xl:w-96 bottom-20 left-1/2 -translate-x-1/2 grid grid-cols-1 gap-y-2">
            <button
              className="py-3 bg-blue-500 hover:bg-blue-700 text-white w-full rounded-full"
              onClick={e => chkId()}
            >
              이 아이디로 비밀번호 찾기
            </button>

            <button
              className="py-3 border border-blue-500 hover:border-blue-700 text-blue-500 hover:text-blue-700 w-full rounded-full"
              onClick={e => navi("/findpwd")}
            >
              아이디 찾기
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-sm xl:text-base font-neo mb-3">
            새로운 비밀번호를 입력해 주세요.
          </div>
          <div className="grid grid-cols-1 pt-3 border-t">
            <label htmlFor="inputId" className="text-xs">
              새로운 비밀번호
            </label>
            <input
              id="inputPwd"
              name="inputPwd"
              type="password"
              value={pwd}
              className="border p-2"
              onChange={e => {
                setPwd(e.currentTarget.value);
              }}
              onBlur={e => {
                setPwd(e.currentTarget.value);
                if (pwd !== "") testPwd();
              }}
            />
          </div>

          {!correctPwd && (
            <div className="text-sm text-rose-500">
              비밀번호 양식이 틀렸습니다 <br className="block xl:hidden" />
              확인 후 다시 입력해 주세요
            </div>
          )}
          <div className="grid grid-cols-1 pt-3 ">
            <label htmlFor="inputId" className="text-xs">
              새로운 비밀번호 확인
            </label>
            <input
              id="inputPwdChk"
              name="inputPwdChk"
              type="password"
              value={pwdChk}
              className="border p-2"
              onChange={e => {
                setPwdChk(e.currentTarget.value);
              }}
              onBlur={e => {
                setPwdChk(e.currentTarget.value);
                if (pwdChk !== "") chkPwd();
              }}
            />
          </div>
          {!correctPwdChk && (
            <div className="text-sm text-rose-500">
              비밀번호가 일치하지 않습니다 <br className="block xl:hidden" />
              확인 후 다시 입력해 주세요
            </div>
          )}
          <div className="absolute z-20 w-64 xl:w-96 bottom-20 left-1/2 -translate-x-1/2 grid grid-cols-1">
            <button
              className="py-3 bg-blue-500 hover:bg-blue-700 text-white w-full rounded-full"
              onClick={e => editPwd(e)}
            >
              비밀번호 변경
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FindPwd;
