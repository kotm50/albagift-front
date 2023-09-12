import React from "react";
import { Link } from "react-router-dom";
import UserInformation from "./UserInfomation";

function UserSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 py-3">
      <Link
        to="/board/write?boardId=B01"
        className="bg-blue-500 text-white p-2"
      >
        <div>면접보고 오셨어요?</div>
      </Link>
      <div className="bg-blue-500 text-white p-2">
        <Link to="/board/list?boardId=B01">포인트신청 내역</Link>
      </div>
      <div className="border p-2">
        <UserInformation />
      </div>
    </div>
  );
}

export default UserSection;
