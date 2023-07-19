import React, { useState } from "react";
import { useSelector } from "react-redux";

import EditUser from "./Mypage/EditUser";
import PwdChk from "./Mypage/PwdChk";

function Mypage() {
  const user = useSelector(state => state.user);
  const [checkPwd, setCheckPwd] = useState(false);
  return (
    <>
      {!checkPwd ? (
        <PwdChk user={user} setCheckPwd={setCheckPwd} />
      ) : (
        <EditUser user={user} />
      )}
    </>
  );
}

export default Mypage;
