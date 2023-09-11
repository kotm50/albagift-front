import React from "react";
import { Link } from "react-router-dom";
import UserInformation from "./UserInfomation";

function UserSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 py-3">
      <div className="h-24 bg-blue-500 text-white p-2">가입프로모션</div>
      <div className="bg-blue-500 text-white p-2">
        <Link to="/board/write?boardId=B01">포인트신청</Link>
      </div>
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
