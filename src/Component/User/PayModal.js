import React, { useState } from "react";

import axios from "axios";

function PayModal(props) {
  const [date, setDate] = useState(props.doc.intvDate);
  const [hour, setHour] = useState(props.doc.intvTime);
  const [minute, setMinute] = useState(props.doc.intvMin);

  const [editConfirm, setEditConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [editComplete, setEditComplete] = useState(false);
  const [deleteComplete, setDeleteComplete] = useState(false);

  const editIt = async () => {
    let data = {
      boardId: "B02",
      postId: props.doc.postId,
      intvDate: date,
      intvTime: hour,
      intvMin: minute,
    };
    await axios
      .patch("/api/v1/board/upt/pnt/posts", data, {
        headers: { Authorization: props.user.accessToken },
      })
      .then(res => {
        if (res.data.code === "C000") {
          setEditComplete(true);
          setEditConfirm(false);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteIt = async () => {
    const data = { boardId: "B02", postId: props.doc.postId };
    await axios
      .patch("/api/v1/board/del/posts", data, {
        headers: {
          Authorization: props.user.accessToken,
        },
      })
      .then(res => {
        if (res.data.code === "C000") {
          setDeleteComplete(true);
          setDeleteConfirm(false);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div
      id="alertmodal"
      className="max-w-screen p-4 bg-white border text-sm xl:text-base"
    >
      {!editConfirm && !deleteConfirm && !editComplete && !deleteComplete ? (
        <>
          <h2 className="text-lg font-neoextra mb-2">면접날짜 수정/삭제</h2>
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
          <div className="flex flex-row justify-start gap-1">
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
                    <option key={idx} value={String(idx * 10).padStart(2, "0")}>
                      {String(idx * 10).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <div className="p-1">분</div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-start gap-1">
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
            <button
              className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
              onClick={e => {
                props.onClose();
              }}
            >
              창닫기
            </button>
          </div>
        </>
      ) : null}
      {editConfirm && (
        <>
          <h2 className="text-lg font-neoextra mb-2">면접날짜 수정하기</h2>
          <div className="flex flex-row justify-start gap-1">
            <div className="px-2 py-3">면접일시</div>
            <div className="px-2 py-3 text-center bg-white hover:bg-gray-50">
              {date} {hour}:{minute}
            </div>
          </div>
          <div className="px-2 py-4">위 내용으로 수정하시겠습니까?</div>
          <div className="flex flex-row justify-start gap-1">
            <button
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={e => {
                editIt();
              }}
            >
              수정하기
            </button>
            <button
              className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
              onClick={e => {
                props.onClose();
              }}
            >
              취소하기
            </button>
          </div>
        </>
      )}
      {editComplete && (
        <>
          <h2 className="text-lg font-neoextra mb-2">면접날짜 수정하기</h2>
          <div className="px-2 py-4">수정 완료</div>
          <div className="flex flex-row justify-start gap-1">
            <button
              className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
              onClick={e => {
                props.loadList();
                props.onClose();
              }}
            >
              창닫기
            </button>
          </div>
        </>
      )}

      {deleteConfirm && (
        <>
          <h2 className="text-lg font-neoextra mb-2">면접날짜 수정하기</h2>
          <div className="flex flex-row justify-start gap-1">
            <div className="px-2 py-3">면접일시</div>
            <div className="px-2 py-3 text-center bg-white hover:bg-gray-50">
              {date} {hour}:{minute}
            </div>
          </div>
          <div className="px-2 py-4">위 지급신청을 삭제하시겠습니까?</div>
          <div className="flex flex-row justify-start gap-1">
            <button
              className="bg-rose-500 hover:bg-rose-700 text-white px-4 py-2 rounded"
              onClick={e => {
                deleteIt();
              }}
            >
              삭제하기
            </button>
            <button
              className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
              onClick={e => {
                props.onClose();
              }}
            >
              취소하기
            </button>
          </div>
        </>
      )}
      {deleteComplete && (
        <>
          <h2 className="text-lg font-neoextra mb-2">지급신청 취소</h2>
          <div className="px-2 py-4">신청내용을 삭제하였습니다</div>
          <div className="flex flex-row justify-start gap-1">
            <button
              className="bg-stone-500 hover:bg-stone-700 text-white px-4 py-2 rounded"
              onClick={e => {
                props.loadList();
                props.onClose();
              }}
            >
              창닫기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PayModal;
