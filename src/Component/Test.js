import React, { useState } from "react";
import Modal from "./doc/Modal";

function Test() {
  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);
  return (
    <>
      <div className="w-[1000px] mx-auto">
        <button
          className="text-blue-500 hover:text-violet-700 p-2 text-xs w-full"
          onClick={e => {
            e.preventDefault();
            setModalCount(2);
            setModalOn(true);
          }}
        >
          상세보기
        </button>
      </div>

      {modalOn ? (
        <Modal
          modalCount={modalCount}
          setModalOn={setModalOn}
          setModalCount={setModalCount}
        />
      ) : null}
    </>
  );
}

export default Test;
