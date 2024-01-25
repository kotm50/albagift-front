import React from "react";
import { useParams } from "react-router-dom";
import Content1 from "./List/Content1";

function Sns() {
  const { id } = useParams();
  console.log(id);
  return (
    <>
      {!id && (
        <div className="text-center container mx-auto mt-20 z-10 relative">
          잘못 된 접근입니다
        </div>
      )}
      {id === "jobrecommend" && <Content1 />}
      <div className="fixed w-screen h-screen top-0 left-0 z-0 bg-rose-100" />
    </>
  );
}

export default Sns;
