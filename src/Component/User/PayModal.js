import React, { useState, useEffect } from "react";

function PayModal(props) {
  const [date, setDate] = useState(props.doc.intvDate);
  const [hour, setHour] = useState(props.doc.intvTime);
  const [minute, setMinute] = useState(props.doc.intvMin);

  const [editConfirm, setEditConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleBack = event => {
      props.onClose(); // props.onClose()를 실행하여 부모 컴포넌트의 onClose 함수를 호출합니다.
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack); // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
    };
  }, [props]);

  return (
    <div
      id="paymodal"
      className="max-w-screen p-5 bg-white border text-sm xl:text-base rounded-lg drop-shadow relative"
    >
      <button
        className="bg-white hover:bg-gray-50 p-2 rounded text-center absolute top-2 right-2 w-10 h-10"
        onClick={e => {
          props.onClose();
        }}
      >
        X
      </button>
      {!editConfirm && !deleteConfirm ? (
        <>
          <h2 className="text-lg font-neoextra mb-2 text-center">
            면접날짜 수정/삭제
          </h2>
          <div className="text-sm mb-2 text-center">
            수정하려면 날짜와 시간을 선택하세요
          </div>
          <div className="xl:w-4/5 mx-auto">
            <div className="flex flex-row justify-start gap-1">
              <div className="px-2 py-3">면접날짜</div>
              <div className="p-2 text-center bg-white hover:bg-gray-50">
                <input
                  id="inputDate"
                  type="date"
                  value={date}
                  onChange={e => {
                    setDate(e.target.value);
                  }}
                  className="border rounded border-gray-500 py-1 px-2"
                />
              </div>
            </div>
            <div className="flex flex-row justify-start gap-1 mb-3">
              <div className="px-2 py-4">면접시간</div>
              <div className="p-2 text-center bg-white hover:bg-gray-50 grid grid-cols-2">
                <div className="grid grid-cols-4 py-1">
                  {/* 시간 선택 */}
                  <select
                    className="col-span-3 p-1 border border-gray-500 rounded"
                    value={hour}
                    onChange={e => setHour(e.target.value)}
                  >
                    {Array.from({ length: 24 }).map((_, idx) => (
                      <option key={idx} value={String(idx)}>
                        {String(idx)}
                      </option>
                    ))}
                  </select>
                  <div className="p-1">시</div>
                </div>
                <div className="grid grid-cols-4 py-1">
                  {/* 분 선택 */}
                  <select
                    className="col-span-3 p-1 border border-gray-500 rounded"
                    value={minute}
                    onChange={e => setMinute(e.target.value)}
                  >
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <option
                        key={idx}
                        value={String(idx * 10).padStart(2, "0")}
                        className="h-auto"
                      >
                        {String(idx * 10).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <div className="p-1">분</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-center gap-3">
            <button
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={e => {
                setEditConfirm(true);
              }}
            >
              수정하기
            </button>
            <button
              className="bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded"
              onClick={e => {
                setDeleteConfirm(true);
              }}
            >
              삭제하기
            </button>
          </div>
        </>
      ) : null}
      {editConfirm && (
        <>
          <h2 className="text-lg font-neoextra mb-2 text-center">
            면접날짜 수정하기
          </h2>
          <div className="flex flex-row justify-center gap-1">
            <div className="px-2 py-3">면접일시</div>
            <div className="px-2 py-3 text-center bg-white hover:bg-gray-50">
              {date} {hour}:{minute}
            </div>
          </div>
          <div className="px-2 py-4 text-center">
            위 내용으로 수정하시겠습니까?
          </div>
          <div className="flex flex-row justify-center gap-3">
            <button
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={e => {
                props.editIt(props.doc, date, hour, minute);
                props.onClose();
              }}
            >
              수정하기
            </button>
            <button
              className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
              onClick={e => {
                setEditConfirm(false);
              }}
            >
              취소하기
            </button>
          </div>
        </>
      )}

      {deleteConfirm && (
        <>
          <h2 className="text-lg font-neoextra mb-2 text-center">
            면접날짜 수정하기
          </h2>
          <div className="flex flex-row justify-center gap-1">
            <div className="px-2 py-3">면접일시</div>
            <div className="px-2 py-3 text-center bg-white hover:bg-gray-50">
              {date} {hour}:{minute}
            </div>
          </div>
          <div className="px-2 py-4 text-center">
            위 지급신청을 삭제하시겠습니까?
          </div>
          <div className="flex flex-row justify-center gap-3">
            <button
              className="bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded"
              onClick={e => {
                props.deleteIt(props.doc);
                props.onClose();
              }}
            >
              삭제하기
            </button>
            <button
              className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
              onClick={e => {
                setDeleteConfirm(false);
              }}
            >
              취소하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PayModal;
